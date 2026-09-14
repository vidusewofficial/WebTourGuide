package com.webtourguide.tourpackage;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import com.webtourguide.destination.dto.DestinationResponse;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.tourpackage.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourPackageService {

    private final TourPackageRepository repository;
    private final DestinationRepository destinationRepository;

    public TourPackageService(TourPackageRepository repository,
                              DestinationRepository destinationRepository) {
        this.repository = repository;
        this.destinationRepository = destinationRepository;
    }

    /**
     * Transactional (readOnly) so the session stays open while toResponse()
     * lazily loads each package's galleryUrls collection - open-in-view is
     * disabled for this project.
     */
    @Transactional(readOnly = true)
    public List<TourPackageResponse> getAllActive() {
        return repository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TourPackageResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    @Transactional(readOnly = true)
    public List<TourPackageResponse> getByDestination(Long destinationId) {
        return repository.findByDestinationId(destinationId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TourPackageResponse> compare(List<Long> ids) {
        return repository.findByIdIn(ids)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TourPackageResponse> search(String keyword) {
        return repository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TourPackageResponse create(TourPackageRequest req) {
        Destination destination = destinationRepository.findById(req.getDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destination " + req.getDestinationId() + " not found"));

        TourPackage pkg = TourPackage.builder()
                .destination(destination)
                .title(req.getTitle())
                .description(req.getDescription())
                .durationDays(req.getDurationDays())
                .price(req.getPrice())
                .maxParticipants(req.getMaxParticipants())
                .active(req.getActive() == null ? Boolean.TRUE : req.getActive())
                .imageUrl(req.getImageUrl())
                .galleryUrls(req.getGalleryUrls())
                .build();

        return toResponse(repository.save(pkg));
    }

    @Transactional
    public TourPackageResponse update(Long id, TourPackageRequest req) {
        TourPackage pkg = findEntity(id);

        if (!pkg.getDestination().getId().equals(req.getDestinationId())) {
            Destination destination = destinationRepository.findById(req.getDestinationId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Destination " + req.getDestinationId() + " not found"));
            pkg.setDestination(destination);
        }

        pkg.setTitle(req.getTitle());
        pkg.setDescription(req.getDescription());
        pkg.setDurationDays(req.getDurationDays());
        pkg.setPrice(req.getPrice());
        pkg.setMaxParticipants(req.getMaxParticipants());
        if (req.getActive() != null) {
            pkg.setActive(req.getActive());
        }
        if (req.getImageUrl() != null) {
            pkg.setImageUrl(req.getImageUrl());
        }
        if (req.getGalleryUrls() != null) {
            pkg.setGalleryUrls(req.getGalleryUrls());
        }

        return toResponse(repository.save(pkg));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Tour package " + id + " not found");
        }
        repository.deleteById(id);
    }

    private TourPackage findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour package " + id + " not found"));
    }

    private TourPackageResponse toResponse(TourPackage pkg) {
        Destination d = pkg.getDestination();
        DestinationResponse destResponse = DestinationResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .category(d.getCategory())
                .location(d.getLocation())
                .description(d.getDescription())
                .imageUrl(d.getImageUrl())
                .latitude(d.getLatitude())
                .longitude(d.getLongitude())
                .build();

        return TourPackageResponse.builder()
                .id(pkg.getId())
                .destination(destResponse)
                .title(pkg.getTitle())
                .description(pkg.getDescription())
                .durationDays(pkg.getDurationDays())
                .price(pkg.getPrice())
                .maxParticipants(pkg.getMaxParticipants())
                .active(pkg.getActive())
                .imageUrl(pkg.getImageUrl())
                // Copy into a plain ArrayList to force-fetch this lazy collection now,
                // while the transaction (and Hibernate session) is still open - assigning
                // the raw Hibernate proxy would defer the fetch until Jackson serializes
                // the response later, after the session has already closed.
                .galleryUrls(pkg.getGalleryUrls() == null ? null : new java.util.ArrayList<>(pkg.getGalleryUrls()))
                .build();
    }
}
