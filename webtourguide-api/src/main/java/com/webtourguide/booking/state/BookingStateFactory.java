package com.webtourguide.booking.state;

import com.webtourguide.booking.BookingStatus;

/** Returns the state object for a stored booking status. */
public final class BookingStateFactory {

    private BookingStateFactory() {
    }

    public static BookingState of(BookingStatus status) {
        if (status == null) {
            return new PendingState();
        }
        return switch (status) {
            case PENDING -> new PendingState();
            case CONFIRMED -> new ConfirmedState();
            case RESCHEDULED -> new RescheduledState();
            case COMPLETED -> new CompletedState();
            case CANCELLED -> new CancelledState();
        };
    }
}
