package com.webtourguide.tourpackage.sorting;

import com.webtourguide.tourpackage.TourPackage;

import java.util.Comparator;

/**
 * Strategy interface (Strategy Pattern) for ordering tour packages.
 *
 * Tourists choose the order at runtime with {@code GET /api/packages?sort=...};
 * a new ordering is a new class, with no change to the service.
 */
public interface PackageSortStrategy {

    /** Key used to select this strategy, e.g. "price-asc". */
    String getType();

    Comparator<TourPackage> comparator();
}
