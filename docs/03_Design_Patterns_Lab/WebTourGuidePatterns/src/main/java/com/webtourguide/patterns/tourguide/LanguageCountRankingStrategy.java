package com.webtourguide.patterns.tourguide;

import com.webtourguide.patterns.model.TourGuide;

import java.util.Arrays;
import java.util.Comparator;

/** CONCRETE STRATEGY: guides who speak the most languages first. */
public class LanguageCountRankingStrategy implements GuideRankingStrategy {

    @Override
    public String getType() {
        return "languages";
    }

    @Override
    public Comparator<TourGuide> comparator() {
        return Comparator
                .comparingLong(LanguageCountRankingStrategy::languageCount)
                .reversed();
    }

    /** Counts the entries in the comma-separated languages field. */
    static long languageCount(TourGuide guide) {
        if (guide.getLanguages() == null) return 0;
        return Arrays.stream(guide.getLanguages().split(","))
                .filter(lang -> !lang.isBlank())
                .count();
    }
}
