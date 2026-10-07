package com.webtourguide.patterns.model;

import java.time.LocalDate;
import java.util.List;

/** A tourist's multi-day itinerary (mirrors the TripPlan entity). */
public class TripPlan {

    private final Long id;
    private final String title;
    private final LocalDate startDate;
    private final List<TripPlanItem> items;

    public TripPlan(Long id, String title, LocalDate startDate, List<TripPlanItem> items) {
        this.id = id;
        this.title = title;
        this.startDate = startDate;
        this.items = items;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return startDate.plusDays(items.size() - 1L); }
    public List<TripPlanItem> getItems() { return items; }
}
