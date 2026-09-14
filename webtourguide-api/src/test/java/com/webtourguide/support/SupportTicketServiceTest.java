package com.webtourguide.support;

import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.support.dto.*;
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
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SupportTicketServiceTest {

    @Mock private SupportTicketRepository repository;
    @Mock private UserRepository userRepository;
    @Mock private Authentication auth;

    private SupportTicketService service;

    private User tourist;
    private User otherTourist;
    private User staff;

    @BeforeEach
    void setUp() {
        service = new SupportTicketService(repository, userRepository);

        tourist = User.builder().id(1L).email("tourist@example.com").fullName("Tourist One").build();
        otherTourist = User.builder().id(2L).email("other@example.com").fullName("Tourist Two").build();
        staff = User.builder().id(3L).email("staff@example.com").fullName("Support Staff").build();

        lenient().when(auth.getName()).thenReturn(tourist.getEmail());
    }

    private SupportTicket ticketRaisedBy(User raiser, Long id) {
        return SupportTicket.builder()
                .id(id)
                .raisedBy(raiser)
                .type(TicketType.COMPLAINT)
                .subject("Guide arrived late")
                .message("Our guide showed up almost an hour late.")
                .status(TicketStatus.OPEN)
                .build();
    }

    @Test
    void create_savesTicketOwnedByLoggedInTourist() {
        when(userRepository.findByEmail(tourist.getEmail())).thenReturn(Optional.of(tourist));
        when(repository.save(any(SupportTicket.class))).thenAnswer(inv -> {
            SupportTicket saved = inv.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        SupportTicketCreateRequest req = new SupportTicketCreateRequest();
        req.setType(TicketType.COMPLAINT);
        req.setSubject("Guide arrived late");
        req.setMessage("Our guide showed up almost an hour late.");

        SupportTicketResponse response = service.create(req, auth);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getStatus()).isEqualTo("OPEN");
        assertThat(response.getRaisedById()).isEqualTo(tourist.getId());

        ArgumentCaptor<SupportTicket> captor = ArgumentCaptor.forClass(SupportTicket.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getRaisedBy()).isEqualTo(tourist);
    }

    @Test
    void getMy_returnsOnlyTicketsRaisedByAuthenticatedTourist() {
        when(userRepository.findByEmail(tourist.getEmail())).thenReturn(Optional.of(tourist));
        SupportTicket t1 = ticketRaisedBy(tourist, 1L);
        SupportTicket t2 = ticketRaisedBy(tourist, 2L);
        when(repository.findByRaisedById(tourist.getId())).thenReturn(List.of(t1, t2));

        List<SupportTicketResponse> results = service.getMy(auth);

        assertThat(results).hasSize(2);
        assertThat(results).extracting(SupportTicketResponse::getId).containsExactly(1L, 2L);
    }

    @Test
    void getById_throwsResourceNotFoundException_whenTicketDoesNotExist() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(99L, auth))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getById_throwsAccessDeniedException_whenTicketBelongsToAnotherTourist() {
        SupportTicket ticket = ticketRaisedBy(otherTourist, 5L);
        when(repository.findById(5L)).thenReturn(Optional.of(ticket));

        assertThatThrownBy(() -> service.getById(5L, auth))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void getById_allowsStaffToViewAnyTicket() {
        SupportTicket ticket = ticketRaisedBy(otherTourist, 5L);
        when(repository.findById(5L)).thenReturn(Optional.of(ticket));
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_STAFF"))).when(auth).getAuthorities();

        SupportTicketResponse response = service.getById(5L, auth);

        assertThat(response.getId()).isEqualTo(5L);
    }

    @Test
    void updateStatus_assignsHandledByOnFirstStatusChange() {
        SupportTicket ticket = ticketRaisedBy(tourist, 7L);
        when(repository.findById(7L)).thenReturn(Optional.of(ticket));
        when(userRepository.findByEmail(staff.getEmail())).thenReturn(Optional.of(staff));
        when(repository.save(any(SupportTicket.class))).thenAnswer(inv -> inv.getArgument(0));
        when(auth.getName()).thenReturn(staff.getEmail());

        TicketStatusUpdateRequest req = new TicketStatusUpdateRequest();
        req.setStatus(TicketStatus.IN_PROGRESS);

        SupportTicketResponse response = service.updateStatus(7L, req, auth);

        assertThat(response.getStatus()).isEqualTo("IN_PROGRESS");
        assertThat(response.getHandledById()).isEqualTo(staff.getId());
        assertThat(response.getResolvedAt()).isNull();
    }

    @Test
    void updateStatus_stampsResolvedAt_whenMovedToResolved() {
        SupportTicket ticket = ticketRaisedBy(tourist, 8L);
        ticket.setHandledBy(staff);
        when(repository.findById(8L)).thenReturn(Optional.of(ticket));
        when(repository.save(any(SupportTicket.class))).thenAnswer(inv -> inv.getArgument(0));

        TicketStatusUpdateRequest req = new TicketStatusUpdateRequest();
        req.setStatus(TicketStatus.RESOLVED);

        SupportTicketResponse response = service.updateStatus(8L, req, auth);

        assertThat(response.getStatus()).isEqualTo("RESOLVED");
        assertThat(response.getResolvedAt()).isNotNull();
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void getAll_returnsAllTickets_whenNoStatusFilterGiven() {
        when(repository.findAll()).thenReturn(List.of(ticketRaisedBy(tourist, 1L), ticketRaisedBy(otherTourist, 2L)));

        List<SupportTicketResponse> results = service.getAll(null);

        assertThat(results).hasSize(2);
        verify(repository).findAll();
        verify(repository, never()).findByStatus(any());
    }

    @Test
    void getAll_filtersByStatus_whenProvided() {
        when(repository.findByStatus(TicketStatus.OPEN)).thenReturn(List.of(ticketRaisedBy(tourist, 1L)));

        List<SupportTicketResponse> results = service.getAll(TicketStatus.OPEN);

        assertThat(results).hasSize(1);
        verify(repository).findByStatus(TicketStatus.OPEN);
        verify(repository, never()).findAll();
    }

    @Test
    void getMy_returnsEmptyList_whenTouristHasNoTickets() {
        when(userRepository.findByEmail(tourist.getEmail())).thenReturn(Optional.of(tourist));
        when(repository.findByRaisedById(tourist.getId())).thenReturn(List.of());

        List<SupportTicketResponse> results = service.getMy(auth);

        assertThat(results).isEmpty();
    }

    @Test
    void updateStatus_keepsExistingHandledBy_whenAlreadyAssigned() {
        SupportTicket ticket = ticketRaisedBy(tourist, 11L);
        ticket.setHandledBy(staff);
        when(repository.findById(11L)).thenReturn(Optional.of(ticket));
        when(repository.save(any(SupportTicket.class))).thenAnswer(inv -> inv.getArgument(0));

        TicketStatusUpdateRequest req = new TicketStatusUpdateRequest();
        req.setStatus(TicketStatus.IN_PROGRESS);

        SupportTicketResponse response = service.updateStatus(11L, req, auth);

        assertThat(response.getHandledById()).isEqualTo(staff.getId());
    }

    @Test
    void getById_returns200WhenOwnedByCaller() {
        SupportTicket ticket = ticketRaisedBy(tourist, 12L);
        when(repository.findById(12L)).thenReturn(Optional.of(ticket));

        SupportTicketResponse response = service.getById(12L, auth);

        assertThat(response.getId()).isEqualTo(12L);
    }

    @Test
    void updateStatus_toClosed_alsoStampsResolvedAt() {
        SupportTicket ticket = ticketRaisedBy(tourist, 13L);
        ticket.setHandledBy(staff);
        when(repository.findById(13L)).thenReturn(Optional.of(ticket));
        when(repository.save(any(SupportTicket.class))).thenAnswer(inv -> inv.getArgument(0));

        TicketStatusUpdateRequest req = new TicketStatusUpdateRequest();
        req.setStatus(TicketStatus.CLOSED);

        SupportTicketResponse response = service.updateStatus(13L, req, auth);

        assertThat(response.getStatus()).isEqualTo("CLOSED");
        assertThat(response.getResolvedAt()).isNotNull();
    }

    @Test
    void getAll_returnsEmptyList_whenNoTicketsExist() {
        when(repository.findAll()).thenReturn(List.of());

        List<SupportTicketResponse> results = service.getAll(null);

        assertThat(results).isEmpty();
    }

    @Test
    void getById_returns200ForAdminRole() {
        SupportTicket ticket = ticketRaisedBy(otherTourist, 14L);
        when(repository.findById(14L)).thenReturn(Optional.of(ticket));
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))).when(auth).getAuthorities();

        SupportTicketResponse response = service.getById(14L, auth);

        assertThat(response.getId()).isEqualTo(14L);
    }

    @Test
    void create_savesMessageAndSubjectExactlyAsProvided() {
        when(userRepository.findByEmail(tourist.getEmail())).thenReturn(Optional.of(tourist));
        when(repository.save(any(SupportTicket.class))).thenAnswer(inv -> {
            SupportTicket saved = inv.getArgument(0);
            saved.setId(20L);
            return saved;
        });

        SupportTicketCreateRequest req = new SupportTicketCreateRequest();
        req.setType(TicketType.RESCHEDULE_REQUEST);
        req.setSubject("Need to reschedule Kandy trip");
        req.setMessage("Please move our booking to next weekend.");

        SupportTicketResponse response = service.create(req, auth);

        assertThat(response.getType()).isEqualTo("RESCHEDULE_REQUEST");
        assertThat(response.getSubject()).isEqualTo("Need to reschedule Kandy trip");
        assertThat(response.getMessage()).isEqualTo("Please move our booking to next weekend.");
    }

    @Test
    void getMy_returnsResponsesWithRaisedByNamePopulated() {
        when(userRepository.findByEmail(tourist.getEmail())).thenReturn(Optional.of(tourist));
        when(repository.findByRaisedById(tourist.getId())).thenReturn(List.of(ticketRaisedBy(tourist, 1L)));

        List<SupportTicketResponse> results = service.getMy(auth);

        assertThat(results.get(0).getRaisedByName()).isEqualTo(tourist.getFullName());
    }
}
