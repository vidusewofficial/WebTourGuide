package com.webtourguide.user.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private Long id;

    private String fullName;

    private String email;

    private String role;
}