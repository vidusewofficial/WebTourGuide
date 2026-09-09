package com.webtourguide.tourguide.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AvailabilityUpdateRequest {
    @NotNull
    private Boolean isAvailable;
}