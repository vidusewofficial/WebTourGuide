package com.webtourguide.tourpackage.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TourPackageRequest {
    @NotNull private Long destinationId;
    @NotBlank private String title;
    private String description;
    @NotNull @Min(1) private Integer durationDays;
    @NotNull @DecimalMin("0.0") private BigDecimal price;
    private Integer maxParticipants;
    private Boolean active;
}
