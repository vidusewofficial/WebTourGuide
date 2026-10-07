package com.webtourguide.guideapplication.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
public class GuideApplicationResponse {

    private Long id;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;

    private String languages;
    private String skills;
    private String certifications;
    private String location;
    private Integer yearsExperience;
    private String message;

    /** One of PENDING, APPROVED, REJECTED. */
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private String reviewNote;
}
