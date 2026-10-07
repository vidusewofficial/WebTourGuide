package com.webtourguide.support.observer;

import com.webtourguide.booking.BookingService;
import com.webtourguide.booking.BookingStatus;
import com.webtourguide.support.SupportTicket;
import com.webtourguide.support.TicketStatus;
import com.webtourguide.support.TicketType;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * Concrete observer: resolving a cancellation request actually cancels the
 * linked booking, so Booking Management stays in sync with Customer Support.
 */
@Component
public class BookingCancellationObserver implements TicketStatusObserver {

    private final BookingService bookingService;

    public BookingCancellationObserver(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Override
    public void onStatusChanged(SupportTicket ticket, TicketStatus previousStatus, Authentication changedBy) {
        if (ticket.getStatus() != TicketStatus.RESOLVED
                || ticket.getType() != TicketType.CANCELLATION_REQUEST
                || ticket.getBooking() == null) {
            return;
        }
        BookingStatus bookingStatus = ticket.getBooking().getStatus();
        // A cancelled or completed booking is final, so there is nothing to cancel.
        if (bookingStatus == BookingStatus.CANCELLED || bookingStatus == BookingStatus.COMPLETED) {
            return;
        }
        bookingService.cancel(ticket.getBooking().getId(), changedBy);
    }
}
