package com.webtourguide.patterns.destination;

import com.webtourguide.patterns.model.Destination;

import java.util.List;

/**
 * CONTEXT CLASS (Strategy Pattern).
 *
 * Holds a reference to a DestinationSearchStrategy and delegates the search
 * to it. The strategy can be swapped at runtime with setStrategy() without
 * changing this class (composition over inheritance).
 */
public class DestinationSearchContext {

    private DestinationSearchStrategy strategy;

    public DestinationSearchContext(DestinationSearchStrategy strategy) {
        this.strategy = strategy;
    }

    /** Switches the search behaviour at runtime. */
    public void setStrategy(DestinationSearchStrategy strategy) {
        this.strategy = strategy;
    }

    public DestinationSearchStrategy getStrategy() {
        return strategy;
    }

    public List<Destination> executeSearch(String keyword) {
        return strategy.search(keyword);
    }
}
