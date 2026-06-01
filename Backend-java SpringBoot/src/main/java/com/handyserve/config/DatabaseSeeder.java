package com.handyserve.config;

import com.handyserve.entity.User;
import com.handyserve.repository.oracle.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed admin if not exists
        if (!userRepository.existsByEmailIgnoreCase("admin@handyserve.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@handyserve.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.admin)
                    .avatar("AD")
                    .verified(true)
                    .blocked(false)
                    .build();
            userRepository.save(admin);
            System.out.println("Seeded admin user: admin@handyserve.com");
        }

        // Seed default customer if not exists
        if (!userRepository.existsByEmailIgnoreCase("arjun@email.com")) {
            User customer = User.builder()
                    .name("Arjun")
                    .email("arjun@email.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(User.Role.customer)
                    .avatar("AR")
                    .verified(true)
                    .blocked(false)
                    .state("Tamil Nadu")
                    .city("Coimbatore")
                    .serviceCity("Coimbatore")
                    .serviceCityActive(true)
                    .location("Peelamedu")
                    .displayAddress("Peelamedu, Coimbatore, Tamil Nadu, India")
                    .latitude(11.0168)
                    .longitude(76.9558)
                    .build();
            userRepository.save(customer);
            System.out.println("Seeded customer user: arjun@email.com");
        }

        // Seed default provider if not exists
        if (!userRepository.existsByEmailIgnoreCase("ravi@email.com")) {
            User provider = User.builder()
                    .name("Ravi")
                    .email("ravi@email.com")
                    .password(passwordEncoder.encode("provider123"))
                    .role(User.Role.provider)
                    .avatar("RV")
                    .verified(true)
                    .blocked(false)
                    .reliabilityScore(98)
                    .lowScoreDays(0)
                    .state("Tamil Nadu")
                    .city("Chennai")
                    .serviceCity("Chennai")
                    .serviceCityActive(true)
                    .location("Anna Nagar")
                    .latitude(13.0852)
                    .longitude(80.2101)
                    .serviceType("Plumbing")
                    .build();
            userRepository.save(provider);
            System.out.println("Seeded provider user: ravi@email.com");
        }
    }
}
