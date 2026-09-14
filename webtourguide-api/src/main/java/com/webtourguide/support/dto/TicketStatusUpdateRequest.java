package com.webtourguide.support.dto;

import com.webtourguide.support.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    @NotNull private TicketStatus status;
}
