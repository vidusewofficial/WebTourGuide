package com.webtourguide.patterns.destination;

import com.webtourguide.patterns.model.Destination;

import java.util.List;

/** CONCRETE STRATEGY: partial, case-insensitive match on the destination name. */
public class NameSearchStrategy implements DestinationSearchStrategy {

    private final DestinationRepository repository;

    public NameSearchStrategy(DestinationRepository repository) {
        this.repository = repository;
    }

    @Override
    public String getType() {
        return "name";
    }

    @Override
    public List<Destination> search(String keyword) {
        return repository.findByNameContainingIgnoreCase(keyword);
    }
}
