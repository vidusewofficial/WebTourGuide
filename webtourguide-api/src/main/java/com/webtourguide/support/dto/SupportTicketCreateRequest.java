package com.webtourguide.support.dto;

import com.webtourguide.support.TicketType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupportTicketCreateRequest {
    @NotNull private TicketType type;
    @NotBlank @Size(max = 200) private String subject;
    @NotBlank private String message;
}
