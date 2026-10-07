package com.webtourguide.tourpackage;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import com.webtourguide.destination.dto.DestinationResponse;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.tourpackage.dto.*;
import com.webtourguide.tourpackage.sorting.PackageSortContext;
import com.webtourguide.tourpackage.sorting.PackageSortStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TourPackageService {

    private final TourPackageRepository repository;
    private final DestinationRepository destinationRepository;

    /** Strategy Pattern: all package sort strategies, keyed by type ("price-asc", ...). */
    private final Map<String, PackageSortStrategy> sortStrategies;

    public TourPackageService(TourPackageRepository repository,
                              DestinationRepository destinationRepository,
                              List<PackageSortStrategy> sortStrategies) {
        this.repository = repository;
        this.destinationRepository = destinationRepository;
        this.sortStrategies = sortStrategies.stream()
                .collect(Collectors.toMap(PackageSortStrategy::getType, Function.identity()));
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

    /**
     * Active packages ordered by the strategy named in {@code sort}
     * ("price-asc", "price-desc", "duration" or "newest"), chosen at runtime.
     */
    @Transactional(readOnly = true)
    public List<TourPackageResponse> getAllActive(String sort) {
        return list(sort, false);
    }

    /**
     * Packages for the listing page: active ones only, or every package when
     * {@code includeInactive} is set (ADMIN/STAFF managing the catalogue).
     * {@code sort} is optional; when given it picks the sorting strategy.
     */
    @Transactional(readOnly = true)
    public List<TourPackageResponse> list(String sort, boolean includeInactive) {
        List<TourPackage> packages = includeInactive ? repository.findAll() : repository.findByActiveTrue();
        if (sort != null && !sort.isBlank()) {
            PackageSortStrategy strategy = sortStrategies.get(sort.trim().toLowerCase());
            if (strategy == null) {
                throw new IllegalStateException(
                        "Unknown sort '" + sort + "'. Allowed: " + sortStrategies.keySet());
            }
            packages = new PackageSortContext(strategy).sort(packages);
        }
        return packages.stream()
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
        if (req.getMaxParticipants() != null) {
            pkg.setMaxParticipants(req.getMaxParticipants());
        }
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

    /** Deletes a package. Blocked once it has bookings - deactivate it instead to keep the history. */
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Tour package " + id + " not found");
        }
        long bookings = repository.countBookings(id);
        if (bookings > 0) {
            throw new IllegalStateException("Cannot delete this package: it has " + bookings
                    + " booking(s). Mark it inactive instead so it can no longer be booked.");
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
