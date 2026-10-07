package com.webtourguide.booking.state;

import com.webtourguide.booking.Booking;
import com.webtourguide.booking.BookingStatus;

import java.time.LocalDate;

/** Concrete state: a new booking waiting for staff confirmation. */
public class PendingState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.PENDING;
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
        booking.setStatus(BookingStatus.RESCHEDULED);
    }
}
