package com.webtourguide.tripplan;

import com.webtourguide.tripplan.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the Trip Planning module.
 *
 * Base URL: /api/trip-plans
 *
 * All endpoints are restricted to users with the TOURIST role.
 * CORS is handled globally by CorsConfig — no per-controller annotation needed.
 *
 * Ownership enforcement (a tourist can only access their own plans)
 * is done in TripPlanService, not here.
 */
@RestController
@RequestMapping("/api/trip-plans")
@PreAuthorize("hasRole('TOURIST')")
public class TripPlanController {

    private final TripPlanService service;

    public TripPlanController(TripPlanService service) {
        this.service = service;
    }

    /**
     * Creates a new trip plan for the logged-in tourist.
     * POST /api/trip-plans
     */
    @PostMapping
    public TripPlanResponse create(@Valid @RequestBody TripPlanCreateRequest req,
                                   Authentication auth) {
        return service.create(req, auth);
    }

    /**
     * Returns all trip plans belonging to the logged-in tourist.
     * GET /api/trip-plans/my
     */
    @GetMapping("/my")
    public List<TripPlanResponse> getMy(Authentication auth) {
        return service.getMy(auth);
    }

    /**
     * Returns a single trip plan by ID, only if it belongs to the caller.
     * GET /api/trip-plans/{id}
     */
    @GetMapping("/{id}")
    public TripPlanResponse getById(@PathVariable Long id, Authentication auth) {
        return service.getById(id, auth);
    }

    /**
     * Replaces the title, dates, and full item list of an existing plan.
     * PUT /api/trip-plans/{id}
     */
    @PutMapping("/{id}")
    public TripPlanResponse update(@PathVariable Long id,
                                   @Valid @RequestBody TripPlanUpdateRequest req,
                                   Authentication auth) {
        return service.update(id, req, auth);
    }

    /**
     * Permanently deletes a trip plan and all its day items.
     * DELETE /api/trip-plans/{id}
     * Returns 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication auth) {
        service.delete(id, auth);
    }
}
