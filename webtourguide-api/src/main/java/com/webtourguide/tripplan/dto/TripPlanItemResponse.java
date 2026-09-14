package com.webtourguide.tripplan.dto;

import lombok.*;

/**
 * Response object representing a single day item inside a trip plan.
 * Includes the destination name (if set) so the frontend does not need a second API call.
 */
@Data @Builder
public class TripPlanItemResponse {

    /** Database ID of this item row. */
    private Long id;

    /** ID of the linked destination, or null if this is a rest day. */
    private Long destinationId;

    /** Human-readable name of the destination, or null for a rest day. */
    private String destinationName;

    /** Which day in the itinerary this entry represents (1-based). */
    private Integer dayNumber;

    /** Accommodation name or description for this day. */
    private String accommodation;

    /** Transport method used to reach the destination on this day. */
    private String transportation;

    /** Planned activities for this day (e.g. "Hiking, wildlife safari"). */
    private String activities;

    /** Any extra notes recorded for this day. */
    private String notes;
}
