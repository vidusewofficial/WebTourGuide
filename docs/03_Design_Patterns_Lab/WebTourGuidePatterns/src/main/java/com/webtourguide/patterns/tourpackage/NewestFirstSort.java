package com.webtourguide.patterns.tourpackage;

import com.webtourguide.patterns.model.TourPackage;

import java.util.Comparator;

/** CONCRETE STRATEGY: most recently added package first. */
public class NewestFirstSort implements PackageSortStrategy {

    @Override
    public String getType() {
        return "newest";
    }

    @Override
    public Comparator<TourPackage> comparator() {
        return Comparator.comparing(TourPackage::getCreatedAt).reversed();
    }
}
