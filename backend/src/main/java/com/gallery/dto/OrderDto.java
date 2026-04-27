package com.gallery.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data
    public static class Response {
        private Long id;
        private BigDecimal totalPrice;
        private String status;
        private LocalDateTime createdAt;
        private List<ItemResponse> items;
    }

    @Data
    public static class ItemResponse {
        private Long artworkId;
        private String artworkTitle;
        private String imageUrl;
        private BigDecimal price;
    }
}
