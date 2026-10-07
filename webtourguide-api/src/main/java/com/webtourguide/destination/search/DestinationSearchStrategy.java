package com.webtourguide.destination.search;

import com.webtourguide.destination.Destination;

import java.util.List;

/**
 * Strategy interface (Strategy Pattern).
 *
 * Each implementation encapsulates one way of searching destinations
 * (by name, by location, by category, or across all fields). The
 * {@link DestinationSearchContext} delegates to whichever strategy it
 * currently holds, so new search behaviours can be added without
 * touching the service or controller.
 */
public interface DestinationSearchStrategy {

    /** Key used to select this strategy at runtime, e.g. "name". */
    String getType();

    /** Returns the destinations that match the given keyword. */
    List<Destination> search(String keyword);
}
