package com.webtourguide.support.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder
public class SupportTicketResponse {
    private Long id;
    private Long raisedById;
    private String raisedByName;
    private Long handledById;
    private String handledByName;
    private Long bookingId;
    private String bookingSummary;
    private String type;
    private String subject;
    private String message;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
