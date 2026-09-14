package com.webtourguide.tripplan.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response object sent back to the frontend after any trip plan operation.
 * Contains the full plan with all its day items embedded.
 */
@Data @Builder
public class TripPlanResponse {

    /** Database ID of the trip plan. */
    private Long id;

    /** ID of the tourist who owns this plan. */
    private Long touristId;

    /** Name of the trip. */
    private String title;

    /** Date the trip starts. */
    private LocalDate startDate;

    /** Date the trip ends. */
    private LocalDate endDate;

    /** Timestamp when this plan was first created. */
    private LocalDateTime createdAt;

    /** All day-by-day items in this plan, in the order they were saved. */
    private List<TripPlanItemResponse> items;
}
