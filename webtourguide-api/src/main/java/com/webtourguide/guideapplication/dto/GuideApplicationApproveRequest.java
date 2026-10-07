package com.webtourguide.guideapplication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/** Request body ADMIN sends to approve an application and set the new guide's login password. */
@Data
public class GuideApplicationApproveRequest {

    @NotBlank(message = "password is required")
    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;
}
