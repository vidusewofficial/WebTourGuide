package com.webtourguide.patterns.booking;

/** CONCRETE STATE: the tour has taken place. Final state - no actions allowed. */
public class CompletedState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.COMPLETED;
    }
}
