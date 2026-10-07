package com.webtourguide.patterns.tripplan;

import com.webtourguide.patterns.model.TripPlan;
import com.webtourguide.patterns.model.TripPlanItem;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * CONCRETE STRATEGY: an iCalendar (.ics) file with one all-day event per trip
 * day, which imports into Google Calendar, Outlook or Apple Calendar.
 */
public class CalendarExportStrategy implements TripPlanExportStrategy {

    private static final DateTimeFormatter ICS_DATE = DateTimeFormatter.BASIC_ISO_DATE;

    @Override
    public String getFormat() {
        return "ics";
    }

    @Override
    public String getFileExtension() {
        return "ics";
    }

    @Override
    public String export(TripPlan plan) {
        StringBuilder out = new StringBuilder("BEGIN:VCALENDAR\nVERSION:2.0\n");
        for (TripPlanItem item : plan.getItems()) {
            LocalDate day = plan.getStartDate().plusDays(item.getDayNumber() - 1L);
            String place = item.getDestination() != null ? item.getDestination().getName() : "Rest day";
            out.append("BEGIN:VEVENT\n")
                    .append("DTSTART;VALUE=DATE:").append(day.format(ICS_DATE)).append('\n')
                    .append("SUMMARY:").append(plan.getTitle()).append(" - Day ")
                    .append(item.getDayNumber()).append(": ").append(place).append('\n')
                    .append("END:VEVENT\n");
        }
        return out.append("END:VCALENDAR\n").toString();
    }
}
