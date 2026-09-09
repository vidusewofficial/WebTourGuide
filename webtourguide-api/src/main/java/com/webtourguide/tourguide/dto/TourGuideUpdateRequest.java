package com.webtourguide.tourguide.dto;

import lombok.Data;

@Data
public class TourGuideUpdateRequest {
    private String languages;
    private String skills;
    private String certifications;
    private Integer yearsExperience;
}