package com.handyserve.service;

import com.handyserve.dto.PromoCodeDto;
import com.handyserve.entity.Booking;
import com.handyserve.entity.PromoCode;
import com.handyserve.entity.User;
import com.handyserve.repository.oracle.BookingRepository;
import com.handyserve.repository.oracle.PromoCodeRepository;
import com.handyserve.repository.oracle.UserRepository;
import com.handyserve.sockets.WebSocketHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private final PromoCodeRepository promoCodeRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final WebSocketHandler webSocketHandler;

    public PaymentService(PromoCodeRepository promoCodeRepository,
                          BookingRepository bookingRepository,
                          UserRepository userRepository,
                          NotificationService notificationService,
                          WebSocketHandler webSocketHandler) {
        this.promoCodeRepository = promoCodeRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.webSocketHandler = webSocketHandler;
    }

    @Transactional(readOnly = true)
    public PromoCodeDto validatePromo(String code) {
        PromoCode promo = promoCodeRepository.findByCodeIgnoreCaseAndActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Invalid or inactive promo code"));

        if (promo.getExpiresAt() != null && promo.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Promo code has expired");
        }

        return PromoCodeDto.fromEntity(promo);
    }

    @Transactional
    public Map<String, Object> initiatePayment(Long bookingId, String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Access check
        if (user.getRole() != User.Role.admin && !booking.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this booking payment");
        }

        if (booking.getStatus() == Booking.BookingStatus.Completed) {
            throw new RuntimeException("Booking is already completed and paid");
        }

        // Generate invoice ID if not present
        if (booking.getInvoiceId() == null) {
            booking.setInvoiceId("INV" + System.currentTimeMillis());
            booking = bookingRepository.save(booking);
        }

        String orderId = "order_" + UUID.randomUUID().toString().substring(0, 8);

        Map<String, Object> res = new HashMap<>();
        res.put("orderId", orderId);
        res.put("amount", booking.getAmount());
        res.put("currency", "INR");
        res.put("invoiceId", booking.getInvoiceId());
        res.put("bookingId", booking.getId());

        return res;
    }

    @Transactional
    public Map<String, Object> verifyPayment(Long bookingId, String paymentId, String signature, String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Access check
        if (user.getRole() != User.Role.admin && !booking.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this booking payment verification");
        }

        // Transition booking to completed if it's in Pending_Payment
        if (booking.getStatus() == Booking.BookingStatus.Pending_Payment) {
            booking.setStatus(Booking.BookingStatus.Completed);
            booking = bookingRepository.save(booking);

            // Broadcast booking status change
            webSocketHandler.broadcastToAll("{\"type\":\"booking:status\",\"id\":" + booking.getId() + ",\"status\":\"Completed\"}");

            // Notify Customer
            notificationService.createNotification(
                    booking.getCustomer().getId(),
                    "Payment Successful",
                    "Payment of ₹" + booking.getAmount() + " received for job: " + booking.getService(),
                    "💳"
            );

            // Notify Provider
            notificationService.createNotification(
                    booking.getProvider().getId(),
                    "Job Completed & Settled",
                    "Customer settled booking #" + booking.getId() + ". ₹" + booking.getAmount() + " credited.",
                    "💰"
            );
        } else if (booking.getStatus() != Booking.BookingStatus.Completed) {
            // Force status to completed if paying
            booking.setStatus(Booking.BookingStatus.Completed);
            booking = bookingRepository.save(booking);
            webSocketHandler.broadcastToAll("{\"type\":\"booking:status\",\"id\":" + booking.getId() + ",\"status\":\"Completed\"}");
        }

        Map<String, Object> res = new HashMap<>();
        res.put("verified", true);
        res.put("bookingId", booking.getId());
        res.put("status", "Completed");

        return res;
    }
}
