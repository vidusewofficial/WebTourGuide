package com.webtourguide.patterns.model;

/** A place tourists can visit (mirrors the Destination entity in the web project). */
public class Destination {

    private final Long id;
    private final String name;
    private final String category;
    private final String location;

    public Destination(Long id, String name, String category, String location) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.location = location;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getLocation() { return location; }

    @Override
    public String toString() {
        return name + " (" + category + ", " + location + ")";
    }
}
