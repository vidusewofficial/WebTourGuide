package com.webtourguide.patterns.tripplan;

import com.webtourguide.patterns.model.TripPlan;
import com.webtourguide.patterns.model.TripPlanItem;

/** CONCRETE STRATEGY: a readable, printable itinerary. */
public class PlainTextExportStrategy implements TripPlanExportStrategy {

    @Override
    public String getFormat() {
        return "text";
    }

    @Override
    public String getFileExtension() {
        return "txt";
    }

    @Override
    public String export(TripPlan plan) {
        StringBuilder out = new StringBuilder();
        out.append(plan.getTitle()).append('\n');
        out.append(plan.getStartDate()).append(" to ").append(plan.getEndDate()).append('\n');
        for (TripPlanItem item : plan.getItems()) {
            out.append("Day ").append(item.getDayNumber()).append(": ")
                    .append(item.getDestination() != null ? item.getDestination().getName() : "Rest day");
            if (item.getAccommodation() != null) {
                out.append(" | Stay: ").append(item.getAccommodation());
            }
            out.append('\n');
        }
        return out.toString();
    }
}
