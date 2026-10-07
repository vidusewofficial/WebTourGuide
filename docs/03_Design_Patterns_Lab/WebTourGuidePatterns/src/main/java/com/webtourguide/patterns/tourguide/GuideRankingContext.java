package com.webtourguide.patterns.tourguide;

import com.webtourguide.patterns.model.TourGuide;

import java.util.List;

/**
 * CONTEXT CLASS (Strategy Pattern): ranks guides with whichever
 * strategy it currently holds.
 */
public class GuideRankingContext {

    private GuideRankingStrategy strategy;

    public GuideRankingContext(GuideRankingStrategy strategy) {
        this.strategy = strategy;
    }

    /** Switches the ranking rule at runtime. */
    public void setStrategy(GuideRankingStrategy strategy) {
        this.strategy = strategy;
    }

    /** Returns a new ranked list; the input list is not modified. */
    public List<TourGuide> rank(List<TourGuide> guides) {
        return guides.stream().sorted(strategy.comparator()).toList();
    }
}
