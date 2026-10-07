package com.webtourguide.patterns.destination;

import com.webtourguide.patterns.model.Destination;

import java.util.List;

/** CONCRETE STRATEGY: partial match on name, location or category. */
public class AnyFieldSearchStrategy implements DestinationSearchStrategy {

    private final DestinationRepository repository;

    public AnyFieldSearchStrategy(DestinationRepository repository) {
        this.repository = repository;
    }

    @Override
    public String getType() {
        return "any";
    }

    @Override
    public List<Destination> search(String keyword) {
        return repository.findByAnyField(keyword);
    }
}
