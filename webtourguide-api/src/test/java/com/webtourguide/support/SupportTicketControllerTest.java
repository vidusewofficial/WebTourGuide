package com.webtourguide.support;

import com.webtourguide.config.SecurityConfig;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.security.CustomUserDetailsService;
import com.webtourguide.security.JwtUtil;
import com.webtourguide.support.dto.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SupportTicketController.class)
@Import(SecurityConfig.class)
class SupportTicketControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockitoBean private SupportTicketService service;
    @MockitoBean private JwtUtil jwtUtil;
    @MockitoBean private CustomUserDetailsService userDetailsService;

    private SupportTicketResponse sampleResponse(Long id) {
        return SupportTicketResponse.builder()
                .id(id)
                .raisedById(1L)
                .raisedByName("Tourist One")
                .type("COMPLAINT")
                .subject("Guide arrived late")
                .message("Our guide showed up almost an hour late.")
                .status("OPEN")
                .build();
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void create_returns200WithValidTouristRole() throws Exception {
        when(service.create(any(SupportTicketCreateRequest.class), any())).thenReturn(sampleResponse(1L));

        mockMvc.perform(post("/api/support/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"COMPLAINT\",\"subject\":\"Guide arrived late\",\"message\":\"Our guide showed up almost an hour late.\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void create_returns403WithoutAuthentication() throws Exception {
        mockMvc.perform(post("/api/support/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"COMPLAINT\",\"subject\":\"Guide arrived late\",\"message\":\"details\"}"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "staff@example.com", roles = "STAFF")
    void create_returns403ForStaffRole() throws Exception {
        mockMvc.perform(post("/api/support/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"COMPLAINT\",\"subject\":\"Guide arrived late\",\"message\":\"details\"}"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void getMy_returns200WithListOfTickets() throws Exception {
        when(service.getMy(any())).thenReturn(List.of(sampleResponse(1L), sampleResponse(2L)));

        mockMvc.perform(get("/api/support/tickets/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void getById_returns403WhenOwnedByAnotherTourist() throws Exception {
        when(service.getById(eq(2L), any()))
                .thenThrow(new AccessDeniedException("You can only view your own support tickets"));

        mockMvc.perform(get("/api/support/tickets/2"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void getById_returns404WhenTicketDoesNotExist() throws Exception {
        when(service.getById(eq(99L), any()))
                .thenThrow(new ResourceNotFoundException("Support ticket 99 not found"));

        mockMvc.perform(get("/api/support/tickets/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void getAll_returns403ForTouristRole() throws Exception {
        mockMvc.perform(get("/api/support/tickets"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "staff@example.com", roles = "STAFF")
    void getAll_returns200ForStaffRole() throws Exception {
        when(service.getAll(any())).thenReturn(List.of(sampleResponse(1L)));

        mockMvc.perform(get("/api/support/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(username = "staff@example.com", roles = "STAFF")
    void updateStatus_returns200ForStaffRole() throws Exception {
        SupportTicketResponse updated = sampleResponse(1L);
        updated.setStatus("IN_PROGRESS");
        when(service.updateStatus(eq(1L), any(TicketStatusUpdateRequest.class), any())).thenReturn(updated);

        mockMvc.perform(patch("/api/support/tickets/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void updateStatus_returns403ForTouristRole() throws Exception {
        mockMvc.perform(patch("/api/support/tickets/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void updateStatus_returns200ForAdminRole() throws Exception {
        SupportTicketResponse updated = sampleResponse(1L);
        updated.setStatus("RESOLVED");
        when(service.updateStatus(eq(1L), any(TicketStatusUpdateRequest.class), any())).thenReturn(updated);

        mockMvc.perform(patch("/api/support/tickets/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"RESOLVED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"));
    }

    @Test
    @WithMockUser(username = "staff@example.com", roles = "STAFF")
    void updateStatus_returns404WhenTicketDoesNotExist() throws Exception {
        when(service.updateStatus(eq(99L), any(TicketStatusUpdateRequest.class), any()))
                .thenThrow(new ResourceNotFoundException("Support ticket 99 not found"));

        mockMvc.perform(patch("/api/support/tickets/99/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"RESOLVED\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getMy_returns403WithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/support/tickets/my"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "staff@example.com", roles = "STAFF")
    void getById_returns200ForStaffViewingAnyTicket() throws Exception {
        when(service.getById(eq(3L), any())).thenReturn(sampleResponse(3L));

        mockMvc.perform(get("/api/support/tickets/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3));
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void create_returns400WhenSubjectIsBlank() throws Exception {
        mockMvc.perform(post("/api/support/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"COMPLAINT\",\"subject\":\"\",\"message\":\"details\"}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(service);
    }
}
