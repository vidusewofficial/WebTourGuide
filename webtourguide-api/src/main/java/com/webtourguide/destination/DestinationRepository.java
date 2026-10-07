package com.webtourguide.destination;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {

    List<Destination> findByCategoryIgnoreCase(String category);

    List<Destination> findByLocationContainingIgnoreCase(String location);

    List<Destination> findByNameContainingIgnoreCase(String name);

    List<Destination> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String name, String location, String category);

    /** Number of tour packages offered at this destination (they block deleting it). */
    @Query("select count(p) from TourPackage p where p.destination.id = :id")
    long countPackages(@Param("id") Long id);

    /** Turns trip-plan days that visit this destination into rest days, so it can be deleted. */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update TripPlanItem i set i.destination = null where i.destination.id = :id")
    int detachFromTripPlanItems(@Param("id") Long id);
}
