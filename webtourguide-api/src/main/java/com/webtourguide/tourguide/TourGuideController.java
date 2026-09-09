package com.webtourguide.tourguide;

import com.webtourguide.tourguide.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
public class TourGuideController {

    private final TourGuideService service;

    public TourGuideController(TourGuideService service) {
        this.service = service;
    }

    /** Public - browse all guide profiles */
    @GetMapping
    public List<TourGuideResponse> getAll() {
        return service.getAll();
    }

    /** Public - view a single guide profile */
    @GetMapping("/{id}")
    public TourGuideResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    /** Public - only currently available guides */
    @GetMapping("/available")
    public List<TourGuideResponse> getAvailable() {
        return service.getAvailable();
    }

    /** Public - filter by spoken language */
    @GetMapping("/search")
    public List<TourGuideResponse> search(@RequestParam String language) {
        return service.searchByLanguage(language);
    }

    /** ADMIN / STAFF - link an existing TOUR_GUIDE user to a new profile */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public TourGuideResponse create(@Valid @RequestBody TourGuideCreateRequest req) {
        return service.create(req);
    }

    /** TOUR_GUIDE (own profile) or ADMIN - update skills, certifications, experience */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TOUR_GUIDE','ADMIN')")
    public TourGuideResponse update(@PathVariable Long id,
                                    @RequestBody TourGuideUpdateRequest req,
                                    Authentication auth) {
        return service.updateProfile(id, req, auth);
    }

    /** TOUR_GUIDE (own profile) or ADMIN - toggle available / unavailable */
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('TOUR_GUIDE','ADMIN')")
    public TourGuideResponse updateAvailability(@PathVariable Long id,
                                                @Valid @RequestBody AvailabilityUpdateRequest req,
                                                Authentication auth) {
        return service.updateAvailability(id, req, auth);
    }

    /** ADMIN only - remove a guide listing */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}