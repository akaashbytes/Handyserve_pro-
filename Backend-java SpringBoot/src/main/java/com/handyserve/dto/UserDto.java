package com.handyserve.dto;

import com.handyserve.entity.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String avatar;
    private Boolean verified;
    private Boolean blocked;

    private String state;
    private String city;
    private String serviceCity;
    private Boolean serviceCityActive;
    private String location;
    private String displayAddress;
    private String address;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String detectedCityLabel;

    // Provider fields
    private String serviceType;
    private String experience;
    private String timing;
    private Integer radius;
    private String pricing;
    private Integer reliabilityScore;
    private Integer lowScoreDays;
    private Boolean available;

    // Provider bank/identity details
    private String idType;
    private String idNumber;
    private String upi;
    private String bankName;
    private String accountHolder;
    private String gender;
    private Integer age;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .avatar(user.getAvatar())
                .verified(user.getVerified())
                .blocked(user.getBlocked())
                .state(user.getState())
                .city(user.getCity())
                .serviceCity(user.getServiceCity())
                .serviceCityActive(user.getServiceCityActive())
                .location(user.getLocation())
                .displayAddress(user.getDisplayAddress())
                .address(user.getAddress())
                .pincode(user.getPincode())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .detectedCityLabel(user.getDetectedCityLabel())
                .serviceType(user.getServiceType())
                .experience(user.getExperience())
                .timing(user.getTiming())
                .radius(user.getRadius())
                .pricing(user.getPricing())
                .reliabilityScore(user.getReliabilityScore())
                .lowScoreDays(user.getLowScoreDays())
                .available(user.getAvailable())
                .idType(user.getIdType())
                .idNumber(user.getIdNumber())
                .upi(user.getUpi())
                .bankName(user.getBankName())
                .accountHolder(user.getAccountHolder())
                .gender(user.getGender())
                .age(user.getAge())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
