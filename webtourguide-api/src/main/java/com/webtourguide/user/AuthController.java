package com.webtourguide.user;

import com.webtourguide.user.dto.*;

import jakarta.validation.Valid;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest req) {

        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest req) {

        return authService.login(req);
    }

    /**
     * Temporary dev endpoint: rehashes all users whose password_hash
     * looks like plain text (i.e. does NOT start with "$2a$").
     * Call once, then you can remove this endpoint.
     */
    @PostMapping("/fix-passwords")
    public String fixPlainTextPasswords() {
        var users = userRepository.findAll();
        int fixed = 0;
        for (var user : users) {
            String pw = user.getPassword();
            if (pw != null && !pw.startsWith("$2a$") && !pw.startsWith("$2b$")) {
                user.setPassword(passwordEncoder.encode(pw));
                userRepository.save(user);
                fixed++;
            }
        }
        return "Fixed " + fixed + " user(s).";
    }
}