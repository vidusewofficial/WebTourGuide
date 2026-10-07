package com.webtourguide.support.observer;

import com.webtourguide.support.SupportTicket;
import com.webtourguide.support.TicketStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/** Concrete observer: writes an audit line for every ticket status change. */
@Component
public class TicketAuditLogObserver implements TicketStatusObserver {

    private static final Logger log = LoggerFactory.getLogger(TicketAuditLogObserver.class);

    @Override
    public void onStatusChanged(SupportTicket ticket, TicketStatus previousStatus, Authentication changedBy) {
        log.info("Support ticket #{} changed {} -> {} by '{}'",
                ticket.getId(), previousStatus, ticket.getStatus(), changedBy.getName());
    }
}
