package com.webtourguide.tripplan;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.tripplan.dto.*;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TripPlanService.
 *
 * Covers: create (success + date validation), getMy (ownership filtering),
 * getById (not-found + forbidden), update (item rebuild + missing destination),
 * delete (success + forbidden).
 */
@ExtendWith(MockitoExtension.class)
class TripPlanServiceTest {

    @Mock private TripPlanRepository repository;
    @Mock private UserRepository userRepository;
    @Mock private DestinationRepository destinationRepository;
    @Mock private Authentication auth;

    private TripPlanService service;

    private User owner;
    private User otherTourist;

    @BeforeEach
    void setUp() {
        service = new TripPlanService(repository, userRepository, destinationRepository);

        owner = User.builder().id(1L).email("owner@example.com").build();
        otherTourist = User.builder().id(2L).email("other@example.com").build();

        // Not every test triggers an auth.getName() lookup (e.g. validation failures
        // and not-found checks short-circuit before ownership is checked).
        lenient().when(auth.getName()).thenReturn(owner.getEmail());
    }

    private TripPlan planOwnedBy(User tourist, Long id) {
        return TripPlan.builder()
                .id(id)
                .tourist(tourist)
                .title("South Coast Getaway")
                .build();
    }

    @Test
    void create_savesNewPlanAndReturnsCorrectTitle() {
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(repository.save(any(TripPlan.class))).thenAnswer(inv -> {
            TripPlan saved = inv.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        TripPlanCreateRequest req = new TripPlanCreateRequest();
        req.setTitle("South Coast Getaway");

        TripPlanResponse response = service.create(req, auth);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getTitle()).isEqualTo("South Coast Getaway");
        assertThat(response.getTouristId()).isEqualTo(owner.getId());

        ArgumentCaptor<TripPlan> captor = ArgumentCaptor.forClass(TripPlan.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getTourist()).isEqualTo(owner);
    }

    @Test
    void create_throwsIllegalStateException_whenStartDateAfterEndDate() {
        TripPlanCreateRequest req = new TripPlanCreateRequest();
        req.setTitle("Bad Dates Trip");
        req.setStartDate(LocalDate.of(2026, 11, 13));
        req.setEndDate(LocalDate.of(2026, 11, 10));

        assertThatThrownBy(() -> service.create(req, auth))
                .isInstanceOf(IllegalStateException.class);

        verifyNoInteractions(repository);
    }

    @Test
    void getMy_returnsOnlyPlansBelongingToAuthenticatedTourist() {
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        TripPlan plan1 = planOwnedBy(owner, 1L);
        TripPlan plan2 = planOwnedBy(owner, 2L);
        when(repository.findByTouristId(owner.getId())).thenReturn(List.of(plan1, plan2));

        List<TripPlanResponse> results = service.getMy(auth);

        assertThat(results).hasSize(2);
        assertThat(results).extracting(TripPlanResponse::getId).containsExactly(1L, 2L);
        verify(repository).findByTouristId(owner.getId());
    }

    @Test
    void getById_throwsResourceNotFoundException_whenPlanDoesNotExist() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(99L, auth))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getById_throwsAccessDeniedException_whenPlanBelongsToDifferentTourist() {
        TripPlan plan = planOwnedBy(otherTourist, 5L);
        when(repository.findById(5L)).thenReturn(Optional.of(plan));

        assertThatThrownBy(() -> service.getById(5L, auth))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void update_clearsExistingItemsAndRebuildsListFromRequest() {
        TripPlan plan = planOwnedBy(owner, 7L);
        Destination destination = Destination.builder().id(3L).name("Sigiriya Rock Fortress").build();

        // Plan starts with one stale item that should be removed by the rebuild.
        plan.getItems().add(TripPlanItem.builder().id(100L).tripPlan(plan).dayNumber(1).build());

        when(repository.findById(7L)).thenReturn(Optional.of(plan));
        when(destinationRepository.findById(3L)).thenReturn(Optional.of(destination));
        when(repository.save(any(TripPlan.class))).thenAnswer(inv -> inv.getArgument(0));

        TripPlanItemRequest itemReq = new TripPlanItemRequest();
        itemReq.setDestinationId(3L);
        itemReq.setDayNumber(1);
        itemReq.setAccommodation("Sigiriya Village Hotel");

        TripPlanUpdateRequest req = new TripPlanUpdateRequest();
        req.setTitle("Updated Title");
        req.setItems(List.of(itemReq));

        TripPlanResponse response = service.update(7L, req, auth);

        assertThat(response.getTitle()).isEqualTo("Updated Title");
        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getItems().get(0).getDestinationName()).isEqualTo("Sigiriya Rock Fortress");
        // The stale item (id=100) must be gone from the in-memory collection so orphanRemoval deletes it.
        assertThat(plan.getItems()).extracting(TripPlanItem::getId).containsExactly((Long) null);
    }

    @Test
    void update_throwsResourceNotFoundException_whenReferencedDestinationDoesNotExist() {
        TripPlan plan = planOwnedBy(owner, 7L);
        when(repository.findById(7L)).thenReturn(Optional.of(plan));
        when(destinationRepository.findById(999L)).thenReturn(Optional.empty());

        TripPlanItemRequest itemReq = new TripPlanItemRequest();
        itemReq.setDestinationId(999L);
        itemReq.setDayNumber(1);

        TripPlanUpdateRequest req = new TripPlanUpdateRequest();
        req.setItems(List.of(itemReq));

        assertThatThrownBy(() -> service.update(7L, req, auth))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(repository, never()).save(any());
    }

    @Test
    void delete_removesPlanFromRepository() {
        TripPlan plan = planOwnedBy(owner, 8L);
        when(repository.findById(8L)).thenReturn(Optional.of(plan));

        service.delete(8L, auth);

        verify(repository).delete(plan);
    }

    @Test
    void delete_throwsAccessDeniedException_whenPlanBelongsToDifferentTourist() {
        TripPlan plan = planOwnedBy(otherTourist, 9L);
        when(repository.findById(9L)).thenReturn(Optional.of(plan));

        assertThatThrownBy(() -> service.delete(9L, auth))
                .isInstanceOf(AccessDeniedException.class);

        verify(repository, never()).delete(any());
    }
}
