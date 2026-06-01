package com.handyserve.controller;

import com.handyserve.dto.UserDto;
import com.handyserve.entity.User;
import com.handyserve.repository.oracle.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final UserRepository userRepository;

    public ProviderController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> listProviders(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String serviceType,
            @RequestParam(required = false) String search) {

        List<User> providers = userRepository.searchProviders(
                User.Role.provider,
                city,
                serviceType,
                search
        );

        List<UserDto> dtos = providers.stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getProvider(@PathVariable Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == User.Role.provider)
                .map(UserDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<UserDto>> getNearbyProviders(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "10.0") Double radius) {

        List<User> providers = userRepository.findByRoleAndBlockedFalse(User.Role.provider);

        List<UserDto> nearby = providers.stream()
                .filter(u -> u.getLatitude() != null && u.getLongitude() != null)
                .filter(u -> haversineDistanceKm(lat, lon, u.getLatitude(), u.getLongitude()) <= radius)
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(nearby);
    }

    @PatchMapping("/{id}/block")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<UserDto> blockProvider(@PathVariable Long id, @RequestParam Boolean blocked) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == User.Role.provider)
                .map(u -> {
                    u.setBlocked(blocked);
                    userRepository.save(u);
                    return ResponseEntity.ok(UserDto.fromEntity(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<UserDto> updateAvailability(@PathVariable Long id, @RequestParam Boolean available) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == User.Role.provider)
                .map(u -> {
                    u.setAvailable(available);
                    userRepository.save(u);
                    return ResponseEntity.ok(UserDto.fromEntity(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private double haversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double r = 6371.0; // Earth's radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return r * c;
    }
}
