package com.webtourguide.destination.search;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/** Concrete strategy: partial match on name, location or category. */
@Component
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
        return repository
                .findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                        keyword, keyword, keyword);
    }
}
