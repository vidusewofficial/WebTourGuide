package com.webtourguide.patterns.destination;

import com.webtourguide.patterns.model.Destination;

import java.util.List;

/** CONCRETE STRATEGY: partial, case-insensitive match on the location. */
public class LocationSearchStrategy implements DestinationSearchStrategy {

    private final DestinationRepository repository;

    public LocationSearchStrategy(DestinationRepository repository) {
        this.repository = repository;
    }

    @Override
    public String getType() {
        return "location";
    }

    @Override
    public List<Destination> search(String keyword) {
        return repository.findByLocationContainingIgnoreCase(keyword);
    }
}
