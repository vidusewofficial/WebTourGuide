package com.webtourguide.support;

import com.webtourguide.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SupportTicket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "raised_by", nullable = false)
    private User raisedBy;

    @ManyToOne @JoinColumn(name = "handled_by")
    private User handledBy;

    @Enumerated(EnumType.STRING)
    private TicketType type;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = TicketStatus.OPEN;
    }
}
