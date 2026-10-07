package com.webtourguide.booking.state;

import com.webtourguide.booking.BookingStatus;

/** Concrete state: the booking was cancelled. Final state - no actions allowed. */
public class CancelledState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.CANCELLED;
    }
}
