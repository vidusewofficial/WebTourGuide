package com.webtourguide.user.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private String fullName;

    private String role;
}