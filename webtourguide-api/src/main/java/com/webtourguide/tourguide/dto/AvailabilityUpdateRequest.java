package com.webtourguide.tourguide.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Minimal request body for toggling a guide's availability status.
 * Sent to {@code PATCH /api/guides/{id}/availability}.
 */
@Data
public class AvailabilityUpdateRequest {

    /**
     * The desired availability flag.
     * {@code true}  = guide is open for bookings.
     * {@code false} = guide is currently unavailable.
     */
    @NotNull(message = "isAvailable must be provided (true or false)")
    private Boolean isAvailable;
}