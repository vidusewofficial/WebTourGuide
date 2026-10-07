package com.webtourguide.support;

import com.webtourguide.booking.Booking;
import com.webtourguide.booking.BookingRepository;
import com.webtourguide.booking.BookingService;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.support.dto.*;
import com.webtourguide.support.observer.BookingCancellationObserver;
import com.webtourguide.support.observer.TicketStatusObserver;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportTicketService {
    private final SupportTicketRepository repository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    /** Observer Pattern: everything that reacts to a ticket status change. */
    private final List<TicketStatusObserver> statusObservers;

    @Autowired
    public SupportTicketService(SupportTicketRepository repository, UserRepository userRepository,
                                 BookingRepository bookingRepository, List<TicketStatusObserver> statusObservers) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.statusObservers = statusObservers;
    }

    /** Convenience constructor (used by unit tests) with only the booking-cancellation observer. */
    public SupportTicketService(SupportTicketRepository repository, UserRepository userRepository,
                                 BookingRepository bookingRepository, BookingService bookingService) {
        this(repository, userRepository, bookingRepository,
                List.of(new BookingCancellationObserver(bookingService)));
    }

    public SupportTicketResponse create(SupportTicketCreateRequest req, Authentication auth) {
        User tourist = currentUser(auth);
        Booking booking = null;
        if (req.getBookingId() != null) {
            booking = bookingRepository.findById(req.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking " + req.getBookingId() + " not found"));
            if (!booking.getTourist().getId().equals(tourist.getId())) {
                throw new AccessDeniedException("You can only raise a request about your own booking");
            }
        }
        SupportTicket ticket = SupportTicket.builder()
                .raisedBy(tourist)
                .type(req.getType())
                .subject(req.getSubject())
                .message(req.getMessage())
                .booking(booking)
                .status(TicketStatus.OPEN)
                .build();
        return toResponse(repository.save(ticket));
    }

    public List<SupportTicketResponse> getMy(Authentication auth) {
        User tourist = currentUser(auth);
        return repository.findByRaisedById(tourist.getId()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SupportTicketResponse> getAll(TicketStatus statusFilter) {
        List<SupportTicket> tickets = statusFilter != null
                ? repository.findByStatus(statusFilter)
                : repository.findAll();
        return tickets.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SupportTicketResponse getById(Long id, Authentication auth) {
        SupportTicket ticket = findEntity(id);
        assertOwnerOrStaff(ticket, auth);
        return toResponse(ticket);
    }

    public void delete(Long id, Authentication auth) {
        SupportTicket ticket = findEntity(id);
        if (!isStaffOrAdmin(auth)) {
            if (!ticket.getRaisedBy().getEmail().equalsIgnoreCase(auth.getName()))
                throw new AccessDeniedException("You can only delete your own support tickets");
            if (ticket.getStatus() != TicketStatus.OPEN)
                throw new AccessDeniedException("Only open tickets can be deleted");
        }
        repository.delete(ticket);
    }

    public SupportTicketResponse updateStatus(Long id, TicketStatusUpdateRequest req, Authentication auth) {
        SupportTicket ticket = findEntity(id);
        TicketStatus previousStatus = ticket.getStatus();
        TicketStatus newStatus = req.getStatus();

        if (ticket.getHandledBy() == null) {
            ticket.setHandledBy(currentUser(auth));
        }
        ticket.setStatus(newStatus);
        if (newStatus == TicketStatus.RESOLVED || newStatus == TicketStatus.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
        } else {
            // Reopened (OPEN / IN_PROGRESS): it is no longer resolved.
            ticket.setResolvedAt(null);
        }

        // Notify before saving so a failing observer (e.g. the booking cannot be
        // cancelled) stops the ticket from being saved as resolved.
        notifyObservers(ticket, previousStatus, auth);
        return toResponse(repository.save(ticket));
    }

    private void notifyObservers(SupportTicket ticket, TicketStatus previousStatus, Authentication auth) {
        for (TicketStatusObserver observer : statusObservers) {
            observer.onStatusChanged(ticket, previousStatus, auth);
        }
    }

    private User currentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    private void assertOwnerOrStaff(SupportTicket ticket, Authentication auth) {
        if (isStaffOrAdmin(auth)) return;
        if (!ticket.getRaisedBy().getEmail().equalsIgnoreCase(auth.getName()))
            throw new AccessDeniedException("You can only view your own support tickets");
    }

    private boolean isStaffOrAdmin(Authentication auth) {
        return auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))
                || auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_STAFF"));
    }

    private String bookingSummary(Booking b) {
        String title = b.getTourPackage() != null ? b.getTourPackage().getTitle() : "Booking";
        return "#" + b.getId() + " - " + title + " (" + b.getBookingDate() + ")";
    }

    private SupportTicket findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Support ticket " + id + " not found"));
    }

    private SupportTicketResponse toResponse(SupportTicket t) {
        return SupportTicketResponse.builder()
                .id(t.getId())
                .raisedById(t.getRaisedBy().getId())
                .raisedByName(t.getRaisedBy().getFullName())
                .handledById(t.getHandledBy() != null ? t.getHandledBy().getId() : null)
                .handledByName(t.getHandledBy() != null ? t.getHandledBy().getFullName() : null)
                .bookingId(t.getBooking() != null ? t.getBooking().getId() : null)
                .bookingSummary(t.getBooking() != null ? bookingSummary(t.getBooking()) : null)
                .type(t.getType().name())
                .subject(t.getSubject())
                .message(t.getMessage())
                .status(t.getStatus().name())
                .createdAt(t.getCreatedAt())
                .resolvedAt(t.getResolvedAt())
                .build();
    }
}
