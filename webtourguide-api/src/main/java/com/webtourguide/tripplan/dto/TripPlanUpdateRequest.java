package com.webtourguide.tripplan.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * Request body used when a tourist updates an existing trip plan.
 * Replaces title, dates, and the entire list of day items in one call.
 * Any items not included in the new list are permanently deleted (orphan removal).
 */
@Data
public class TripPlanUpdateRequest {

    /** Updated trip title. Max 150 characters. */
    @Size(max = 150, message = "Title must be 150 characters or less")
    private String title;

    /** Updated start date for the trip. */
    private LocalDate startDate;

    /** Updated end date for the trip. */
    private LocalDate endDate;

    /**
     * Full replacement list of day items.
     * Items missing from this list are removed from the database.
     * Items present in this list are added or kept.
     */
    private List<TripPlanItemRequest> items;
}
