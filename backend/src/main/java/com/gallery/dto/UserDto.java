package com.gallery.dto;

import lombok.Data;
import java.time.LocalDateTime;

public class UserDto {

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String status;
        private String bio;
        private String profileImage;
        private LocalDateTime createdAt;
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String bio;
    }
}
