package com.handyserve.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(customer|provider|admin)$", message = "Role must be customer, provider, or admin")
    private String role;

    private String avatar;

    // Optional initial location details
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

    // Optional provider details
    private String serviceType;
    private String experience;
    private String timing;
    private Integer radius;
    private String pricing;

    // Optional bank/verification details
    private String idType;
    private String idNumber;
    private String upi;
    private String bankName;
    private String accountHolder;
    private String gender;
    private Integer age;
}
