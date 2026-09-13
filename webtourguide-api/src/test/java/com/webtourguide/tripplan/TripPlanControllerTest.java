package com.webtourguide.tripplan;

import com.webtourguide.config.SecurityConfig;
import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.security.CustomUserDetailsService;
import com.webtourguide.security.JwtUtil;
import com.webtourguide.tripplan.dto.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration (web-slice) tests for TripPlanController.
 *
 * Uses @WebMvcTest with the real SecurityConfig imported so @PreAuthorize
 * role checks are actually enforced, but mocks TripPlanService so no
 * database is required. JwtUtil/CustomUserDetailsService are mocked only
 * to satisfy JwtAuthFilter's constructor — requests in these tests never
 * send an Authorization header, so the real JwtAuthFilter simply no-ops
 * and lets @WithMockUser's security context flow through untouched.
 */
@WebMvcTest(TripPlanController.class)
@Import(SecurityConfig.class)
class TripPlanControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockitoBean private TripPlanService service;
    @MockitoBean private JwtUtil jwtUtil;
    @MockitoBean private CustomUserDetailsService userDetailsService;

    private TripPlanResponse sampleResponse(Long id) {
        return TripPlanResponse.builder()
                .id(id)
                .touristId(3L)
                .title("South Coast Getaway")
                .startDate(LocalDate.of(2026, 11, 10))
                .endDate(LocalDate.of(2026, 11, 13))
                .items(List.of(
                        TripPlanItemResponse.builder()
                                .id(1L)
                                .destinationId(1L)
                                .destinationName("Sigiriya Rock Fortress")
                                .dayNumber(1)
                                .build()
                ))
                .build();
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void create_returns200WithValidTouristRole() throws Exception {
        when(service.create(any(TripPlanCreateRequest.class), any())).thenReturn(sampleResponse(1L));

        mockMvc.perform(post("/api/trip-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"South Coast Getaway\",\"startDate\":\"2026-11-10\",\"endDate\":\"2026-11-13\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("South Coast Getaway"));
    }

    @Test
    void create_returns403WithoutAuthentication() throws Exception {
        mockMvc.perform(post("/api/trip-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"South Coast Getaway\"}"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void create_returns403ForAdminRole() throws Exception {
        mockMvc.perform(post("/api/trip-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"South Coast Getaway\"}"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "staff@example.com", roles = "STAFF")
    void create_returns403ForStaffRole() throws Exception {
        mockMvc.perform(post("/api/trip-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"South Coast Getaway\"}"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void getMy_returns200WithListOfPlans() throws Exception {
        when(service.getMy(any())).thenReturn(List.of(sampleResponse(1L), sampleResponse(2L)));

        mockMvc.perform(get("/api/trip-plans/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void getById_returns200WhenOwnedByCaller() throws Exception {
        when(service.getById(eq(1L), any())).thenReturn(sampleResponse(1L));

        mockMvc.perform(get("/api/trip-plans/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void getById_returns403WhenOwnedByAnotherTourist() throws Exception {
        when(service.getById(eq(2L), any()))
                .thenThrow(new AccessDeniedException("You can only manage your own trip plans"));

        mockMvc.perform(get("/api/trip-plans/2"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void getById_returns404WhenPlanDoesNotExist() throws Exception {
        when(service.getById(eq(99L), any()))
                .thenThrow(new ResourceNotFoundException("Trip plan 99 not found"));

        mockMvc.perform(get("/api/trip-plans/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void update_updatesItemsAndReturnsNewList() throws Exception {
        when(service.update(eq(1L), any(TripPlanUpdateRequest.class), any())).thenReturn(sampleResponse(1L));

        String body = "{\"title\":\"South Coast Getaway\",\"items\":["
                + "{\"destinationId\":1,\"dayNumber\":1,\"accommodation\":\"Sigiriya Village Hotel\"}"
                + "]}";

        mockMvc.perform(put("/api/trip-plans/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.items[0].destinationName").value("Sigiriya Rock Fortress"));
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void update_returns400WhenItemMissingDayNumber() throws Exception {
        String body = "{\"title\":\"South Coast Getaway\",\"items\":["
                + "{\"destinationId\":1,\"accommodation\":\"Sigiriya Village Hotel\"}"
                + "]}";

        mockMvc.perform(put("/api/trip-plans/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(service);
    }

    @Test
    @WithMockUser(username = "tourist@example.com", roles = "TOURIST")
    void delete_returns204AndRemovesPlan() throws Exception {
        mockMvc.perform(delete("/api/trip-plans/1"))
                .andExpect(status().isNoContent());

        verify(service).delete(eq(1L), any());
    }
}
