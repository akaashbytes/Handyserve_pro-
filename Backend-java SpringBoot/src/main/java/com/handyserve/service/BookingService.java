package com.handyserve.service;

import com.handyserve.dto.BookingDto;
import com.handyserve.entity.Booking;
import com.handyserve.entity.Booking.BookingStatus;
import com.handyserve.entity.User;
import com.handyserve.repository.oracle.BookingRepository;
import com.handyserve.repository.oracle.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final com.handyserve.sockets.WebSocketHandler webSocketHandler;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, com.handyserve.sockets.WebSocketHandler webSocketHandler) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.webSocketHandler = webSocketHandler;
    }

    @Transactional
    public BookingDto createBooking(BookingDto dto, String customerEmail) {
        User customer = userRepository.findByEmailIgnoreCase(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User provider = userRepository.findById(dto.getServiceProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        if (provider.getRole() != User.Role.provider) {
            throw new RuntimeException("Target user is not a service provider");
        }

        Booking booking = Booking.builder()
                .service(dto.getService())
                .status(BookingStatus.Requested)
                .date(dto.getDate())
                .time(dto.getTime())
                .amount(dto.getAmount())
                .options(dto.getOptions())
                .customer(customer)
                .customerName(customer.getName())
                .customerCity(customer.getCity())
                .customerLatitude(customer.getLatitude())
                .customerLongitude(customer.getLongitude())
                .customerAddress(customer.getDisplayAddress())
                .provider(provider)
                .providerName(provider.getName())
                .providerCity(provider.getServiceCity())
                .providerLatitude(provider.getLatitude())
                .providerLongitude(provider.getLongitude())
                .build();

        booking = bookingRepository.save(booking);
        return BookingDto.fromEntity(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getBookings(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings;
        if (user.getRole() == User.Role.customer) {
            bookings = bookingRepository.findByCustomerOrderByCreatedAtDesc(user);
        } else if (user.getRole() == User.Role.provider) {
            bookings = bookingRepository.findByProviderOrderByCreatedAtDesc(user);
        } else {
            bookings = bookingRepository.findAllByOrderByCreatedAtDesc();
        }

        return bookings.stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDto getBooking(Long id, String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Access check
        if (user.getRole() != User.Role.admin &&
                !booking.getCustomer().getId().equals(user.getId()) &&
                !booking.getProvider().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this booking");
        }

        return BookingDto.fromEntity(booking);
    }

    @Transactional
    public BookingDto updateBookingStatus(Long id, String statusStr, String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Access check
        if (user.getRole() != User.Role.admin &&
                !booking.getCustomer().getId().equals(user.getId()) &&
                !booking.getProvider().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this booking");
        }

        BookingStatus nextStatus = BookingStatus.valueOf(statusStr);

        if (!booking.getStatus().canTransitionTo(nextStatus)) {
            throw new RuntimeException("Invalid status transition from " + booking.getStatus() + " to " + nextStatus);
        }

        booking.setStatus(nextStatus);

        // Additional status logic (e.g. coordinates injection on Accept)
        if (nextStatus == BookingStatus.Accepted) {
            User customer = booking.getCustomer();
            if (customer.getLatitude() != null && customer.getLongitude() != null) {
                booking.setCustomerLatitude(customer.getLatitude());
                booking.setCustomerLongitude(customer.getLongitude());
                booking.setCustomerAddress(customer.getDisplayAddress());
                booking.setCustomerDirectionsUrl(googleMapsSearchUrl(customer.getLatitude(), customer.getLongitude()));
                booking.setNavigationToCustomerUrl(googleMapsDirectionsUrl(customer.getLatitude(), customer.getLongitude()));
            }
        }

        booking = bookingRepository.save(booking);
        webSocketHandler.broadcastToAll("{\"type\":\"booking:status\",\"id\":" + booking.getId() + ",\"status\":\"" + booking.getStatus().name() + "\"}");
        return BookingDto.fromEntity(booking);
    }

    @Transactional
    public BookingDto patchBooking(Long id, BookingDto partialDto, String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Access check
        if (user.getRole() != User.Role.admin &&
                !booking.getCustomer().getId().equals(user.getId()) &&
                !booking.getProvider().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this booking");
        }

        if (partialDto.getProviderLatitude() != null) {
            booking.setProviderLatitude(partialDto.getProviderLatitude());
        }
        if (partialDto.getProviderLongitude() != null) {
            booking.setProviderLongitude(partialDto.getProviderLongitude());
        }
        if (partialDto.getCustomerLatitude() != null) {
            booking.setCustomerLatitude(partialDto.getCustomerLatitude());
        }
        if (partialDto.getCustomerLongitude() != null) {
            booking.setCustomerLongitude(partialDto.getCustomerLongitude());
        }
        if (partialDto.getCustomerAddress() != null) {
            booking.setCustomerAddress(partialDto.getCustomerAddress());
        }
        if (partialDto.getRating() != null) {
            booking.setRating(partialDto.getRating());
        }
        if (partialDto.getPaymentMethod() != null) {
            booking.setPaymentMethod(partialDto.getPaymentMethod());
        }
        if (partialDto.getPaymentId() != null) {
            booking.setPaymentId(partialDto.getPaymentId());
        }

        booking = bookingRepository.save(booking);
        if (partialDto.getProviderLatitude() != null || partialDto.getProviderLongitude() != null) {
            webSocketHandler.broadcastToAll("{\"type\":\"provider:location\",\"id\":" + booking.getId() + ",\"providerLatitude\":" + booking.getProviderLatitude() + ",\"providerLongitude\":" + booking.getProviderLongitude() + "}");
        }
        return BookingDto.fromEntity(booking);
    }

    @Transactional
    public BookingDto rateBooking(Long id, Integer rating, String email) {
        User customer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Only the booking customer can submit a rating");
        }

        if (booking.getStatus() != BookingStatus.Completed) {
            throw new RuntimeException("Cannot rate a booking that is not completed");
        }

        booking.setRating(rating);
        booking = bookingRepository.save(booking);

        // Optionally update provider's average reliability score based on this
        User provider = booking.getProvider();
        Double avgRating = bookingRepository.avgRatingByProvider(provider).orElse(5.0);
        
        // Reliability score: map 1-5 stars to 0-100 score
        int newScore = (int) (avgRating * 20);
        provider.setReliabilityScore(newScore);
        userRepository.save(provider);

        return BookingDto.fromEntity(booking);
    }

    private String googleMapsSearchUrl(double lat, double lon) {
        return "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon;
    }

    private String googleMapsDirectionsUrl(double lat, double lon) {
        return "https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + lon + "&travelmode=driving";
    }
}
