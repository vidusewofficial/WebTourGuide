package com.webtourguide.guideapplication.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

/** Optional request body ADMIN/STAFF sends when rejecting an application. */
@Data
public class GuideApplicationRejectRequest {

    @Size(max = 500, message = "reviewNote must not exceed 500 characters")
    private String reviewNote;
}
