package com.gallery.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ArtworkDto {

    @Data
    public static class Request {
        private String title;
        private String description;
        private BigDecimal price;
        private Long categoryId;
        private String culturalHistory;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private BigDecimal price;
        private String categoryName;
        private Long categoryId;
        private String imageUrl;
        private String status;
        private String culturalHistory;
        private String artistName;
        private Long artistId;
        private LocalDateTime createdAt;
        private Double avgRating;
    }
}
