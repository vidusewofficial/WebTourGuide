package com.webtourguide.patterns.booking;

import java.time.LocalDate;

/**
 * CONTEXT CLASS (State Pattern).
 *
 * A booking delegates every lifecycle action to the state object for its
 * current status. The state decides whether the action is allowed and what
 * the next status is, so Booking itself contains no status if/else logic.
 */
public class Booking {

    private final Long id;
    private final String packageTitle;
    private LocalDate bookingDate;
    private BookingStatus status = BookingStatus.PENDING;

    public Booking(Long id, String packageTitle, LocalDate bookingDate) {
        this.id = id;
        this.packageTitle = packageTitle;
        this.bookingDate = bookingDate;
    }

    /** The state object for the current status; it decides what is allowed. */
    public BookingState currentState() {
        return BookingStateFactory.of(status);
    }

    public void confirm() { currentState().confirm(this); }

    public void complete() { currentState().complete(this); }

    public void cancel() { currentState().cancel(this); }

    public void reschedule(LocalDate newDate) {
        currentState().reschedule(this, newDate);
    }

    public Long getId() { return id; }
    public String getPackageTitle() { return packageTitle; }
    public LocalDate getBookingDate() { return bookingDate; }
    public BookingStatus getStatus() { return status; }

    // Package-private: only state classes change the status/date.
    void setStatus(BookingStatus status) { this.status = status; }
    void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    @Override
    public String toString() {
        return "Booking #" + id + " [" + packageTitle + ", " + bookingDate + "] status=" + status;
    }
}
