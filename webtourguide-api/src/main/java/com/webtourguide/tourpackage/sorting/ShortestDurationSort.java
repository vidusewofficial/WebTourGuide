package com.webtourguide.tourpackage.sorting;

import com.webtourguide.tourpackage.TourPackage;
import org.springframework.stereotype.Component;

import java.util.Comparator;

/** Concrete strategy: shortest trip (fewest days) first. */
@Component
public class ShortestDurationSort implements PackageSortStrategy {

    @Override
    public String getType() {
        return "duration";
    }

    @Override
    public Comparator<TourPackage> comparator() {
        return Comparator.comparing(TourPackage::getDurationDays, Comparator.nullsLast(Comparator.<Integer>naturalOrder()));
    }
}
