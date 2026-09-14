package com.webtourguide.support.dto;

import com.webtourguide.support.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** Request body staff or admin send to move a ticket to a new status. */
@Data
public class TicketStatusUpdateRequest {
    @NotNull private TicketStatus status;
}
