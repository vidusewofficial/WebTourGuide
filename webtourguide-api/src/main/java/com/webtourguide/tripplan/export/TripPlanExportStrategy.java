package com.webtourguide.tripplan.export;

import com.webtourguide.tripplan.TripPlan;

/**
 * Strategy interface (Strategy Pattern) for exporting a trip plan.
 *
 * Each implementation writes the same itinerary in a different file format
 * (plain text, CSV, iCalendar). The tourist picks the format at runtime with
 * {@code GET /api/trip-plans/{id}/export?format=...}.
 */
public interface TripPlanExportStrategy {

    /** Key used to select this strategy, e.g. "csv". */
    String getFormat();

    /** MIME type of the generated file, e.g. "text/csv". */
    String getContentType();

    /** File extension without the dot, e.g. "csv". */
    String getFileExtension();

    /** Renders the plan (its items already in day order) as file content. */
    String export(TripPlan plan);
}
