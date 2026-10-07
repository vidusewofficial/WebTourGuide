package com.webtourguide.support;

import com.webtourguide.booking.Booking;
import com.webtourguide.booking.BookingRepository;
import com.webtourguide.booking.BookingService;
import com.webtourguide.booking.BookingStatus;
import com.webtourguide.support.dto.TicketStatusUpdateRequest;
import com.webtourguide.support.observer.BookingCancellationObserver;
import com.webtourguide.support.observer.TicketStatusObserver;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketStatusObserverTest {

    @Mock private SupportTicketRepository repository;
    @Mock private UserRepository userRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private BookingService bookingService;
    @Mock private Authentication auth;
    @Mock private TicketStatusObserver firstObserver;
    @Mock private TicketStatusObserver secondObserver;

    private SupportTicket openTicket(Long id) {
        User staff = User.builder().id(2L).email("staff@example.com").build();
        return SupportTicket.builder()
                .id(id).raisedBy(User.builder().id(1L).build()).handledBy(staff)
                .type(TicketType.INQUIRY).status(TicketStatus.OPEN).build();
    }

    @Test
    void everyRegisteredObserverIsNotifiedWithThePreviousStatus() {
        SupportTicketService service = new SupportTicketService(
                repository, userRepository, bookingRepository, List.of(firstObserver, secondObserver));
        SupportTicket ticket = openTicket(5L);
        when(repository.findById(5L)).thenReturn(Optional.of(ticket));
        when(repository.save(any(SupportTicket.class))).thenAnswer(inv -> inv.getArgument(0));
        TicketStatusUpdateRequest req = new TicketStatusUpdateRequest();
        req.setStatus(TicketStatus.IN_PROGRESS);

        service.updateStatus(5L, req, auth);

        verify(firstObserver).onStatusChanged(ticket, TicketStatus.OPEN, auth);
        verify(secondObserver).onStatusChanged(ticket, TicketStatus.OPEN, auth);
    }

    @Test
    void cancellationObserverIgnoresCompletedBookings() {
        BookingCancellationObserver observer = new BookingCancellationObserver(bookingService);
        SupportTicket ticket = openTicket(6L);
        ticket.setType(TicketType.CANCELLATION_REQUEST);
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setBooking(Booking.builder().id(50L).status(BookingStatus.COMPLETED).build());

        observer.onStatusChanged(ticket, TicketStatus.IN_PROGRESS, auth);

        verify(bookingService, never()).cancel(any(), any());
    }

    @Test
    void cancellationObserverIgnoresOtherTicketTypes() {
        BookingCancellationObserver observer = new BookingCancellationObserver(bookingService);
        SupportTicket ticket = openTicket(7L);
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setBooking(Booking.builder().id(51L).status(BookingStatus.CONFIRMED).build());

        observer.onStatusChanged(ticket, TicketStatus.OPEN, auth);

        verify(bookingService, never()).cancel(any(), any());
    }
}
