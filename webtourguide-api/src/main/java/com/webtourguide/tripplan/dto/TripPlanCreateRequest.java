package com.webtourguide.tripplan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

/**
 * Request body used when a tourist creates a brand-new trip plan.
 * Only the title is required; start and end dates are optional.
 */
@Data
public class TripPlanCreateRequest {

    /** Name of the trip, e.g. "South Coast Getaway". Required. Max 150 characters. */
    @NotBlank(message = "Trip title is required")
    @Size(max = 150, message = "Title must be 150 characters or less")
    private String title;

    /** Optional date the trip starts. */
    private LocalDate startDate;

    /** Optional date the trip ends. Must not be before startDate. */
    private LocalDate endDate;
}
