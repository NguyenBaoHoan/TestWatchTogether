package com.watchtogether.Controller;

import com.watchtogether.DTO.VideoAction;
import com.watchtogether.Entity.jpa.Room;
import com.watchtogether.Service.RoomService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class VideoController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Client gửi: /app/room/{roomId}/join
    @MessageMapping("/room/{roomId}/join")
    @SendTo("/topic/room/{roomId}")
    public Room joinRoom(@DestinationVariable String roomId, @Payload String username,
            SimpMessageHeaderAccessor headerAccessor) {
        // INFO: Dùng cho các sự kiện bình thường, thành công
        log.info("REQUEST JOIN ROOM | RoomId: {} | User: {}", roomId, username);
        String sessionId = headerAccessor.getSessionId();
        return roomService.joinRoom(roomId, username, sessionId);
    }

    // Client gửi: /app/video/action (Play/Pause/Seek)
    @MessageMapping("/video/action")
    public void handleVideoAction(@Payload VideoAction action) {
        log.debug("VIDEO ACTION RECEIVED | Room: {} | Action: {} | Time: {}",
                action.getRoomId(), action.getType(), action.getTimestamp());
        if (action.getVideoId() == null || action.getVideoId().isEmpty()) {
            // WARN: Cảnh báo những thứ bất thường nhưng không làm sập app
            log.warn("INVALID ACTION | Missing VideoId | User: {}", action.getUsername());
            return;
        }
        // 1. Cho phép ASK_SYNC đi qua mà không cần check videoId quá gắt
        if ("ASK_SYNC".equals(action.getType())) {
            String roomId = action.getRoomId();
            // Chỉ cần broadcast để Host nghe thấy
            messagingTemplate.convertAndSend("/topic/room/" + roomId + "/video", action);
            return;
        }
        String roomId = action.getRoomId();

        // Cập nhật trạng thái server
        boolean isPlaying = "PLAY".equals(action.getType());
        roomService.updateVideoState(roomId, action.getVideoId(), action.getTimestamp(), isPlaying);

        // Gửi lại cho tất cả mọi người trong phòng
        // Tương đương socket.in(room).emit(...)
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/video", action);
    }

    // Client gửi lệnh Sync (khi người mới vào hoặc bấm nút Sync)
    @MessageMapping("/video/sync")
    public void handleSync(@Payload VideoAction action) {
        // Broadcast trạng thái hiện tại cho tất cả
        messagingTemplate.convertAndSend("/topic/room/" + action.getRoomId() + "/sync", action);
    }
}