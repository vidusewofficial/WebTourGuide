package com.webtourguide.guideapplication.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

/** Request body a TOURIST submits to apply to become a guide. */
@Data
public class GuideApplicationRequest {

    @Size(max = 300, message = "languages must not exceed 300 characters")
    private String languages;

    @Size(max = 300, message = "skills must not exceed 300 characters")
    private String skills;

    @Size(max = 300, message = "certifications must not exceed 300 characters")
    private String certifications;

    @Size(max = 150, message = "location must not exceed 150 characters")
    private String location;

    @Min(value = 0, message = "yearsExperience must be 0 or greater")
    private Integer yearsExperience;

    @Size(max = 1000, message = "message must not exceed 1000 characters")
    private String message;
}
