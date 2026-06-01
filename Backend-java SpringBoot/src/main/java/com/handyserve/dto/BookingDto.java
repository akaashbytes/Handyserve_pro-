package com.handyserve.dto;

import com.handyserve.entity.Booking;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingDto {
    private Long id;
    private String service;
    private String status;
    private String date;
    private String time;
    private Double amount;
    private String options;
    private Integer rating;
    private String invoiceId;

    // Customer info
    private Long customerId;
    private String customerName;
    private String customerCity;
    private Double customerLatitude;
    private Double customerLongitude;
    private String customerAddress;
    private String customerDirectionsUrl;
    private String navigationToCustomerUrl;

    // Provider info
    private Long serviceProviderId; // frontend uses serviceProviderId
    private String providerName;
    private String providerCity;
    private Double providerLatitude;
    private Double providerLongitude;

    // Payment info
    private String paymentMethod;
    private String paymentId;
    private LocalDateTime paidAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookingDto fromEntity(Booking booking) {
        if (booking == null) return null;
        return BookingDto.builder()
                .id(booking.getId())
                .service(booking.getService())
                .status(booking.getStatus().name())
                .date(booking.getDate())
                .time(booking.getTime())
                .amount(booking.getAmount())
                .options(booking.getOptions())
                .rating(booking.getRating())
                .invoiceId(booking.getInvoiceId())
                .customerId(booking.getCustomer() != null ? booking.getCustomer().getId() : null)
                .customerName(booking.getCustomerName())
                .customerCity(booking.getCustomerCity())
                .customerLatitude(booking.getCustomerLatitude())
                .customerLongitude(booking.getCustomerLongitude())
                .customerAddress(booking.getCustomerAddress())
                .customerDirectionsUrl(booking.getCustomerDirectionsUrl())
                .navigationToCustomerUrl(booking.getNavigationToCustomerUrl())
                .serviceProviderId(booking.getProvider() != null ? booking.getProvider().getId() : null)
                .providerName(booking.getProviderName())
                .providerCity(booking.getProviderCity())
                .providerLatitude(booking.getProviderLatitude())
                .providerLongitude(booking.getProviderLongitude())
                .paymentMethod(booking.getPaymentMethod())
                .paymentId(booking.getPaymentId())
                .paidAt(booking.getPaidAt())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
