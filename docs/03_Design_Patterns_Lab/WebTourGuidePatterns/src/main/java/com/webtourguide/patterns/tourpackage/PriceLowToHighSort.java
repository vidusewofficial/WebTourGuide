package com.webtourguide.patterns.tourpackage;

import com.webtourguide.patterns.model.TourPackage;

import java.util.Comparator;

/** CONCRETE STRATEGY: cheapest package first. */
public class PriceLowToHighSort implements PackageSortStrategy {

    @Override
    public String getType() {
        return "price-asc";
    }

    @Override
    public Comparator<TourPackage> comparator() {
        return Comparator.comparing(TourPackage::getPrice);
    }
}
