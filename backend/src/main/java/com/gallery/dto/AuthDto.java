package com.gallery.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank private String name;
        @Email @NotBlank private String email;
        @Size(min = 6) @NotBlank private String password;
        private String role = "VISITOR";
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String role;
        private String name;
        private Long id;
        private String status;

        public AuthResponse(String token, String role, String name, Long id, String status) {
            this.token = token;
            this.role = role;
            this.name = name;
            this.id = id;
            this.status = status;
        }
    }
}
