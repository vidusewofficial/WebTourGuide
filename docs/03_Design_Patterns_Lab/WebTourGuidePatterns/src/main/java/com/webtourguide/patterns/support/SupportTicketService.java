package com.webtourguide.patterns.support;

import java.util.ArrayList;
import java.util.List;

/**
 * SUBJECT (Observer Pattern).
 *
 * Keeps a list of observers and notifies all of them after a ticket's status
 * changes. The service does not know what each observer does - it only calls
 * the shared onStatusChanged() method.
 */
public class SupportTicketService {

    private final List<TicketStatusObserver> observers = new ArrayList<>();

    public void addObserver(TicketStatusObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(TicketStatusObserver observer) {
        observers.remove(observer);
    }

    /** Staff/admin changes a ticket's status; every observer is notified. */
    public void updateStatus(SupportTicket ticket, TicketStatus newStatus,
                             String changedBy) {
        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(newStatus);
        notifyObservers(ticket, previousStatus, changedBy);
    }

    private void notifyObservers(SupportTicket ticket, TicketStatus previousStatus,
                                 String changedBy) {
        for (TicketStatusObserver observer : observers) {
            observer.onStatusChanged(ticket, previousStatus, changedBy);
        }
    }
}
