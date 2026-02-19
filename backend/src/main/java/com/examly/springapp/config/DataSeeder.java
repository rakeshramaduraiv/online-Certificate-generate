package com.examly.springapp.config;

import com.examly.springapp.entity.Institution;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.InstitutionRepository;
import com.examly.springapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if the admin user doesn't exist yet (idempotent — safe to restart)
        if (!userRepository.existsByEmail("admin@certificate.com")) {
            seedData();
        }
    }

    private void seedData() {
        log.info("Seeding initial data...");

        // Create default institution
        Institution defaultInstitution = new Institution();
        defaultInstitution.setName("Default Institution");
        defaultInstitution.setAddress("123 Main St, City, State");
        defaultInstitution.setContactInfo("contact@institution.com");
        defaultInstitution.setAccreditationDetails("Accredited by XYZ Board");
        institutionRepository.save(defaultInstitution);

        // Create system admin user
        User systemAdmin = new User();
        systemAdmin.setFullName("System Administrator");
        systemAdmin.setEmail("admin@certificate.com");
        systemAdmin.setPassword(passwordEncoder.encode("Admin@123"));
        systemAdmin.setRole(User.Role.SYSTEM_ADMIN);
        systemAdmin.setInstitution(defaultInstitution);
        systemAdmin.setIsActive(true);
        userRepository.save(systemAdmin);

        // Create certificate admin user
        User certAdmin = new User();
        certAdmin.setFullName("Certificate Administrator");
        certAdmin.setEmail("certadmin@certificate.com");
        certAdmin.setPassword(passwordEncoder.encode("CertAdmin@123"));
        certAdmin.setRole(User.Role.CERTIFICATE_ADMIN);
        certAdmin.setInstitution(defaultInstitution);
        certAdmin.setIsActive(true);
        userRepository.save(certAdmin);

        // Create instructor user
        User instructor = new User();
        instructor.setFullName("John Instructor");
        instructor.setEmail("instructor@certificate.com");
        instructor.setPassword(passwordEncoder.encode("Instructor@123"));
        instructor.setRole(User.Role.INSTRUCTOR);
        instructor.setInstitution(defaultInstitution);
        instructor.setIsActive(true);
        userRepository.save(instructor);

        // Create student user
        User student = new User();
        student.setFullName("Jane Student");
        student.setEmail("student@certificate.com");
        student.setPassword(passwordEncoder.encode("Student@123"));
        student.setRole(User.Role.STUDENT);
        student.setInstitution(defaultInstitution);
        student.setIsActive(true);
        userRepository.save(student);

        log.info("Initial data seeded successfully!");
        log.info("Default users created:");
        log.info("System Admin      - Email: admin@certificate.com,      Password: Admin@123");
        log.info("Certificate Admin - Email: certadmin@certificate.com,  Password: CertAdmin@123");
        log.info("Instructor        - Email: instructor@certificate.com, Password: Instructor@123");
        log.info("Student           - Email: student@certificate.com,    Password: Student@123");
        log.info("WARNING: CHANGE ALL DEFAULT PASSWORDS IMMEDIATELY IN PRODUCTION!");
    }
}