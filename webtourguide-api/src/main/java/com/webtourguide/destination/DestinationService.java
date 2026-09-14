package com.webtourguide.destination;

import com.webtourguide.destination.dto.*;
import com.webtourguide.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository repository;

    public DestinationService(DestinationRepository repository) {
        this.repository = repository;
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

    @Transactional(readOnly = true)
    public List<DestinationResponse> search(String keyword) {
        return repository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DestinationResponse> filterByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
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

    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Destination " + id + " not found"
            );
        }

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