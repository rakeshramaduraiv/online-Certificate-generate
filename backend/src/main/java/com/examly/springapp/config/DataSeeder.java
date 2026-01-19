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
        if (userRepository.count() == 0) {
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
        systemAdmin.setEmail("admin@system.com");
        systemAdmin.setPassword(passwordEncoder.encode("admin123"));
        systemAdmin.setRole(User.Role.SYSTEM_ADMIN);
        systemAdmin.setInstitution(defaultInstitution);
        systemAdmin.setIsActive(true);
        userRepository.save(systemAdmin);

        // Create certificate admin user
        User certAdmin = new User();
        certAdmin.setFullName("Certificate Administrator");
        certAdmin.setEmail("certadmin@system.com");
        certAdmin.setPassword(passwordEncoder.encode("cert123"));
        certAdmin.setRole(User.Role.CERTIFICATE_ADMIN);
        certAdmin.setInstitution(defaultInstitution);
        certAdmin.setIsActive(true);
        userRepository.save(certAdmin);

        // Create instructor user
        User instructor = new User();
        instructor.setFullName("John Instructor");
        instructor.setEmail("instructor@system.com");
        instructor.setPassword(passwordEncoder.encode("instructor123"));
        instructor.setRole(User.Role.INSTRUCTOR);
        instructor.setInstitution(defaultInstitution);
        instructor.setIsActive(true);
        userRepository.save(instructor);

        // Create student user
        User student = new User();
        student.setFullName("Jane Student");
        student.setEmail("student@system.com");
        student.setPassword(passwordEncoder.encode("student123"));
        student.setRole(User.Role.STUDENT);
        student.setInstitution(defaultInstitution);
        student.setIsActive(true);
        userRepository.save(student);

        log.info("Initial data seeded successfully!");
        log.info("Default users created:");
        log.info("System Admin - Email: admin@system.com, Password: admin123");
        log.info("Certificate Admin - Email: certadmin@system.com, Password: cert123");
        log.info("Instructor - Email: instructor@system.com, Password: instructor123");
        log.info("Student - Email: student@system.com, Password: student123");
    }
}