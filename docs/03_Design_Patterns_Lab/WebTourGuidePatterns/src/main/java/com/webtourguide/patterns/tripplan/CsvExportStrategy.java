package com.webtourguide.patterns.tripplan;

import com.webtourguide.patterns.model.Destination;
import com.webtourguide.patterns.model.TripPlan;
import com.webtourguide.patterns.model.TripPlanItem;

/** CONCRETE STRATEGY: one row per day, for opening in Excel or Google Sheets. */
public class CsvExportStrategy implements TripPlanExportStrategy {

    @Override
    public String getFormat() {
        return "csv";
    }

    @Override
    public String getFileExtension() {
        return "csv";
    }

    @Override
    public String export(TripPlan plan) {
        StringBuilder out = new StringBuilder();
        out.append("Day,Destination,Accommodation,Activities\n");
        for (TripPlanItem item : plan.getItems()) {
            Destination place = item.getDestination();
            out.append(item.getDayNumber()).append(',')
                    .append(cell(place != null ? place.getName() : null)).append(',')
                    .append(cell(item.getAccommodation())).append(',')
                    .append(cell(item.getActivities())).append('\n');
        }
        return out.toString();
    }

    /** Quotes a value and doubles inner quotes, so commas and quotes survive. */
    private String cell(String value) {
        if (value == null) return "";
        return '"' + value.replace("\"", "\"\"") + '"';
    }
}
