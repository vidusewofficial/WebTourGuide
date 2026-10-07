package com.webtourguide.support.observer;

import com.webtourguide.support.SupportTicket;
import com.webtourguide.support.TicketStatus;
import org.springframework.security.core.Authentication;

/**
 * Observer interface (Observer Pattern).
 *
 * SupportTicketService (the subject) notifies every registered observer
 * after a ticket's status changes. Each observer reacts in its own way,
 * so new side effects (emails, audit logs, booking updates) can be added
 * without editing the service.
 */
public interface TicketStatusObserver {

    void onStatusChanged(SupportTicket ticket, TicketStatus previousStatus, Authentication changedBy);
}
