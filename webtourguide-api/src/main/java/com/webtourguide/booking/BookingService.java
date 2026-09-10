package com.webtourguide.booking;

import com.webtourguide.booking.dto.*;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.tourguide.TourGuide;
import com.webtourguide.tourguide.TourGuideRepository;
import com.webtourguide.tourpackage.TourPackage;
import com.webtourguide.tourpackage.TourPackageRepository;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingRepository repository;
    private final UserRepository userRepository;
    private final TourPackageRepository packageRepository;
    private final TourGuideRepository guideRepository;

    public BookingService(BookingRepository repository, UserRepository userRepository,
                           TourPackageRepository packageRepository, TourGuideRepository guideRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.packageRepository = packageRepository;
        this.guideRepository = guideRepository;
    }

    public BookingResponse create(BookingCreateRequest req, Authentication auth) {
        User tourist = currentUser(auth);
        TourPackage pkg = packageRepository.findById(req.getPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("Package " + req.getPackageId() + " not found"));

        TourGuide guide = null;
        if (req.getGuideId() != null) {
            guide = guideRepository.findById(req.getGuideId())
                    .orElseThrow(() -> new ResourceNotFoundException("Guide " + req.getGuideId() + " not found"));
        }

        BigDecimal totalPrice = pkg.getPrice().multiply(BigDecimal.valueOf(req.getParticipants()));

        Booking booking = Booking.builder()
                .tourist(tourist)
                .tourPackage(pkg)
                .guide(guide)
                .bookingDate(req.getBookingDate())
                .participants(req.getParticipants())
                .status(BookingStatus.PENDING)
                .totalPrice(totalPrice)
                .build();
        return toResponse(repository.save(booking));
    }

    public List<BookingResponse> getMyBookings(Authentication auth) {
        User tourist = currentUser(auth);
        return repository.findByTouristId(tourist.getId()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookingResponse cancel(Long id, Authentication auth) {
        Booking booking = findEntity(id);
        assertOwnerOrStaff(booking, auth);
        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(repository.save(booking));
    }

    public BookingResponse reschedule(Long id, RescheduleRequest req, Authentication auth) {
        Booking booking = findEntity(id);
        assertOwnerOrStaff(booking, auth);
        booking.setBookingDate(req.getNewBookingDate());
        booking.setStatus(BookingStatus.RESCHEDULED);
        return toResponse(repository.save(booking));
    }

    public String getStatus(Long id, Authentication auth) {
        Booking booking = findEntity(id);
        assertOwnerOrStaff(booking, auth);
        return booking.getStatus().name();
    }

    private User currentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    private void assertOwnerOrStaff(Booking booking, Authentication auth) {
        boolean isStaffOrAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))
                || auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_STAFF"));
        if (isStaffOrAdmin) return;
        if (!booking.getTourist().getEmail().equalsIgnoreCase(auth.getName()))
            throw new AccessDeniedException("You can only manage your own bookings");
    }

    private Booking findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking " + id + " not found"));
    }

    private BookingResponse toResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .touristId(b.getTourist().getId())
                .touristName(b.getTourist().getFullName())
                .packageId(b.getTourPackage() != null ? b.getTourPackage().getId() : null)
                .packageTitle(b.getTourPackage() != null ? b.getTourPackage().getTitle() : null)
                .guideId(b.getGuide() != null ? b.getGuide().getId() : null)
                .guideName(b.getGuide() != null ? b.getGuide().getUser().getFullName() : null)
                .bookingDate(b.getBookingDate())
                .participants(b.getParticipants())
                .status(b.getStatus().name())
                .totalPrice(b.getTotalPrice())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
