package com.webtourguide.patterns.booking;

import java.time.LocalDate;

/** CONCRETE STATE: staff confirmed the booking; it can now be completed. */
public class ConfirmedState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.CONFIRMED;
    }

    @Override
    public void complete(Booking booking) {
        booking.setStatus(BookingStatus.COMPLETED);
    }

    @Override
    public void cancel(Booking booking) {
        booking.setStatus(BookingStatus.CANCELLED);
    }

    @Override
    public void reschedule(Booking booking, LocalDate newDate) {
        booking.setBookingDate(newDate);
        booking.setStatus(BookingStatus.RESCHEDULED);
    }
}
