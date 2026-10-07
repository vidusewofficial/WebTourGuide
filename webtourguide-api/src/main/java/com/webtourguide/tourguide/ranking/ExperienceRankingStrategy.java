package com.webtourguide.tourguide.ranking;

import com.webtourguide.tourguide.TourGuide;
import org.springframework.stereotype.Component;

import java.util.Comparator;

/** Concrete strategy: most years of experience first, ties broken by rating. */
@Component
public class ExperienceRankingStrategy implements GuideRankingStrategy {

    @Override
    public String getType() {
        return "experience";
    }

    @Override
    public Comparator<TourGuide> comparator() {
        return Comparator.comparing(TourGuide::getYearsExperience, Comparator.nullsLast(Comparator.<Integer>reverseOrder()))
                .thenComparing(TourGuide::getRating, Comparator.nullsLast(Comparator.<Double>reverseOrder()));
    }
}
