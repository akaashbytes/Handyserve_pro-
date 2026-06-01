package com.handyserve.document;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Dispute is stored in MongoDB because it contains a variable-length
 * embedded updates[] timeline array that fits naturally in a document model.
 */
@Document(collection = "disputes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Dispute {

    @Id
    private String id;

    @Field("booking_id")
    private Long bookingId;              // references Oracle HS_BOOKINGS.id

    // ── Customer ──────────────────────────────────────────────────────────
    @Field("customer_id")
    private Long customerId;             // references Oracle HS_USERS.id
    private String customer;             // display name
    @Field("customer_email")
    private String customerEmail;

    // ── Provider ──────────────────────────────────────────────────────────
    @Field("service_provider_id")
    private Long serviceProviderId;      // references Oracle HS_USERS.id
    private String provider;
    @Field("provider_email")
    private String providerEmail;

    // ── Issue ─────────────────────────────────────────────────────────────
    private String issue;
    @Field("issue_category")
    @Builder.Default
    private String issueCategory = "General issue";

    @Builder.Default
    private String priority = "Medium";  // Low | Medium | High

    @Builder.Default
    private String source = "web";

    private Double amount;

    // ── Status ────────────────────────────────────────────────────────────
    @Builder.Default
    private String status = "Open";
    // Valid: Open | Pending | Pending Provider Reply | Refund Approved | Resolved | Rejected

    // ── Timeline ──────────────────────────────────────────────────────────
    @Builder.Default
    private List<UpdateEntry> updates = new ArrayList<>();

    private String date;                 // human-readable display date

    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;

    // ── Embedded update entry ─────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateEntry {
        private String id;
        private String actor;
        @Field("actor_role")
        private String actorRole;
        private String note;
        private String at;               // human-readable timestamp
    }
}
