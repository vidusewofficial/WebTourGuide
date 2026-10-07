package com.webtourguide.tourguide.ranking;

import com.webtourguide.tourguide.TourGuide;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Comparator;

/** Concrete strategy: guides who speak the most languages first. */
@Component
public class LanguageCountRankingStrategy implements GuideRankingStrategy {

    @Override
    public String getType() {
        return "languages";
    }

    @Override
    public Comparator<TourGuide> comparator() {
        return Comparator.comparingLong(LanguageCountRankingStrategy::languageCount).reversed();
    }

    /** Counts the entries in the comma-separated languages column. */
    static long languageCount(TourGuide guide) {
        if (guide.getLanguages() == null) return 0;
        return Arrays.stream(guide.getLanguages().split(","))
                .filter(lang -> !lang.isBlank())
                .count();
    }
}
