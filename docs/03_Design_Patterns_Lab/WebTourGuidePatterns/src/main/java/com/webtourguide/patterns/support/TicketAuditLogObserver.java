package com.webtourguide.patterns.support;

/** CONCRETE OBSERVER: writes an audit line for every ticket status change. */
public class TicketAuditLogObserver implements TicketStatusObserver {

    @Override
    public void onStatusChanged(SupportTicket ticket, TicketStatus previousStatus,
                                String changedBy) {
        System.out.println("    [AuditLog] Ticket #" + ticket.getId() + " changed "
                + previousStatus + " -> " + ticket.getStatus() + " by '" + changedBy + "'");
    }
}
