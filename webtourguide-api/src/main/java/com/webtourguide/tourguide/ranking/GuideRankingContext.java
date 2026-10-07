package com.webtourguide.tourguide.ranking;

import com.webtourguide.tourguide.TourGuide;

import java.util.List;

/**
 * Context class (Strategy Pattern): ranks a list of guides with whichever
 * strategy it currently holds. Created per request, so it is never shared
 * between concurrent requests.
 */
public class GuideRankingContext {

    private GuideRankingStrategy strategy;

    public GuideRankingContext(GuideRankingStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(GuideRankingStrategy strategy) {
        this.strategy = strategy;
    }

    /** Returns a new, sorted list; the input list is not modified. */
    public List<TourGuide> rank(List<TourGuide> guides) {
        return guides.stream().sorted(strategy.comparator()).toList();
    }
}
