package com.webtourguide.tourguide.ranking;

import com.webtourguide.tourguide.TourGuide;

import java.util.Comparator;

/**
 * Strategy interface (Strategy Pattern) for ranking tour guides.
 *
 * Each implementation defines one ordering (best rated, most experienced,
 * most languages). Tourists choose the ranking at runtime with
 * {@code GET /api/guides/ranked?by=...}.
 */
public interface GuideRankingStrategy {

    /** Key used to select this strategy, e.g. "rating". */
    String getType();

    /** Orders guides best-first. */
    Comparator<TourGuide> comparator();
}
