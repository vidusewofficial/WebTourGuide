package com.webtourguide.booking.state;

import com.webtourguide.booking.Booking;
import com.webtourguide.booking.BookingStatus;

import java.time.LocalDate;

/**
 * State interface (State Pattern).
 *
 * Each booking status is a class that decides which actions are allowed
 * from it and which status comes next. BookingService no longer needs an
 * if/else per status: it asks the current state to perform the action.
 *
 * By default every action is rejected; each concrete state overrides only
 * the transitions it allows.
 */
public interface BookingState {

    BookingStatus getStatus();

    default void confirm(Booking booking) {
        throw notAllowed("confirm");
    }

    default void complete(Booking booking) {
        throw notAllowed("complete");
    }

    default void cancel(Booking booking) {
        throw notAllowed("cancel");
    }

    default void reschedule(Booking booking, LocalDate newDate) {
        throw notAllowed("reschedule");
    }

    private IllegalStateException notAllowed(String action) {
        return new IllegalStateException(
                "Cannot " + action + " a " + getStatus().name().toLowerCase() + " booking");
    }
}
