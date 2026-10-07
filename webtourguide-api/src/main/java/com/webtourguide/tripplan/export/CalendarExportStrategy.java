package com.webtourguide.tripplan.export;

import com.webtourguide.tripplan.TripPlan;
import com.webtourguide.tripplan.TripPlanItem;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Concrete strategy: an iCalendar (.ics) file with one all-day event per
 * trip day, which imports into Google Calendar, Outlook or Apple Calendar.
 */
@Component
public class CalendarExportStrategy implements TripPlanExportStrategy {

    private static final DateTimeFormatter ICS_DATE = DateTimeFormatter.BASIC_ISO_DATE;

    @Override
    public String getFormat() {
        return "ics";
    }

    @Override
    public String getContentType() {
        return "text/calendar";
    }

    @Override
    public String getFileExtension() {
        return "ics";
    }

    @Override
    public String export(TripPlan plan) {
        if (plan.getStartDate() == null) {
            throw new IllegalStateException("Set a start date on the trip plan before exporting to a calendar");
        }
        StringBuilder out = new StringBuilder();
        out.append("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WebTourGuide//Trip Planner//EN\r\n");
        for (TripPlanItem item : plan.getItems()) {
            LocalDate day = plan.getStartDate().plusDays(item.getDayNumber() - 1L);
            String place = item.getDestination() != null ? item.getDestination().getName() : "Rest day";
            out.append("BEGIN:VEVENT\r\n")
                    .append("UID:trip-").append(plan.getId()).append("-day-").append(item.getDayNumber())
                    .append("@webtourguide\r\n")
                    .append("DTSTART;VALUE=DATE:").append(day.format(ICS_DATE)).append("\r\n")
                    .append("DTEND;VALUE=DATE:").append(day.plusDays(1).format(ICS_DATE)).append("\r\n")
                    .append("SUMMARY:").append(escape(plan.getTitle() + " - Day " + item.getDayNumber() + ": " + place))
                    .append("\r\n");
            if (item.getActivities() != null && !item.getActivities().isBlank()) {
                out.append("DESCRIPTION:").append(escape(item.getActivities())).append("\r\n");
            }
            out.append("END:VEVENT\r\n");
        }
        out.append("END:VCALENDAR\r\n");
        return out.toString();
    }

    /** Escapes the characters iCalendar treats as separators. */
    private String escape(String text) {
        return text.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n");
    }
}
