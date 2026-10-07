package com.webtourguide.patterns.model;

/** One day of a trip plan (mirrors the TripPlanItem entity). */
public class TripPlanItem {

    private final int dayNumber;
    private final Destination destination;   // null means a rest day
    private final String accommodation;
    private final String activities;

    public TripPlanItem(int dayNumber, Destination destination, String accommodation, String activities) {
        this.dayNumber = dayNumber;
        this.destination = destination;
        this.accommodation = accommodation;
        this.activities = activities;
    }

    public int getDayNumber() { return dayNumber; }
    public Destination getDestination() { return destination; }
    public String getAccommodation() { return accommodation; }
    public String getActivities() { return activities; }
}
