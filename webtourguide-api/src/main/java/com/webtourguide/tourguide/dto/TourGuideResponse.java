package com.webtourguide.tourguide.dto;

import lombok.*;

@Data
@Builder
public class TourGuideResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String languages;
    private String skills;
    private String certifications;
    private Integer yearsExperience;
    private Boolean isAvailable;
    private Double rating;
}