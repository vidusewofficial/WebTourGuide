package com.webtourguide.tripplan;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.tripplan.dto.*;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for the Trip Planning module.
 *
 * Business rules enforced here:
 *   - A tourist may only view, edit, or delete their OWN trip plans.
 *   - Start date must not be after end date.
 *   - When updating items, the existing list is cleared and rebuilt in place
 *     so Hibernate's orphanRemoval deletes dropped rows automatically.
 *   - There is no ADMIN or STAFF override for this module.
 */
@Service
public class TripPlanService {

    private final TripPlanRepository repository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public TripPlanService(TripPlanRepository repository,
                           UserRepository userRepository,
                           DestinationRepository destinationRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Creates a new trip plan for the currently authenticated tourist.
     * Items can be added later via {@link #update}.
     */
    public TripPlanResponse create(TripPlanCreateRequest req, Authentication auth) {
        validateDateRange(req.getStartDate(), req.getEndDate());
        User tourist = currentUser(auth);
        TripPlan plan = TripPlan.builder()
                .tourist(tourist)
                .title(req.getTitle())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .build();
        return toResponse(repository.save(plan));
    }

    /**
     * Returns all trip plans belonging to the currently authenticated tourist.
     * Transactional so the session stays open while toResponse() lazily
     * loads each plan's items (open-in-view is disabled for this project).
     */
    @Transactional(readOnly = true)
    public List<TripPlanResponse> getMy(Authentication auth) {
        User tourist = currentUser(auth);
        return repository.findByTouristId(tourist.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns a single trip plan by ID, verifying that it belongs to the caller.
     *
     * @throws ResourceNotFoundException  if the plan does not exist
     * @throws AccessDeniedException      if the plan belongs to a different tourist
     */
    @Transactional(readOnly = true)
    public TripPlanResponse getById(Long id, Authentication auth) {
        TripPlan plan = findEntity(id);
        assertOwner(plan, auth);
        return toResponse(plan);
    }

    /**
     * Replaces the title, dates, and full item list of an existing plan.
     * Items not included in the new list are deleted from the database.
     *
     * @throws ResourceNotFoundException  if the plan or any referenced destination is not found
     * @throws AccessDeniedException      if the plan belongs to a different tourist
     * @throws IllegalStateException      if start date is after end date
     */
    @Transactional
    public TripPlanResponse update(Long id, TripPlanUpdateRequest req, Authentication auth) {
        TripPlan plan = findEntity(id);
        assertOwner(plan, auth);
        validateDateRange(req.getStartDate(), req.getEndDate());

        if (req.getTitle() != null)     plan.setTitle(req.getTitle());
        if (req.getStartDate() != null) plan.setStartDate(req.getStartDate());
        if (req.getEndDate() != null)   plan.setEndDate(req.getEndDate());

        if (req.getItems() != null) {
            // Mutate the existing collection in place so orphanRemoval fires correctly.
            // Never reassign plan.setItems(newList) — that breaks orphan tracking.
            plan.getItems().clear();
            for (TripPlanItemRequest itemReq : req.getItems()) {
                Destination destination = null;
                if (itemReq.getDestinationId() != null) {
                    destination = destinationRepository.findById(itemReq.getDestinationId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Destination " + itemReq.getDestinationId() + " not found"));
                }
                TripPlanItem item = TripPlanItem.builder()
                        .tripPlan(plan)
                        .destination(destination)
                        .dayNumber(itemReq.getDayNumber())
                        .accommodation(itemReq.getAccommodation())
                        .transportation(itemReq.getTransportation())
                        .activities(itemReq.getActivities())
                        .notes(itemReq.getNotes())
                        .build();
                plan.getItems().add(item);
            }
        }
        return toResponse(repository.save(plan));
    }

    /**
     * Permanently deletes a trip plan and all its day items.
     *
     * @throws ResourceNotFoundException if the plan does not exist
     * @throws AccessDeniedException     if the plan belongs to a different tourist
     */
    public void delete(Long id, Authentication auth) {
        TripPlan plan = findEntity(id);
        assertOwner(plan, auth);
        repository.delete(plan);
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /** Resolves the currently authenticated user from the database. */
    private User currentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    /** Throws AccessDeniedException unless the plan's tourist matches the caller. */
    private void assertOwner(TripPlan plan, Authentication auth) {
        if (!plan.getTourist().getEmail().equalsIgnoreCase(auth.getName())) {
            throw new AccessDeniedException("You can only manage your own trip plans");
        }
    }

    /** Finds a plan by ID or throws ResourceNotFoundException. */
    private TripPlan findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip plan " + id + " not found"));
    }

    /** Validates that startDate is not after endDate when both are provided. */
    private void validateDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalStateException("Start date must not be after end date");
        }
    }

    /** Maps a TripPlan entity to its response DTO. */
    private TripPlanResponse toResponse(TripPlan plan) {
        return TripPlanResponse.builder()
                .id(plan.getId())
                .touristId(plan.getTourist().getId())
                .title(plan.getTitle())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .createdAt(plan.getCreatedAt())
                .items(plan.getItems().stream()
                        .map(this::toItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    /** Maps a TripPlanItem entity to its response DTO. */
    private TripPlanItemResponse toItemResponse(TripPlanItem item) {
        return TripPlanItemResponse.builder()
                .id(item.getId())
                .destinationId(item.getDestination() != null ? item.getDestination().getId() : null)
                .destinationName(item.getDestination() != null ? item.getDestination().getName() : null)
                .dayNumber(item.getDayNumber())
                .accommodation(item.getAccommodation())
                .transportation(item.getTransportation())
                .activities(item.getActivities())
                .notes(item.getNotes())
                .build();
    }
}
