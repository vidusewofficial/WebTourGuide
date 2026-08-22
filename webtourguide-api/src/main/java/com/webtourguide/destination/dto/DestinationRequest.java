package com.webtourguide.destination.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DestinationRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String category;

    @NotBlank
    private String location;

    private String description;

    private String imageUrl;

    private Double latitude;

    private Double longitude;

    private java.util.List<String> galleryUrls;
}