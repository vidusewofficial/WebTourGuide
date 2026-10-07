package com.webtourguide.patterns.tourpackage;

import com.webtourguide.patterns.model.TourPackage;

import java.util.Comparator;

/** CONCRETE STRATEGY: shortest trip (fewest days) first. */
public class ShortestDurationSort implements PackageSortStrategy {

    @Override
    public String getType() {
        return "duration";
    }

    @Override
    public Comparator<TourPackage> comparator() {
        return Comparator.comparing(TourPackage::getDurationDays);
    }
}
