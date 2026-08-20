package com.webtourguide.destination;

import com.webtourguide.destination.dto.*;
import com.webtourguide.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository repository;

    public DestinationService(DestinationRepository repository) {
        this.repository = repository;
    }

    public List<DestinationResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DestinationResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public List<DestinationResponse> search(String keyword) {
        return repository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DestinationResponse> filterByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DestinationResponse create(DestinationRequest req, Long adminUserId) {

        Destination d = Destination.builder()
                .name(req.getName())
                .category(req.getCategory())
                .location(req.getLocation())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .createdBy(adminUserId)
                .build();

        return toResponse(repository.save(d));
    }

    public DestinationResponse update(Long id, DestinationRequest req) {

        Destination d = findEntity(id);

        d.setName(req.getName());
        d.setCategory(req.getCategory());
        d.setLocation(req.getLocation());
        d.setDescription(req.getDescription());
        d.setImageUrl(req.getImageUrl());
        d.setLatitude(req.getLatitude());
        d.setLongitude(req.getLongitude());

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
                .build();
    }
}