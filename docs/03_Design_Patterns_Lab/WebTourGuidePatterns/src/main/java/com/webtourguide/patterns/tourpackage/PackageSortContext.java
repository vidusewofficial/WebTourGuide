package com.webtourguide.patterns.tourpackage;

import com.webtourguide.patterns.model.TourPackage;

import java.util.List;

/**
 * CONTEXT CLASS (Strategy Pattern): sorts packages with whichever
 * strategy it currently holds.
 */
public class PackageSortContext {

    private PackageSortStrategy strategy;

    public PackageSortContext(PackageSortStrategy strategy) {
        this.strategy = strategy;
    }

    /** Switches the sort order at runtime. */
    public void setStrategy(PackageSortStrategy strategy) {
        this.strategy = strategy;
    }

    /** Returns a new sorted list; the input list is not modified. */
    public List<TourPackage> sort(List<TourPackage> packages) {
        return packages.stream().sorted(strategy.comparator()).toList();
    }
}
