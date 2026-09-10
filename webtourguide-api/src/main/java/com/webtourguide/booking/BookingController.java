package com.webtourguide.booking;

import com.webtourguide.booking.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService service;
    public BookingController(BookingService service) { this.service = service; }

    @PostMapping
    @PreAuthorize("hasRole('TOURIST')")
    public BookingResponse create(@Valid @RequestBody BookingCreateRequest req, Authentication auth) {
        return service.create(req, auth);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TOURIST')")
    public List<BookingResponse> getMy(Authentication auth) {
        return service.getMyBookings(auth);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<BookingResponse> getAll() {
        return service.getAll();
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('TOURIST','STAFF','ADMIN')")
    public BookingResponse cancel(@PathVariable Long id, Authentication auth) {
        return service.cancel(id, auth);
    }

    @PatchMapping("/{id}/reschedule")
    @PreAuthorize("hasAnyRole('TOURIST','STAFF','ADMIN')")
    public BookingResponse reschedule(@PathVariable Long id, @Valid @RequestBody RescheduleRequest req,
                                       Authentication auth) {
        return service.reschedule(id, req, auth);
    }

    @GetMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TOURIST','STAFF','ADMIN')")
    public Map<String, String> getStatus(@PathVariable Long id, Authentication auth) {
        return Map.of("status", service.getStatus(id, auth));
    }
}
