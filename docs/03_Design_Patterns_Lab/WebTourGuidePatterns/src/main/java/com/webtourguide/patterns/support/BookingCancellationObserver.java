package com.webtourguide.patterns.support;

import com.webtourguide.patterns.booking.Booking;
import com.webtourguide.patterns.booking.BookingStatus;

/**
 * CONCRETE OBSERVER: resolving a cancellation request actually cancels the
 * linked booking, so Booking Management stays in sync with Customer Support.
 */
public class BookingCancellationObserver implements TicketStatusObserver {

    @Override
    public void onStatusChanged(SupportTicket ticket, TicketStatus previousStatus,
                                String changedBy) {
        if (ticket.getStatus() != TicketStatus.RESOLVED
                || ticket.getType() != TicketType.CANCELLATION_REQUEST
                || ticket.getBooking() == null) {
            return;
        }
        Booking booking = ticket.getBooking();
        // A cancelled or completed booking is final, so there is nothing to cancel.
        if (booking.getStatus() == BookingStatus.CANCELLED
                || booking.getStatus() == BookingStatus.COMPLETED) {
            return;
        }
        booking.cancel();
        System.out.println("    [BookingCancellation] Booking #" + booking.getId()
                + " is now " + booking.getStatus());
    }
}
