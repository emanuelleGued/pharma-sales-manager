package com.pharmasales.dto;

import com.pharmasales.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserData user;

    @Data
    @AllArgsConstructor
    public static class UserData {
        private Long id;
        private String name;
        private String email;
        private UserRole role;
    }
}