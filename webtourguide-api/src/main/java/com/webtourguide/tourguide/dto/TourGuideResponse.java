package com.webtourguide.tourguide.dto;

import lombok.*;

/**
 * Read-only projection of a {@link com.webtourguide.tourguide.TourGuide} profile.
 * Returned by every guide endpoint so the internal entity is never exposed
 * directly over the wire.
 */
@Data
@Builder
public class TourGuideResponse {

    /** Guide profile ID (tour_guides.id). */
    private Long id;

    /** ID of the linked user account (users.id). */
    private Long userId;

    /** Full name copied from the linked user. */
    private String fullName;

    /** Email address copied from the linked user. */
    private String email;

    /** Comma-separated languages spoken by this guide. */
    private String languages;

    /** Comma-separated skills and specialisations. */
    private String skills;

    /** Comma-separated professional certifications. */
    private String certifications;

    /** Total years of guiding experience. */
    private Integer yearsExperience;

    /** {@code true} if the guide is currently available for bookings. */
    private Boolean isAvailable;

    /** Average guest rating (0.0–5.0). */
    private Double rating;
}