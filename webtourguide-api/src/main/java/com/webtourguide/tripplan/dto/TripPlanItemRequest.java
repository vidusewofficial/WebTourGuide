package com.webtourguide.tripplan.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Represents a single day entry submitted by the tourist when saving their itinerary.
 * destinationId is optional so that rest days (no destination) are supported.
 */
@Data
public class TripPlanItemRequest {

    /** ID of the destination for this day. Null means no specific destination (rest day). */
    private Long destinationId;

    /** Which day number this entry is for. Must be 1 or higher. Required. */
    @NotNull(message = "Day number is required")
    @Min(value = 1, message = "Day number must be at least 1")
    private Integer dayNumber;

    /** Name or description of the accommodation on this day. */
    private String accommodation;

    /** How the tourist gets to or around the destination on this day. */
    private String transportation;

    /** Any extra notes the tourist wants to record for this day. */
    private String notes;
}
