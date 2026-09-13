package com.webtourguide.tripplan;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository interface for TripPlan entities.
 * Provides standard CRUD operations plus a query to load all plans for a given tourist.
 */
public interface TripPlanRepository extends JpaRepository<TripPlan, Long> {

    /**
     * Returns all trip plans that belong to the tourist with the given user ID.
     * Used by the service to show a tourist only their own plans.
     */
    List<TripPlan> findByTouristId(Long touristId);
}
