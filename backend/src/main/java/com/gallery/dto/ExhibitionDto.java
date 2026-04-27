package com.gallery.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ExhibitionDto {

    @Data
    public static class Request {
        private String title;
        private String description;
        private String theme;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String theme;
        private String curatorName;
        private LocalDateTime createdAt;
        private List<ArtworkDto.Response> artworks;
    }
}
