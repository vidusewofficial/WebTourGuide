package com.webtourguide.destination;

import com.webtourguide.destination.dto.*;
import com.webtourguide.destination.search.DestinationSearchContext;
import com.webtourguide.destination.search.DestinationSearchStrategy;
import com.webtourguide.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository repository;

    /** All search strategies, keyed by their type ("name", "location", ...). */
    private final Map<String, DestinationSearchStrategy> searchStrategies;

    public DestinationService(DestinationRepository repository,
                              List<DestinationSearchStrategy> searchStrategies) {
        this.repository = repository;
        this.searchStrategies = searchStrategies.stream()
                .collect(Collectors.toMap(DestinationSearchStrategy::getType, Function.identity()));
    }

    /**
     * Transactional (readOnly) so the session stays open while toResponse()
     * lazily loads each destination's galleryUrls collection - open-in-view
     * is disabled for this project.
     */
    @Transactional(readOnly = true)
    public List<DestinationResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DestinationResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    /**
     * Strategy Pattern: picks the search strategy for {@code type} at runtime
     * and lets the context run it, instead of an if/else per search mode.
     */
    @Transactional(readOnly = true)
    public List<DestinationResponse> search(String keyword, String type) {
        DestinationSearchContext context = new DestinationSearchContext(resolveStrategy(type));
        return context.executeSearch(keyword)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DestinationResponse> filterByCategory(String category) {
        return search(category, "category");
    }

    private DestinationSearchStrategy resolveStrategy(String type) {
        String key = type == null ? "name" : type.trim().toLowerCase();
        DestinationSearchStrategy strategy = searchStrategies.get(key);
        if (strategy == null) {
            throw new IllegalStateException(
                    "Unknown search type '" + type + "'. Allowed: " + searchStrategies.keySet());
        }
        return strategy;
    }

    @Transactional
    public DestinationResponse create(DestinationRequest req, Long adminUserId) {

        Destination d = Destination.builder()
                .name(req.getName())
                .category(req.getCategory())
                .location(req.getLocation())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .galleryUrls(req.getGalleryUrls())
                .createdBy(adminUserId)
                .build();

        return toResponse(repository.save(d));
    }

    @Transactional
    public DestinationResponse update(Long id, DestinationRequest req) {

        Destination d = findEntity(id);

        d.setName(req.getName());
        d.setCategory(req.getCategory());
        d.setLocation(req.getLocation());
        d.setDescription(req.getDescription());
        d.setImageUrl(req.getImageUrl());
        d.setLatitude(req.getLatitude());
        d.setLongitude(req.getLongitude());
        if (req.getGalleryUrls() != null) {
            d.setGalleryUrls(req.getGalleryUrls());
        }

        return toResponse(repository.save(d));
    }

    /**
     * Deletes a destination. Blocked while tour packages still use it; trip-plan
     * days that visit it become rest days instead of blocking the delete.
     */
    @Transactional
    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Destination " + id + " not found"
            );
        }

        long packages = repository.countPackages(id);
        if (packages > 0) {
            throw new IllegalStateException(
                    "Cannot delete this destination: " + packages
                            + " tour package(s) use it. Delete or move those packages first.");
        }

        repository.detachFromTripPlanItems(id);
        repository.deleteById(id);
    }

    private Destination findEntity(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Destination " + id + " not found"
                        )
                );
    }

    private DestinationResponse toResponse(Destination d) {

        return DestinationResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .category(d.getCategory())
                .location(d.getLocation())
                .description(d.getDescription())
                .imageUrl(d.getImageUrl())
                .latitude(d.getLatitude())
                .longitude(d.getLongitude())
                // Copy into a plain ArrayList to force-fetch this lazy collection now,
                // while the transaction (and Hibernate session) is still open - assigning
                // the raw Hibernate proxy would defer the fetch until Jackson serializes
                // the response later, after the session has already closed.
                .galleryUrls(d.getGalleryUrls() == null ? null : new java.util.ArrayList<>(d.getGalleryUrls()))
                .build();
    }
}