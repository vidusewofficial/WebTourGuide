package com.webtourguide.tourguide;

import com.webtourguide.tourguide.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller exposing the Tour Guide Management endpoints at {@code /api/guides}.
 *
 * <pre>
 * GET    /api/guides                   public
 * GET    /api/guides/{id}              public
 * GET    /api/guides/available         public
 * GET    /api/guides/search?language=  public
 * POST   /api/guides                   ADMIN, STAFF
 * PUT    /api/guides/{id}              TOUR_GUIDE (own), ADMIN
 * PATCH  /api/guides/{id}/availability TOUR_GUIDE (own), ADMIN
 * DELETE /api/guides/{id}              ADMIN
 * </pre>
 */
@RestController
@RequestMapping("/api/guides")
public class TourGuideController {

    private final TourGuideService service;

    public TourGuideController(TourGuideService service) {
        this.service = service;
    }

    /** Returns all guide profiles (public). */
    @GetMapping
    public List<TourGuideResponse> getAll() {
        return service.getAll();
    }

    /** Returns one guide profile by ID (public). */
    @GetMapping("/{id}")
    public TourGuideResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    /** Returns only guides currently marked as available (public). */
    @GetMapping("/available")
    public List<TourGuideResponse> getAvailable() {
        return service.getAvailable();
    }

    /** Filters guides by spoken language keyword (public). */
    @GetMapping("/search")
    public List<TourGuideResponse> search(@RequestParam String language) {
        return service.searchByLanguage(language);
    }

    /** Creates a guide profile linking an existing TOUR_GUIDE user (ADMIN / STAFF only). */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public TourGuideResponse create(@Valid @RequestBody TourGuideCreateRequest req) {
        return service.create(req);
    }

    /** Updates the guide's own profile (or ADMIN can update any). */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TOUR_GUIDE','ADMIN')")
    public TourGuideResponse update(@PathVariable Long id,
                                    @Valid @RequestBody TourGuideUpdateRequest req,
                                    Authentication auth) {
        return service.updateProfile(id, req, auth);
    }

    /** Toggles the guide's availability flag (owner or ADMIN). */
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('TOUR_GUIDE','ADMIN')")
    public TourGuideResponse updateAvailability(@PathVariable Long id,
                                                @Valid @RequestBody AvailabilityUpdateRequest req,
                                                Authentication auth) {
        return service.updateAvailability(id, req, auth);
    }

    /** Removes a guide listing permanently (ADMIN only). */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}