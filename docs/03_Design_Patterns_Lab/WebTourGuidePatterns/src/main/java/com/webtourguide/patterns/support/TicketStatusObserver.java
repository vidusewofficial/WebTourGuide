package com.webtourguide.patterns.support;

/**
 * OBSERVER INTERFACE (Observer Pattern) - Customer Support Management module.
 *
 * SupportTicketService (the subject) notifies every registered observer when
 * a ticket's status changes. Each observer reacts in its own way, so new side
 * effects (emails, audit logs, booking updates) can be added without editing
 * the service.
 */
public interface TicketStatusObserver {

    void onStatusChanged(SupportTicket ticket, TicketStatus previousStatus,
                         String changedBy);
}
