package com.webtourguide.support;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByRaisedById(Long touristId);
    List<SupportTicket> findByStatus(TicketStatus status);
}
