package com.webtourguide.tourguide;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link TourGuide} entities.
 * Provides CRUD operations and custom finder methods used by
 * {@link TourGuideService}.
 */
public interface TourGuideRepository extends JpaRepository<TourGuide, Long> {

    /**
     * Returns all guide profiles whose {@code isAvailable} flag is {@code true}.
     * Used by the public "available guides" endpoint.
     */
    List<TourGuide> findByIsAvailableTrue();

    /**
     * Case-insensitive substring search on the {@code languages} column.
     * Allows tourists to filter by any language they speak.
     *
     * @param language the language keyword, e.g. "Tamil"
     */
    List<TourGuide> findByLanguagesContainingIgnoreCase(String language);

    /**
     * Looks up a guide profile by the linked user's ID.
     * Useful when the caller has a user ID (e.g. from the JWT) rather
     * than the guide profile ID.
     *
     * @param userId the {@code users.id} foreign key
     */
    Optional<TourGuide> findByUserId(Long userId);

    /**
     * Returns {@code true} if a guide profile already exists for the given user.
     * Used in {@link TourGuideService#create} to prevent duplicate profiles.
     *
     * @param userId the {@code users.id} foreign key
     */
    boolean existsByUserId(Long userId);
}