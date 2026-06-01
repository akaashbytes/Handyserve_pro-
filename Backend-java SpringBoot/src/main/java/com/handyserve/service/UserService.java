package com.handyserve.service;

import com.handyserve.dto.AuthResponse;
import com.handyserve.dto.LoginRequest;
import com.handyserve.dto.RegisterRequest;
import com.handyserve.dto.UserDto;
import com.handyserve.entity.User;
import com.handyserve.repository.oracle.UserRepository;
import com.handyserve.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Handle Avatar defaults: capitalized initials of name
        String avatar = req.getAvatar();
        if (avatar == null || avatar.trim().isEmpty()) {
            avatar = extractInitials(req.getName());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.valueOf(req.getRole().toLowerCase()))
                .avatar(avatar)
                .verified(true) // defaults to true in current frontend logic
                .blocked(false)
                .state(req.getState() != null ? req.getState() : "Tamil Nadu")
                .city(req.getCity())
                .serviceCity(req.getServiceCity())
                .serviceCityActive(req.getServiceCityActive() != null ? req.getServiceCityActive() : true)
                .location(req.getLocation())
                .displayAddress(req.getDisplayAddress())
                .address(req.getAddress())
                .pincode(req.getPincode())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .detectedCityLabel(req.getDetectedCityLabel())
                .serviceType(req.getServiceType())
                .experience(req.getExperience())
                .timing(req.getTiming())
                .radius(req.getRadius())
                .pricing(req.getPricing())
                .reliabilityScore(90)
                .lowScoreDays(0)
                .available(true)
                .idType(req.getIdType())
                .idNumber(req.getIdNumber())
                .upi(req.getUpi())
                .bankName(req.getBankName())
                .accountHolder(req.getAccountHolder())
                .gender(req.getGender())
                .age(req.getAge())
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmailIgnoreCase(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.getBlocked()) {
            throw new RuntimeException("Your account has been blocked by the admin.");
        }

        String token = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional
    public void logout(String email) {
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            user.setRefreshToken(null);
            userRepository.save(user);
        });
    }

    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public String getRefreshToken(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .map(User::getRefreshToken)
                .orElse(null);
    }

    @Transactional
    public UserDto selectRole(String email, String roleStr) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User.Role role = User.Role.valueOf(roleStr.toLowerCase());
        user.setRole(role);
        user = userRepository.save(user);
        
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(String email, UserDto updatedData) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedData.getName() != null) user.setName(updatedData.getName());
        if (updatedData.getPhone() != null) user.setPhone(updatedData.getPhone());
        if (updatedData.getAvatar() != null) user.setAvatar(updatedData.getAvatar());
        if (updatedData.getState() != null) user.setState(updatedData.getState());
        if (updatedData.getCity() != null) user.setCity(updatedData.getCity());
        if (updatedData.getServiceCity() != null) user.setServiceCity(updatedData.getServiceCity());
        if (updatedData.getServiceCityActive() != null) user.setServiceCityActive(updatedData.getServiceCityActive());
        if (updatedData.getLocation() != null) user.setLocation(updatedData.getLocation());
        if (updatedData.getDisplayAddress() != null) user.setDisplayAddress(updatedData.getDisplayAddress());
        if (updatedData.getAddress() != null) user.setAddress(updatedData.getAddress());
        if (updatedData.getPincode() != null) user.setPincode(updatedData.getPincode());
        if (updatedData.getLatitude() != null) user.setLatitude(updatedData.getLatitude());
        if (updatedData.getLongitude() != null) user.setLongitude(updatedData.getLongitude());
        if (updatedData.getDetectedCityLabel() != null) user.setDetectedCityLabel(updatedData.getDetectedCityLabel());

        // Provider fields
        if (updatedData.getServiceType() != null) user.setServiceType(updatedData.getServiceType());
        if (updatedData.getExperience() != null) user.setExperience(updatedData.getExperience());
        if (updatedData.getTiming() != null) user.setTiming(updatedData.getTiming());
        if (updatedData.getRadius() != null) user.setRadius(updatedData.getRadius());
        if (updatedData.getPricing() != null) user.setPricing(updatedData.getPricing());
        if (updatedData.getAvailable() != null) user.setAvailable(updatedData.getAvailable());

        // Verification fields
        if (updatedData.getIdType() != null) user.setIdType(updatedData.getIdType());
        if (updatedData.getIdNumber() != null) user.setIdNumber(updatedData.getIdNumber());
        if (updatedData.getUpi() != null) user.setUpi(updatedData.getUpi());
        if (updatedData.getBankName() != null) user.setBankName(updatedData.getBankName());
        if (updatedData.getAccountHolder() != null) user.setAccountHolder(updatedData.getAccountHolder());
        if (updatedData.getGender() != null) user.setGender(updatedData.getGender());
        if (updatedData.getAge() != null) user.setAge(updatedData.getAge());

        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = jwtUtil.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            throw new RuntimeException("Revoked or invalid refresh token");
        }

        if (user.getBlocked()) {
            throw new RuntimeException("User is blocked");
        }

        String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        
        return AuthResponse.builder()
                .token(newAccessToken)
                .user(UserDto.fromEntity(user))
                .build();
    }

    private String extractInitials(String name) {
        if (name == null || name.trim().isEmpty()) return "U";
        String[] parts = name.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (!p.isEmpty()) sb.append(p.charAt(0));
        }
        String initials = sb.toString().toUpperCase();
        return initials.isEmpty() ? "U" : initials.substring(0, Math.min(initials.length(), 2));
    }
}
