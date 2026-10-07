package com.webtourguide.patterns.tourguide;

import com.webtourguide.patterns.model.TourGuide;

import java.util.Comparator;

/** CONCRETE STRATEGY: highest rating first, ties broken by experience. */
public class RatingRankingStrategy implements GuideRankingStrategy {

    @Override
    public String getType() {
        return "rating";
    }

    @Override
    public Comparator<TourGuide> comparator() {
        return Comparator.comparing(TourGuide::getRating).reversed()
                .thenComparing(
                        Comparator.comparing(TourGuide::getYearsExperience).reversed());
    }
}
