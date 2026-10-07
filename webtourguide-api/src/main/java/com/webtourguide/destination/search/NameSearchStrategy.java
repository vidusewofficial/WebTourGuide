package com.webtourguide.destination.search;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/** Concrete strategy: partial, case-insensitive match on the destination name. */
@Component
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
