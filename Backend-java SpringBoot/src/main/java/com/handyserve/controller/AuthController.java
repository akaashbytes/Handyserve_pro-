package com.handyserve.controller;

import com.handyserve.dto.AuthResponse;
import com.handyserve.dto.LoginRequest;
import com.handyserve.dto.RegisterRequest;
import com.handyserve.dto.UserDto;
import com.handyserve.service.UserService;
import com.handyserve.repository.oracle.UserRepository;
import com.handyserve.entity.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/public-stats")
    public ResponseEntity<?> getPublicStats() {
        long customers = userRepository.countByRoleAndBlockedFalse(User.Role.customer);
        long providers = userRepository.countByRoleAndVerifiedTrueAndBlockedFalse(User.Role.provider);
        long services = userRepository.countDistinctServiceTypes();
        
        long displayCustomers = Math.max(customers, 3);
        long displayProviders = Math.max(providers, 5);
        long displayServices = Math.max(services, 8);
        
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("customers", displayCustomers);
        stats.put("providers", displayProviders);
        stats.put("services", displayServices);
        stats.put("rating", 4.9);
        
        return ResponseEntity.ok(stats);
    }


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req, HttpServletResponse response) {
        AuthResponse authRes = userService.register(req);
        setRefreshTokenCookie(response, authRes.getUser().getEmail());
        return ResponseEntity.ok(authRes);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req, HttpServletResponse response) {
        AuthResponse authRes = userService.login(req);
        setRefreshTokenCookie(response, authRes.getUser().getEmail());
        return ResponseEntity.ok(authRes);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserDetails userDetails, HttpServletResponse response) {
        if (userDetails != null) {
            userService.logout(userDetails.getUsername());
        }
        
        // Clear HttpOnly refresh token cookie
        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false) // Set to true in production
                .path("/api/auth")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto userDto = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/select-role")
    public ResponseEntity<UserDto> selectRole(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String role) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto userDto = userService.selectRole(userDetails.getUsername(), role);
        return ResponseEntity.ok(userDto);
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserDto updatedData) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto userDto = userService.updateProfile(userDetails.getUsername(), updatedData);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            AuthResponse authRes = userService.refresh(refreshToken);
            return ResponseEntity.ok(authRes);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String email) {
        String refreshToken = userService.getRefreshToken(email);
        if (refreshToken == null) return;

        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(false) // Set to true in production
                .path("/api/auth")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
