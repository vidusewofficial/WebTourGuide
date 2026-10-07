package com.webtourguide.user;

import com.webtourguide.booking.BookingRepository;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.guideapplication.GuideApplicationRepository;
import com.webtourguide.support.SupportTicketRepository;
import com.webtourguide.tourguide.TourGuideRepository;
import com.webtourguide.tripplan.TripPlanRepository;
import com.webtourguide.user.dto.UserResponse;
import com.webtourguide.user.dto.UserUpdateRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Business-logic layer behind the ADMIN "manage users" screen.
 * Access is restricted to ADMIN both at the security-filter level
 * ({@code /api/admin/**}) and via {@code @PreAuthorize} on the controller.
 */
@Service
public class UserAdminService {

    private static final Logger log = LoggerFactory.getLogger(UserAdminService.class);

    private final UserRepository repository;
    private final BookingRepository bookingRepository;
    private final SupportTicketRepository ticketRepository;
    private final TripPlanRepository tripPlanRepository;
    private final GuideApplicationRepository applicationRepository;
    private final TourGuideRepository guideRepository;

    public UserAdminService(UserRepository repository, BookingRepository bookingRepository,
                            SupportTicketRepository ticketRepository, TripPlanRepository tripPlanRepository,
                            GuideApplicationRepository applicationRepository, TourGuideRepository guideRepository) {
        this.repository = repository;
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.tripPlanRepository = tripPlanRepository;
        this.applicationRepository = applicationRepository;
        this.guideRepository = guideRepository;
    }

    public List<UserResponse> getAll() {
        log.debug("Fetching all users for admin management");
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UserResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest req) {
        log.info("Admin updating user id={}", id);
        User user = findEntity(id);
        if (!user.getEmail().equalsIgnoreCase(req.getEmail()) && repository.existsByEmail(req.getEmail()))
            throw new IllegalStateException("Email already in use by another account");
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setRole(req.getRole());
        return toResponse(repository.save(user));
    }

    @Transactional
    public void delete(Long id, Authentication auth) {
        log.info("Admin deleting user id={}", id);
        User user = findEntity(id);
        if (user.getEmail().equalsIgnoreCase(auth.getName()))
            throw new IllegalStateException("You cannot delete your own account");

        // Bookings and support tickets are business records, so they block the delete.
        if (bookingRepository.existsByTouristId(id))
            throw new IllegalStateException("Cannot delete this user: they have bookings. Delete or cancel those first.");
        if (ticketRepository.existsByRaisedById(id))
            throw new IllegalStateException("Cannot delete this user: they have raised support tickets. Delete those first.");
        guideRepository.findByUserId(id).ifPresent(guide -> {
            if (guideRepository.countBookings(guide.getId()) > 0)
                throw new IllegalStateException("Cannot delete this user: bookings are assigned to their guide profile.");
            guideRepository.delete(guide);
        });

        // Data that only belongs to this user goes with the account.
        tripPlanRepository.deleteAll(tripPlanRepository.findByTouristId(id));
        applicationRepository.deleteAll(applicationRepository.findByApplicantIdOrderByCreatedAtDesc(id));
        // Tickets this user handled as staff stay, just without a handler.
        ticketRepository.findByHandledById(id).forEach(t -> t.setHandledBy(null));

        repository.delete(user);
    }

    private User findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User " + id + " not found"));
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId()).fullName(u.getFullName()).email(u.getEmail())
                .role(u.getRole().name()).phone(u.getPhone()).build();
    }
}
