package com.webtourguide.support;

import com.webtourguide.support.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/** REST endpoints for tourists to raise tickets and staff to triage them. */
@RestController
@RequestMapping("/api/support/tickets")
public class SupportTicketController {
    private final SupportTicketService service;
    public SupportTicketController(SupportTicketService service) { this.service = service; }

    @PostMapping
    @PreAuthorize("hasRole('TOURIST')")
    public SupportTicketResponse create(@Valid @RequestBody SupportTicketCreateRequest req, Authentication auth) {
        return service.create(req, auth);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TOURIST')")
    public List<SupportTicketResponse> getMy(Authentication auth) {
        return service.getMy(auth);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TOURIST','STAFF','ADMIN')")
    public SupportTicketResponse getById(@PathVariable Long id, Authentication auth) {
        return service.getById(id, auth);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public List<SupportTicketResponse> getAll(@RequestParam(required = false) TicketStatus status) {
        return service.getAll(status);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public SupportTicketResponse updateStatus(@PathVariable Long id, @Valid @RequestBody TicketStatusUpdateRequest req,
                                               Authentication auth) {
        return service.updateStatus(id, req, auth);
    }
}
