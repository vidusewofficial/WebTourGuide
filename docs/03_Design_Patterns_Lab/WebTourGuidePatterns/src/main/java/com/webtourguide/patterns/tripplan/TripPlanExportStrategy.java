package com.webtourguide.patterns.tripplan;

import com.webtourguide.patterns.model.TripPlan;

/**
 * STRATEGY INTERFACE (Strategy Pattern) - Trip Planning Management module.
 *
 * Each implementation writes the same itinerary in a different file format
 * (plain text, CSV, iCalendar). The tourist picks the format at runtime with
 * GET /api/trip-plans/{id}/export?format=...
 */
public interface TripPlanExportStrategy {

    /** Key used to choose this strategy, e.g. "csv". */
    String getFormat();

    /** File extension without the dot, e.g. "csv". */
    String getFileExtension();

    /** Renders the plan as file content. */
    String export(TripPlan plan);
}
