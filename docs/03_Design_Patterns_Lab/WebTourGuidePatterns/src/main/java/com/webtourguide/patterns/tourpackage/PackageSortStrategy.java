package com.webtourguide.patterns.tourpackage;

import com.webtourguide.patterns.model.TourPackage;

import java.util.Comparator;

/**
 * STRATEGY INTERFACE (Strategy Pattern) - Tour Package Management module.
 *
 * Each implementation defines one ordering of tour packages. Tourists pick the
 * order at runtime (GET /api/packages?sort=...); a new ordering is a new class.
 */
public interface PackageSortStrategy {

    /** Key used to choose this strategy, e.g. "price-asc". */
    String getType();

    Comparator<TourPackage> comparator();
}
