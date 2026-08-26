package com.webtourguide.destination;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {

    List<Destination> findByCategoryIgnoreCase(String category);

    List<Destination> findByLocationContainingIgnoreCase(String location);

    List<Destination> findByNameContainingIgnoreCase(String name);
}