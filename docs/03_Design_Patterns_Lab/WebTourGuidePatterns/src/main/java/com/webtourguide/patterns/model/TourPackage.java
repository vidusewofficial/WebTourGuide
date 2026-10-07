package com.webtourguide.patterns.model;

import java.math.BigDecimal;
import java.time.LocalDate;

/** A bookable tour package at a destination (mirrors the TourPackage entity). */
public class TourPackage {

    private final Long id;
    private final String title;
    private final int durationDays;
    private final BigDecimal price;
    private final LocalDate createdAt;

    public TourPackage(Long id, String title, int durationDays, double price, LocalDate createdAt) {
        this.id = id;
        this.title = title;
        this.durationDays = durationDays;
        this.price = BigDecimal.valueOf(price);
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public Integer getDurationDays() { return durationDays; }
    public BigDecimal getPrice() { return price; }
    public LocalDate getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return String.format("%-26s %2d days  $%8.2f  added %s", title, durationDays, price, createdAt);
    }
}
