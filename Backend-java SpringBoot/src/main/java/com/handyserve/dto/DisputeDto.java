package com.handyserve.dto;

import com.handyserve.document.Dispute;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisputeDto {
    private String id;
    private Long bookingId;
    private Long customerId;
    private String customer;
    private String customerEmail;
    private Long serviceProviderId;
    private String provider;
    private String providerEmail;
    private String issue;
    private String issueCategory;
    private String priority;
    private String source;
    private Double amount;
    private String status;
    private String date;
    private LocalDateTime createdAt;

    @Builder.Default
    private List<UpdateEntryDto> updates = new ArrayList<>();

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateEntryDto {
        private String id;
        private String actor;
        private String actorRole;
        private String note;
        private String at;
    }

    public static DisputeDto fromDocument(Dispute dispute) {
        if (dispute == null) return null;
        
        List<UpdateEntryDto> updatesList = dispute.getUpdates() == null ? new ArrayList<>() :
                dispute.getUpdates().stream()
                        .map(u -> UpdateEntryDto.builder()
                                .id(u.getId())
                                .actor(u.getActor())
                                .actorRole(u.getActorRole())
                                .note(u.getNote())
                                .at(u.getAt())
                                .build())
                        .collect(Collectors.toList());

        return DisputeDto.builder()
                .id(dispute.getId())
                .bookingId(dispute.getBookingId())
                .customerId(dispute.getCustomerId())
                .customer(dispute.getCustomer())
                .customerEmail(dispute.getCustomerEmail())
                .serviceProviderId(dispute.getServiceProviderId())
                .provider(dispute.getProvider())
                .providerEmail(dispute.getProviderEmail())
                .issue(dispute.getIssue())
                .issueCategory(dispute.getIssueCategory())
                .priority(dispute.getPriority())
                .source(dispute.getSource())
                .amount(dispute.getAmount())
                .status(dispute.getStatus())
                .date(dispute.getDate())
                .createdAt(dispute.getCreatedAt())
                .updates(updatesList)
                .build();
    }
}
