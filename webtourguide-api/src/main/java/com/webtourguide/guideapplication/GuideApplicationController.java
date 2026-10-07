package com.webtourguide.guideapplication;

import com.webtourguide.guideapplication.dto.*;
import com.webtourguide.tourguide.dto.TourGuideResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the "apply to become a guide" workflow at {@code /api/guide-applications}.
 *
 * <pre>
 * POST   /api/guide-applications             any authenticated user (service enforces TOURIST-only)
 * GET    /api/guide-applications/my           any authenticated user
 * GET    /api/guide-applications?status=      ADMIN, STAFF
 * POST   /api/guide-applications/{id}/approve ADMIN only (creates the guide's login)
 * POST   /api/guide-applications/{id}/reject  ADMIN, STAFF
 * </pre>
 */
@RestController
@RequestMapping("/api/guide-applications")
public class GuideApplicationController {

    private final GuideApplicationService service;

    public GuideApplicationController(GuideApplicationService service) {
        this.service = service;
    }

    /** Submits a new application to become a guide (must be logged in as TOURIST). */
    @PostMapping
    public GuideApplicationResponse apply(@Valid @RequestBody GuideApplicationRequest req, Authentication auth) {
        return service.apply(auth, req);
    }

    /** Returns the caller's own applications, most recent first. */
    @GetMapping("/my")
    public List<GuideApplicationResponse> getMine(Authentication auth) {
        return service.getMine(auth);
    }

    /** Lists every application, optionally filtered by status (ADMIN / STAFF only). */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<GuideApplicationResponse> getAll(@RequestParam(required = false) ApplicationStatus status) {
        return service.getAll(status);
    }

    /** Approves an application: promotes the applicant to TOUR_GUIDE and creates their profile (ADMIN only). */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public TourGuideResponse approve(@PathVariable Long id, @Valid @RequestBody GuideApplicationApproveRequest req) {
        return service.approve(id, req);
    }

    /** Rejects an application, optionally with a reviewer note (ADMIN / STAFF only). */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public GuideApplicationResponse reject(@PathVariable Long id,
                                            @RequestBody(required = false) GuideApplicationRejectRequest req) {
        return service.reject(id, req == null ? new GuideApplicationRejectRequest() : req);
    }
}
