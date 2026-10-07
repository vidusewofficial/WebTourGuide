package com.webtourguide.destination.search;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/** Concrete strategy: partial, case-insensitive match on the destination location. */
@Component
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
