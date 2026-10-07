package com.webtourguide.tourguide.ranking;

import com.webtourguide.tourguide.TourGuide;
import org.springframework.stereotype.Component;

import java.util.Comparator;

/** Concrete strategy: highest rating first, ties broken by experience. */
@Component
public class RatingRankingStrategy implements GuideRankingStrategy {

    @Override
    public String getType() {
        return "rating";
    }

    @Override
    public Comparator<TourGuide> comparator() {
        return Comparator.comparing(TourGuide::getRating, Comparator.nullsLast(Comparator.<Double>reverseOrder()))
                .thenComparing(TourGuide::getYearsExperience, Comparator.nullsLast(Comparator.<Integer>reverseOrder()));
    }
}
