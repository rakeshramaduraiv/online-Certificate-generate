package com.examly.springapp.dto;

import com.examly.springapp.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private User.Role role;

    public JwtResponse(String token, String refreshToken, Long id, String fullName, String email, User.Role role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }
}
