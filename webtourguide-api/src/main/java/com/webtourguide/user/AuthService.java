package com.webtourguide.user;

import com.webtourguide.security.JwtUtil;
import com.webtourguide.user.dto.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalStateException(
                    "Email already registered"
            );
        }

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .password(
                        passwordEncoder.encode(req.getPassword())
                )
                .phone(req.getPhone())
                .role(Role.TOURIST)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getFullName(),
                user.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest req) {

        User user = userRepository
                .findByEmail(req.getEmail())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Invalid credentials"
                        )
                );

        if (!passwordEncoder.matches(
                req.getPassword(),
                user.getPassword())) {

            throw new IllegalStateException(
                    "Invalid credentials"
            );
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getFullName(),
                user.getRole().name()
        );
    }
}