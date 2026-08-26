package com.webtourguide.destination;

import com.webtourguide.destination.dto.*;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService service;

    public DestinationController(DestinationService service) {
        this.service = service;
    }

    @GetMapping
    public List<DestinationResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public DestinationResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/search")
    public List<DestinationResponse> search(
            @RequestParam String keyword) {
        return service.search(keyword);
    }

    @GetMapping("/filter")
    public List<DestinationResponse> filter(
            @RequestParam String category) {
        return service.filterByCategory(category);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public DestinationResponse create(
            @Valid @RequestBody DestinationRequest req) {

        return service.create(req, null);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public DestinationResponse update(
            @PathVariable Long id,
            @Valid @RequestBody DestinationRequest req) {

        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}