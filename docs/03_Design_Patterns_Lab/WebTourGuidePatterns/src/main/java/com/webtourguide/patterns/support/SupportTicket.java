package com.webtourguide.patterns.support;

import com.webtourguide.patterns.booking.Booking;

/** A customer support request, optionally about a booking (mirrors the SupportTicket entity). */
public class SupportTicket {

    private final Long id;
    private final TicketType type;
    private final String subject;
    private final Booking booking;     // optional
    private TicketStatus status = TicketStatus.OPEN;

    public SupportTicket(Long id, TicketType type, String subject, Booking booking) {
        this.id = id;
        this.type = type;
        this.subject = subject;
        this.booking = booking;
    }

    public Long getId() { return id; }
    public TicketType getType() { return type; }
    public String getSubject() { return subject; }
    public Booking getBooking() { return booking; }
    public TicketStatus getStatus() { return status; }
    void setStatus(TicketStatus status) { this.status = status; }
}
