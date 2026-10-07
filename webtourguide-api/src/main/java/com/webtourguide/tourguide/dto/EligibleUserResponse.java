package com.webtourguide.tourguide.dto;

import lombok.*;

/**
 * Lightweight projection of a {@code TOUR_GUIDE}-role user who does not yet
 * have a guide profile. Used to populate the "link user" picker on the
 * ADMIN/STAFF guide-creation form.
 */
@Data
@Builder
public class EligibleUserResponse {

    /** ID of the {@code users} row (to send as {@code userId} on create). */
    private Long id;

    private String fullName;

    private String email;
}
