package com.watchtogether.listener;

import com.watchtogether.Entity.jpa.Room;
import com.watchtogether.Service.RoomService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private RoomService roomService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        Room room = roomService.handleDisconnect(sessionId);
        
        if (room != null) {
            logger.info("User disconnected from room: " + room.getRoomId());
            // Gửi thông báo cập nhật danh sách user mới cho phòng
            messagingTemplate.convertAndSend("/topic/room/" + room.getRoomId(), room);
        }
    }
}