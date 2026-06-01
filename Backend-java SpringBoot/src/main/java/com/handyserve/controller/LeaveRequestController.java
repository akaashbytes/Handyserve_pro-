package com.handyserve.controller;

import com.handyserve.dto.LeaveRequestDto;
import com.handyserve.service.LeaveRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDto> createLeaveRequest(
            @RequestBody LeaveRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            LeaveRequestDto created = leaveRequestService.createLeaveRequest(dto, userDetails.getUsername());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getLeaveRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            List<LeaveRequestDto> list = leaveRequestService.getLeaveRequests(userDetails.getUsername());
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            LeaveRequestDto updated = leaveRequestService.updateLeaveStatus(id, status, userDetails.getUsername());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            // Return conflict/error message in body so the frontend can display it
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
