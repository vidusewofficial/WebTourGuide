package com.webtourguide.patterns.model;

/** A tour guide profile (mirrors the TourGuide entity). */
public class TourGuide {

    private final String fullName;
    private final String languages;      // comma-separated, e.g. "English, Tamil"
    private final int yearsExperience;
    private final double rating;         // 0.0 - 5.0

    public TourGuide(String fullName, String languages, int yearsExperience, double rating) {
        this.fullName = fullName;
        this.languages = languages;
        this.yearsExperience = yearsExperience;
        this.rating = rating;
    }

    public String getFullName() { return fullName; }
    public String getLanguages() { return languages; }
    public Integer getYearsExperience() { return yearsExperience; }
    public Double getRating() { return rating; }

    @Override
    public String toString() {
        return String.format("%-16s rating %.1f  %2d yrs  [%s]", fullName, rating, yearsExperience, languages);
    }
}
