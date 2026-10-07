package com.webtourguide.destination.search;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/** Concrete strategy: exact, case-insensitive match on the destination category. */
@Component
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
