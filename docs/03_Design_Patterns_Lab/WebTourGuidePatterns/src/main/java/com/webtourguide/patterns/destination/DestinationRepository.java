package com.webtourguide.patterns.destination;

import com.webtourguide.patterns.model.Destination;

import java.util.List;

/**
 * In-memory stand-in for the Spring Data DestinationRepository used by the web
 * project, so this demo runs without a database. Each query mirrors a finder
 * method that the real search strategies call.
 */
public class DestinationRepository {

    private final List<Destination> destinations;

    public DestinationRepository(List<Destination> destinations) {
        this.destinations = destinations;
    }

    public List<Destination> findByNameContainingIgnoreCase(String name) {
        return destinations.stream().filter(d -> contains(d.getName(), name)).toList();
    }

    public List<Destination> findByLocationContainingIgnoreCase(String location) {
        return destinations.stream().filter(d -> contains(d.getLocation(), location)).toList();
    }

    public List<Destination> findByCategoryIgnoreCase(String category) {
        return destinations.stream().filter(d -> d.getCategory().equalsIgnoreCase(category)).toList();
    }

    public List<Destination> findByAnyField(String keyword) {
        return destinations.stream()
                .filter(d -> contains(d.getName(), keyword)
                        || contains(d.getLocation(), keyword)
                        || contains(d.getCategory(), keyword))
                .toList();
    }

    private static boolean contains(String value, String keyword) {
        return value.toLowerCase().contains(keyword.toLowerCase());
    }
}
