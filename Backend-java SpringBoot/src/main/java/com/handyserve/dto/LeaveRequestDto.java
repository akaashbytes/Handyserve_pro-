package com.handyserve.dto;

import com.handyserve.entity.LeaveRequest;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveRequestDto {
    private Long id;
    private Long providerId;
    private String providerName;
    private String skill;
    private String date;
    private List<String> timeSlots;
    private String reason;
    private String status;
    private LocalDateTime createdAt;

    public static LeaveRequestDto fromEntity(LeaveRequest leave) {
        if (leave == null) return null;
        return LeaveRequestDto.builder()
                .id(leave.getId())
                .providerId(leave.getProvider() != null ? leave.getProvider().getId() : null)
                .providerName(leave.getProviderName())
                .skill(leave.getSkill())
                .date(leave.getDate())
                .timeSlots(leave.getTimeSlotsAsList())
                .reason(leave.getReason())
                .status(leave.getStatus().name())
                .createdAt(leave.getCreatedAt())
                .build();
    }
}
