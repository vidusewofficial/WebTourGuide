package com.webtourguide.patterns.booking;

import java.time.LocalDate;

/**
 * STATE INTERFACE (State Pattern) - Booking Management module.
 *
 * Each booking status is a class that decides which actions are allowed from
 * it and which status comes next. By default every action is rejected; each
 * concrete state overrides only the transitions it allows, so the service no
 * longer needs an if/else per status.
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
        String status = getStatus().name().toLowerCase();
        return new IllegalStateException(
                "Cannot " + action + " a " + status + " booking");
    }
}
