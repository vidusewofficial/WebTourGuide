package com.webtourguide.user;

import com.webtourguide.user.dto.UserResponse;
import com.webtourguide.user.dto.UserUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ADMIN-only user management endpoints at {@code /api/admin/users}.
 *
 * <pre>
 * GET    /api/admin/users       ADMIN
 * GET    /api/admin/users/{id}  ADMIN
 * PUT    /api/admin/users/{id}  ADMIN
 * DELETE /api/admin/users/{id}  ADMIN
 * </pre>
 *
 * SecurityConfig additionally restricts every {@code /api/admin/**} path to ADMIN;
 * the {@code @PreAuthorize} here is defense-in-depth and self-documenting.
 */
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserAdminService service;

    public AdminUserController(UserAdminService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        service.delete(id, auth);
    }
}
