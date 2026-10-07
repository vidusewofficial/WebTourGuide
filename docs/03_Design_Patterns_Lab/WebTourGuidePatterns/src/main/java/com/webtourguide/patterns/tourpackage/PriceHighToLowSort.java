package com.webtourguide.patterns.tourpackage;

import com.webtourguide.patterns.model.TourPackage;

import java.util.Comparator;

/** CONCRETE STRATEGY: most expensive package first. */
public class PriceHighToLowSort implements PackageSortStrategy {

    @Override
    public String getType() {
        return "price-desc";
    }

    @Override
    public Comparator<TourPackage> comparator() {
        return Comparator.comparing(TourPackage::getPrice).reversed();
    }
}
