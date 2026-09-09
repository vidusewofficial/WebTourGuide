package com.webtourguide.tourguide.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TourGuideCreateRequest {
    @NotNull
    private Long userId;
    private String languages;
    private String skills;
    private String certifications;
    private Integer yearsExperience;
}