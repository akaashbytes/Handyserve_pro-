package com.handyserve.controller;

import com.handyserve.dto.PromoCodeDto;
import com.handyserve.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/promo/{code}")
    public ResponseEntity<PromoCodeDto> validatePromo(@PathVariable String code) {
        try {
            PromoCodeDto promo = paymentService.validatePromo(code);
            return ResponseEntity.ok(promo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiatePayment(
            @RequestParam(required = false) Long bookingId,
            @RequestBody(required = false) Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Long finalBookingId = bookingId;
        if (finalBookingId == null && body != null && body.containsKey("bookingId")) {
            finalBookingId = Long.valueOf(body.get("bookingId").toString());
        }

        if (finalBookingId == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Map<String, Object> details = paymentService.initiatePayment(finalBookingId, userDetails.getUsername());
            return ResponseEntity.ok(details);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestParam(required = false) Long bookingId,
            @RequestParam(required = false) String paymentId,
            @RequestParam(required = false) String signature,
            @RequestBody(required = false) Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Long finalBookingId = bookingId;
        String finalPaymentId = paymentId;
        String finalSignature = signature;

        if (body != null) {
            if (finalBookingId == null && body.containsKey("bookingId")) {
                finalBookingId = Long.valueOf(body.get("bookingId").toString());
            }
            if (finalPaymentId == null && body.containsKey("paymentId")) {
                finalPaymentId = body.get("paymentId").toString();
            }
            if (finalSignature == null && body.containsKey("signature")) {
                finalSignature = body.get("signature").toString();
            }
        }

        if (finalBookingId == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Map<String, Object> result = paymentService.verifyPayment(
                    finalBookingId,
                    finalPaymentId != null ? finalPaymentId : "mock_pay_id",
                    finalSignature != null ? finalSignature : "mock_sig",
                    userDetails.getUsername()
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
