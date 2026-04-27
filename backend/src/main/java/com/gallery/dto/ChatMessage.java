package com.gallery.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private String senderName;
    private String senderRole;
    private String receiverEmail;
    private String content;
    private LocalDateTime timestamp;
    private String roomId;
}
