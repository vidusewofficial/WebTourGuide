package com.webtourguide.patterns.booking;

import java.time.LocalDate;

/** CONCRETE STATE: the date changed, so staff must confirm the booking again. */
public class RescheduledState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.RESCHEDULED;
    }

    @Override
    public void confirm(Booking booking) {
        booking.setStatus(BookingStatus.CONFIRMED);
    }

    @Override
    public void cancel(Booking booking) {
        booking.setStatus(BookingStatus.CANCELLED);
    }

    @Override
    public void reschedule(Booking booking, LocalDate newDate) {
        booking.setBookingDate(newDate);
    }
}
