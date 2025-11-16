package com.watchtogether.Entity.jpa;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;

    // Enum để định nghĩa loại tin nhắn
    public enum MessageType {
        CHAT,   // Tin nhắn văn bản bình thường
        JOIN,   // Thông báo người dùng vào phòng
        LEAVE   // Thông báo người dùng rời phòng
    }
}