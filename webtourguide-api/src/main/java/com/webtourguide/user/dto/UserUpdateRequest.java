package com.webtourguide.user.dto;

import com.webtourguide.user.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Request body used by ADMIN to edit another user's account details, including role.
 */
@Data
public class UserUpdateRequest {

    @NotBlank(message = "fullName is required")
    private String fullName;

    @Email(message = "email must be valid")
    @NotBlank(message = "email is required")
    private String email;

    private String phone;

    @NotNull(message = "role is required")
    private Role role;
}
