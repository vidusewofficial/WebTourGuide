package com.webtourguide.tourpackage.dto;

import com.webtourguide.destination.dto.DestinationResponse;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class TourPackageResponse {
    private Long id;
    private DestinationResponse destination;
    private String title;
    private String description;
    private Integer durationDays;
    private BigDecimal price;
    private Integer maxParticipants;
    private Boolean active;
    private String imageUrl;
    private List<String> galleryUrls;
}
