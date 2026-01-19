package com.examly.springapp.service;

import com.examly.springapp.dto.JwtResponse;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.entity.Institution;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.InstitutionRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.security.JwtUtils;
import com.examly.springapp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        // Authenticate credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(userPrincipal.getEmail());

        return new JwtResponse(
                jwt,
                refreshToken,
                userPrincipal.getId(),
                userPrincipal.getFullName(),
                userPrincipal.getEmail(),
                userPrincipal.getRole()
        );
    }

    public String registerUser(RegisterRequest signUpRequest) {
        // Validate email uniqueness
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email is already taken");
        }

        // Create user
        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole()); // Ensure role is a String

        // Associate institution if provided
        if (signUpRequest.getInstitutionId() != null) {
            Institution institution = institutionRepository.findById(signUpRequest.getInstitutionId())
                    .orElseThrow(() -> new RuntimeException("Institution not found"));
            user.setInstitution(institution);
        }

        userRepository.save(user);
        return "User registered successfully!";
    }
}
