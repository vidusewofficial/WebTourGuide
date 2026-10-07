package com.webtourguide.booking.state;

import com.webtourguide.booking.BookingStatus;

/** Concrete state: the tour has taken place. Final state - no actions allowed. */
public class CompletedState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.COMPLETED;
    }
}
