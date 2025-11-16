package com.watchtogether.Handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class NativeWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("✅ WebSocket connected: sessionId={}", session.getId());

        // Gửi welcome message
        String welcome = String.format("{\"type\":\"CONNECTED\",\"sessionId\":\"%s\"}", session.getId());
        session.sendMessage(new TextMessage(welcome));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("📥 Received from {}: {}", session.getId(), payload);

        // Echo back với timestamp
        String response = String.format(
                "{\"type\":\"ECHO\",\"message\":\"%s\",\"timestamp\":%d}",
                payload, System.currentTimeMillis());
        session.sendMessage(new TextMessage(response));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("🔌 WebSocket disconnected: sessionId={}, status={}", session.getId(), status);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("❌ WebSocket error in session {}: {}", session.getId(), exception.getMessage());
    }
}