package com.webtourguide.destination.search;

import com.webtourguide.destination.Destination;

import java.util.List;

/**
 * Context class (Strategy Pattern).
 *
 * Holds a reference to a {@link DestinationSearchStrategy} and delegates the
 * search to it. The strategy can be swapped at runtime with
 * {@link #setStrategy(DestinationSearchStrategy)} without changing this class.
 *
 * Deliberately not a Spring bean: a new context is created per request so the
 * mutable strategy reference is never shared between concurrent requests.
 */
public class DestinationSearchContext {

    private DestinationSearchStrategy strategy;

    public DestinationSearchContext(DestinationSearchStrategy strategy) {
        this.strategy = strategy;
    }

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
