package com.gallery.dto;

import lombok.Data;
import java.time.LocalDateTime;

public class ReviewDto {

    @Data
    public static class Request {
        private Long artworkId;
        private Integer rating;
        private String comment;
    }

    @Data
    public static class Response {
        private Long id;
        private String userName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;
    }
}
