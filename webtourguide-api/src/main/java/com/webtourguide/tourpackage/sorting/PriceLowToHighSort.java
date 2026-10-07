package com.webtourguide.tourpackage.sorting;

import com.webtourguide.tourpackage.TourPackage;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;

/** Concrete strategy: cheapest package first. */
@Component
public class PriceLowToHighSort implements PackageSortStrategy {

    @Override
    public String getType() {
        return "price-asc";
    }

    @Override
    public Comparator<TourPackage> comparator() {
        return Comparator.comparing(TourPackage::getPrice, Comparator.nullsLast(Comparator.<BigDecimal>naturalOrder()));
    }
}
