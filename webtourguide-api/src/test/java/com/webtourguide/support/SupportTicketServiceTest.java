package com.webtourguide.support;

import com.webtourguide.booking.Booking;
import com.webtourguide.booking.BookingRepository;
import com.webtourguide.booking.BookingService;
import com.webtourguide.booking.BookingStatus;
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
}
