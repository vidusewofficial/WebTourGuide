package com.webtourguide.user.dto;

import lombok.*;

/**
 * Read-only projection of a {@link com.webtourguide.user.User} account.
 * Returned by the ADMIN user-management endpoints; never exposes the password hash.
 */
@Data
@Builder
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    /** One of TOURIST, TOUR_GUIDE, STAFF, ADMIN. */
    private String role;

    private String phone;
}
