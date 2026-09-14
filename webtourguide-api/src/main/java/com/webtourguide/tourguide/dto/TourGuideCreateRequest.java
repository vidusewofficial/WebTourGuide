package com.webtourguide.tourguide.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request body used by ADMIN / STAFF to create a new tour-guide profile.
 * The target user must already exist and carry the role {@code TOUR_GUIDE}.
 */
@Data
public class TourGuideCreateRequest {

    /** ID of the {@code users} row to link. Must not be null. */
    @NotNull(message = "userId is required")
    private Long userId;

    /** Comma-separated languages, max 300 characters. */
    @Size(max = 300, message = "languages must not exceed 300 characters")
    private String languages;

    /** Comma-separated skills, max 300 characters. */
    @Size(max = 300, message = "skills must not exceed 300 characters")
    private String skills;

    /** Comma-separated certifications, max 300 characters. */
    @Size(max = 300, message = "certifications must not exceed 300 characters")
    private String certifications;

    /** Must be 0 or greater. */
    @Min(value = 0, message = "yearsExperience must be 0 or greater")
    private Integer yearsExperience;
}