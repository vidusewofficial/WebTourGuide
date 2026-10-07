package com.webtourguide.tripplan.export;

import com.webtourguide.tripplan.TripPlan;
import com.webtourguide.tripplan.TripPlanItem;
import org.springframework.stereotype.Component;

/** Concrete strategy: a readable, printable itinerary. */
@Component
public class PlainTextExportStrategy implements TripPlanExportStrategy {

    @Override
    public String getFormat() {
        return "text";
    }

    @Override
    public String getContentType() {
        return "text/plain";
    }

    @Override
    public String getFileExtension() {
        return "txt";
    }

    @Override
    public String export(TripPlan plan) {
        StringBuilder out = new StringBuilder();
        out.append(plan.getTitle()).append('\n');
        if (plan.getStartDate() != null && plan.getEndDate() != null) {
            out.append(plan.getStartDate()).append(" to ").append(plan.getEndDate()).append('\n');
        }
        for (TripPlanItem item : plan.getItems()) {
            out.append('\n').append("Day ").append(item.getDayNumber()).append(": ")
                    .append(item.getDestination() != null ? item.getDestination().getName() : "Rest day")
                    .append('\n');
            appendLine(out, "Stay", item.getAccommodation());
            appendLine(out, "Transport", item.getTransportation());
            appendLine(out, "Activities", item.getActivities());
            appendLine(out, "Notes", item.getNotes());
        }
        return out.toString();
    }

    private void appendLine(StringBuilder out, String label, String value) {
        if (value != null && !value.isBlank()) {
            out.append("  ").append(label).append(": ").append(value).append('\n');
        }
    }
}
