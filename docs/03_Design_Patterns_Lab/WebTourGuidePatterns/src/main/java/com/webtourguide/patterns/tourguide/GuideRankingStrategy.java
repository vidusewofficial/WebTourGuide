package com.webtourguide.patterns.tourguide;

import com.webtourguide.patterns.model.TourGuide;

import java.util.Comparator;

/**
 * STRATEGY INTERFACE (Strategy Pattern) - Tour Guide Management module.
 *
 * Each implementation defines one way of ranking guides best-first
 * (rating, experience, languages). Chosen at runtime via
 * GET /api/guides/ranked?by=...
 */
public interface GuideRankingStrategy {

    /** Key used to choose this strategy, e.g. "rating". */
    String getType();

    /** Orders guides best-first. */
    Comparator<TourGuide> comparator();
}
