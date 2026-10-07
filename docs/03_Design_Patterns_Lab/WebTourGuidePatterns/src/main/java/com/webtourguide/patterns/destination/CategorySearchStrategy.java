package com.webtourguide.patterns.destination;

import com.webtourguide.patterns.model.Destination;

import java.util.List;

/** CONCRETE STRATEGY: exact, case-insensitive match on the destination category. */
public class CategorySearchStrategy implements DestinationSearchStrategy {

    private final DestinationRepository repository;

    public CategorySearchStrategy(DestinationRepository repository) {
        this.repository = repository;
    }

    @Override
    public String getType() {
        return "category";
    }

    @Override
    public List<Destination> search(String keyword) {
        return repository.findByCategoryIgnoreCase(keyword);
    }
}
