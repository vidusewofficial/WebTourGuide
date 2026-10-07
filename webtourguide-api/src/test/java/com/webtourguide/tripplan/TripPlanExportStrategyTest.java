package com.webtourguide.tripplan;

import com.webtourguide.destination.Destination;
import com.webtourguide.tripplan.export.*;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TripPlanExportStrategyTest {

    private TripPlan plan(LocalDate start) {
        Destination galle = Destination.builder().id(1L).name("Galle Fort").build();
        TripPlan plan = TripPlan.builder().id(7L).title("South Coast").startDate(start)
                .endDate(start == null ? null : start.plusDays(1)).items(new ArrayList<>()).build();
        plan.getItems().addAll(List.of(
                TripPlanItem.builder().tripPlan(plan).dayNumber(1).destination(galle)
                        .accommodation("Fort Bungalow").activities("Walk the ramparts, sunset").build(),
                TripPlanItem.builder().tripPlan(plan).dayNumber(2).notes("Beach, \"lazy\" day").build()));
        return plan;
    }

    @Test
    void sameExporterProducesEachFormatWhenStrategyIsSwitchedAtRuntime() {
        TripPlan plan = plan(LocalDate.of(2026, 12, 20));
        TripPlanExporter exporter = new TripPlanExporter(new PlainTextExportStrategy());
        assertThat(exporter.export(plan))
                .startsWith("South Coast\n2026-12-20 to 2026-12-21")
                .contains("Day 1: Galle Fort", "Day 2: Rest day");

        exporter.setStrategy(new CsvExportStrategy());
        assertThat(exporter.export(plan))
                .startsWith("Day,Destination,Accommodation,Transportation,Activities,Notes\n")
                .contains("1,\"Galle Fort\",\"Fort Bungalow\",,\"Walk the ramparts, sunset\",")
                .contains("\"Beach, \"\"lazy\"\" day\"");

        exporter.setStrategy(new CalendarExportStrategy());
        assertThat(exporter.export(plan))
                .startsWith("BEGIN:VCALENDAR")
                .contains("DTSTART;VALUE=DATE:20261220", "DTSTART;VALUE=DATE:20261221")
                .contains("SUMMARY:South Coast - Day 1: Galle Fort")
                .endsWith("END:VCALENDAR\r\n");
    }

    @Test
    void calendarExportNeedsAStartDate() {
        assertThatThrownBy(() -> new CalendarExportStrategy().export(plan(null)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("start date");
    }
}
