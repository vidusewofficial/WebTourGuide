package com.webtourguide.tourpackage;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import com.webtourguide.destination.dto.DestinationResponse;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.tourpackage.dto.*;
import org.springframework.stereotype.Service;

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

    public List<TourPackageResponse> getAllActive() {
        return repository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TourPackageResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public List<TourPackageResponse> getByDestination(Long destinationId) {
        return repository.findByDestinationId(destinationId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TourPackageResponse> compare(List<Long> ids) {
        return repository.findByIdIn(ids)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TourPackageResponse> search(String keyword) {
        return repository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

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
                .build();

        return toResponse(repository.save(pkg));
    }

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
                .build();
    }
}
