package com.webtourguide.booking;

import com.webtourguide.booking.state.*;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BookingStateTest {

    private Booking bookingIn(BookingStatus status) {
        return Booking.builder().id(1L).status(status).bookingDate(LocalDate.of(2026, 12, 1)).build();
    }

    @Test
    void stateObjectMatchesStoredStatus() {
        assertThat(bookingIn(BookingStatus.PENDING).currentState()).isInstanceOf(PendingState.class);
        assertThat(bookingIn(BookingStatus.CONFIRMED).currentState()).isInstanceOf(ConfirmedState.class);
        assertThat(bookingIn(BookingStatus.RESCHEDULED).currentState()).isInstanceOf(RescheduledState.class);
        assertThat(bookingIn(BookingStatus.COMPLETED).currentState()).isInstanceOf(CompletedState.class);
        assertThat(bookingIn(BookingStatus.CANCELLED).currentState()).isInstanceOf(CancelledState.class);
    }

    @Test
    void fullLifecycle_pendingToConfirmedToCompleted() {
        Booking booking = bookingIn(BookingStatus.PENDING);

        booking.confirm();
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CONFIRMED);

        booking.complete();
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.COMPLETED);
    }

    @Test
    void reschedulingAConfirmedBookingNeedsReconfirmation() {
        Booking booking = bookingIn(BookingStatus.CONFIRMED);
        LocalDate newDate = LocalDate.of(2026, 12, 15);

        booking.reschedule(newDate);

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.RESCHEDULED);
        assertThat(booking.getBookingDate()).isEqualTo(newDate);

        booking.confirm();
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
    }

    @Test
    void pendingBookingCannotBeCompleted() {
        Booking booking = bookingIn(BookingStatus.PENDING);

        assertThatThrownBy(booking::complete)
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Cannot complete a pending booking");
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.PENDING);
    }

    @Test
    void cancelledBookingRejectsEveryAction() {
        Booking booking = bookingIn(BookingStatus.CANCELLED);

        assertThatThrownBy(booking::confirm).isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(booking::complete).isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(booking::cancel).isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> booking.reschedule(LocalDate.of(2026, 12, 20)))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void completedBookingCannotBeCancelled() {
        Booking booking = bookingIn(BookingStatus.COMPLETED);

        assertThatThrownBy(booking::cancel)
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Cannot cancel a completed booking");
    }
}
