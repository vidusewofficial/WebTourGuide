package com.webtourguide.tourguide.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request body for partial profile updates.
 * All fields are optional — only non-null values are applied by the service.
 */
@Data
public class TourGuideUpdateRequest {

    /** Comma-separated languages, max 300 characters. */
    @Size(max = 300, message = "languages must not exceed 300 characters")
    private String languages;

    /** Comma-separated skills, max 300 characters. */
    @Size(max = 300, message = "skills must not exceed 300 characters")
    private String skills;

    /** Comma-separated certifications, max 300 characters. */
    @Size(max = 300, message = "certifications must not exceed 300 characters")
    private String certifications;

    /** Must be 0 or greater when provided. */
    @Min(value = 0, message = "yearsExperience must be 0 or greater")
    private Integer yearsExperience;
}