package com.webtourguide.tourpackage.sorting;

import com.webtourguide.tourpackage.TourPackage;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Comparator;

/** Concrete strategy: most recently added package first. */
@Component
public class NewestFirstSort implements PackageSortStrategy {

    @Override
    public String getType() {
        return "newest";
    }

    @Override
    public Comparator<TourPackage> comparator() {
        return Comparator.comparing(TourPackage::getCreatedAt, Comparator.nullsLast(Comparator.<LocalDateTime>reverseOrder()));
    }
}
