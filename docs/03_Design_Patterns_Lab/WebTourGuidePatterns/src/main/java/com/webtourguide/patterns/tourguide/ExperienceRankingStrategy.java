package com.webtourguide.patterns.tourguide;

import com.webtourguide.patterns.model.TourGuide;

import java.util.Comparator;

/** CONCRETE STRATEGY: most years of experience first, ties broken by rating. */
public class ExperienceRankingStrategy implements GuideRankingStrategy {

    @Override
    public String getType() {
        return "experience";
    }

    @Override
    public Comparator<TourGuide> comparator() {
        return Comparator.comparing(TourGuide::getYearsExperience).reversed()
                .thenComparing(Comparator.comparing(TourGuide::getRating).reversed());
    }
}
