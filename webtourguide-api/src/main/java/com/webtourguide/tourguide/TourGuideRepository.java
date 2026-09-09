package com.webtourguide.tourguide;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TourGuideRepository extends JpaRepository<TourGuide, Long> {
    List<TourGuide> findByIsAvailableTrue();
    List<TourGuide> findByLanguagesContainingIgnoreCase(String language);
    Optional<TourGuide> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}