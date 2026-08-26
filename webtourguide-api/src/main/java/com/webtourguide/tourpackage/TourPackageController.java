package com.webtourguide.tourpackage;

import com.webtourguide.tourpackage.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class TourPackageController {

    private final TourPackageService service;

    public TourPackageController(TourPackageService service) {
        this.service = service;
    }

    @GetMapping
    public List<TourPackageResponse> getAll() {
        return service.getAllActive();
    }

    @GetMapping("/{id}")
    public TourPackageResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/destination/{destinationId}")
    public List<TourPackageResponse> byDestination(@PathVariable Long destinationId) {
        return service.getByDestination(destinationId);
    }

    @GetMapping("/compare")
    public List<TourPackageResponse> compare(@RequestParam List<Long> ids) {
        return service.compare(ids);
    }

    @GetMapping("/search")
    public List<TourPackageResponse> search(@RequestParam String keyword) {
        return service.search(keyword);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public TourPackageResponse create(@Valid @RequestBody TourPackageRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public TourPackageResponse update(@PathVariable Long id, @Valid @RequestBody TourPackageRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
