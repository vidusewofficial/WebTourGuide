package com.webtourguide.tripplan.export;

import com.webtourguide.tripplan.TripPlan;
import com.webtourguide.tripplan.TripPlanItem;
import org.springframework.stereotype.Component;

/** Concrete strategy: one row per day, for opening in Excel or Google Sheets. */
@Component
public class CsvExportStrategy implements TripPlanExportStrategy {

    @Override
    public String getFormat() {
        return "csv";
    }

    @Override
    public String getContentType() {
        return "text/csv";
    }

    @Override
    public String getFileExtension() {
        return "csv";
    }

    @Override
    public String export(TripPlan plan) {
        StringBuilder out = new StringBuilder("Day,Destination,Accommodation,Transportation,Activities,Notes\n");
        for (TripPlanItem item : plan.getItems()) {
            out.append(item.getDayNumber()).append(',')
                    .append(cell(item.getDestination() != null ? item.getDestination().getName() : null)).append(',')
                    .append(cell(item.getAccommodation())).append(',')
                    .append(cell(item.getTransportation())).append(',')
                    .append(cell(item.getActivities())).append(',')
                    .append(cell(item.getNotes())).append('\n');
        }
        return out.toString();
    }

    /** Quotes a value and doubles inner quotes, so commas and quotes survive. */
    private String cell(String value) {
        if (value == null) return "";
        return '"' + value.replace("\"", "\"\"") + '"';
    }
}
