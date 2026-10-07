package com.webtourguide.patterns.destination;

import com.webtourguide.patterns.model.Destination;

import java.util.List;

/**
 * STRATEGY INTERFACE (Strategy Pattern) - Destination Management module.
 *
 * Each implementation encapsulates one way of searching destinations
 * (by name, location, category, or across all fields). The context delegates
 * to whichever strategy it currently holds, so a new search mode is a new
 * class instead of another if/else branch.
 */
public interface DestinationSearchStrategy {

    /** Key used to choose this strategy at runtime, e.g. "name". */
    String getType();

    /** Returns the destinations that match the keyword. */
    List<Destination> search(String keyword);
}
