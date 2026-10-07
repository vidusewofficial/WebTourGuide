package com.webtourguide.tourguide.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Request body used by ADMIN / STAFF to create a brand-new guide account:
 * a {@code users} row (role {@code TOUR_GUIDE}) plus its linked guide
 * profile, in one step. The guide can log in immediately afterwards with
 * the email/password given here.
 */
@Data
public class TourGuideRegisterRequest {

    @NotBlank(message = "fullName is required")
    private String fullName;

    @Email(message = "email must be valid")
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;

    private String phone;

    /** Comma-separated languages, max 300 characters. */
    @Size(max = 300, message = "languages must not exceed 300 characters")
    private String languages;

    /** Comma-separated skills, max 300 characters. */
    @Size(max = 300, message = "skills must not exceed 300 characters")
    private String skills;

    /** Primary operating area/destination, max 150 characters. */
    @Size(max = 150, message = "location must not exceed 150 characters")
    private String location;

    /** Comma-separated certifications, max 300 characters. */
    @Size(max = 300, message = "certifications must not exceed 300 characters")
    private String certifications;

    /** Must be 0 or greater. */
    @Min(value = 0, message = "yearsExperience must be 0 or greater")
    private Integer yearsExperience;
}
