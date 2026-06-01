package com.handyserve.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "HS_USERS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "HS_USER_SEQ", allocationSize = 1)
    private Long id;

    // ── Core ────────────────────────────────────────────────────────────────
    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(length = 10)
    private String avatar;

    @Builder.Default
    private Boolean verified = false;

    @Builder.Default
    private Boolean blocked = false;

    // ── Location ────────────────────────────────────────────────────────────
    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String city;

    @Column(name = "SERVICE_CITY", length = 100)
    private String serviceCity;

    @Column(name = "SERVICE_CITY_ACTIVE")
    @Builder.Default
    private Boolean serviceCityActive = true;

    @Column(length = 200)
    private String location;

    @Column(name = "DISPLAY_ADDRESS", length = 500)
    private String displayAddress;

    @Column(length = 300)
    private String address;

    @Column(length = 10)
    private String pincode;

    private Double latitude;
    private Double longitude;

    @Column(name = "DETECTED_CITY_LABEL", length = 100)
    private String detectedCityLabel;

    // ── Provider-only ────────────────────────────────────────────────────────
    @Column(name = "SERVICE_TYPE", length = 100)
    private String serviceType;

    @Column(length = 50)
    private String experience;

    @Column(length = 50)
    private String timing;

    private Integer radius;

    @Column(length = 50)
    private String pricing;

    @Column(name = "RELIABILITY_SCORE")
    @Builder.Default
    private Integer reliabilityScore = 90;

    @Column(name = "LOW_SCORE_DAYS")
    @Builder.Default
    private Integer lowScoreDays = 0;

    @Builder.Default
    private Boolean available = true;

    // ── Provider verification ────────────────────────────────────────────────
    @Column(name = "ID_TYPE", length = 50)
    private String idType;

    @Column(name = "ID_NUMBER", length = 50)
    private String idNumber;

    @Column(length = 100)
    private String upi;

    @Column(name = "BANK_NAME", length = 100)
    private String bankName;

    @Column(name = "ACCOUNT_HOLDER", length = 100)
    private String accountHolder;

    @Column(length = 20)
    private String gender;

    private Integer age;

    // ── Refresh token (hashed) ───────────────────────────────────────────────
    @Column(name = "REFRESH_TOKEN", length = 512)
    private String refreshToken;

    // ── Audit ────────────────────────────────────────────────────────────────
    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    // ── Enums ────────────────────────────────────────────────────────────────
    public enum Role { customer, provider, admin }
}
