package com.webtourguide.destination.dto;

import lombok.*;

@Data
@Builder
public class DestinationResponse {

    private Long id;

    private String name;

    private String category;

    private String location;

    private String description;

    private String imageUrl;

    private Double latitude;

    private Double longitude;
}