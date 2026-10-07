package com.webtourguide.patterns.booking;

/** CONCRETE STATE: the booking was cancelled. Final state - no actions allowed. */
public class CancelledState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.CANCELLED;
    }
}
