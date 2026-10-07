package com.webtourguide.tourpackage.sorting;

import com.webtourguide.tourpackage.TourPackage;

import java.util.List;

/**
 * Context class (Strategy Pattern): sorts packages with whichever strategy
 * it currently holds. Created per request, never shared.
 */
public class PackageSortContext {

    private PackageSortStrategy strategy;

    public PackageSortContext(PackageSortStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(PackageSortStrategy strategy) {
        this.strategy = strategy;
    }

    /** Returns a new, sorted list; the input list is not modified. */
    public List<TourPackage> sort(List<TourPackage> packages) {
        return packages.stream().sorted(strategy.comparator()).toList();
    }
}
