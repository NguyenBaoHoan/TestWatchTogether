package com.watchtogether.Service;

import com.watchtogether.Entity.jpa.Room;
import com.watchtogether.Entity.jpa.VideoItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class RoomService {
    private final Map<String, Room> rooms = new ConcurrentHashMap<>();
    private final Map<String, String> userRoomMap = new ConcurrentHashMap<>();

    public Room joinRoom(String roomId, String username, String sessionId) {
        // ... (Giữ nguyên phần joinRoom cũ) ...
        Room room = rooms.computeIfAbsent(roomId, Room::new);

        if (room.getHostSessionId() == null) {
            room.setHostSessionId(sessionId);
            room.setHostName(username);
            log.info("NEW HOST ASSIGNED | Room: {} | Host: {}", roomId, username);
        }

        if (!room.getUsers().contains(username)) {
            room.getUsers().add(username);
        }
        userRoomMap.put(sessionId, roomId);
        return room;
    }

    public Room getRoom(String roomId) {
        return rooms.get(roomId);
    }

    // --- PHẦN QUAN TRỌNG CẦN SỬA ĐỂ DEBUG ---
    public void updateVideoState(String roomId, String videoId, double time, boolean isPlaying) {
        Room room = rooms.get(roomId);

        if (room == null) {
            log.error("SYNC ERROR | Room not found: {}", roomId);
            return;
        }

        // Log trạng thái TRƯỚC khi update để so sánh độ lệch
        log.info("STATE UPDATE | Room: {} | Old Time: {} -> New Time: {} | Old State: {} -> New State: {}",
                roomId, room.getCurrentTime(), time, room.isPlaying(), isPlaying);

        if (videoId != null && !videoId.equals(room.getCurrentVideoId())) {
            log.info("VIDEO CHANGED | Room: {} | Old Video: {} -> New Video: {}",
                    roomId, room.getCurrentVideoId(), videoId);
            room.setCurrentVideoId(videoId);
        }

        room.setCurrentTime(time);
        room.setPlaying(isPlaying);
    }

    public void addToQueue(String roomId, VideoItem item) {
        // ... (Giữ nguyên) ...
        Room room = rooms.get(roomId);
        if (room != null) {
            room.getQueue().add(item);
            log.info("ADDED TO QUEUE | Room: {} | Video: {}", roomId, item.getTitle());
        }
    }

    // ... (Giữ nguyên handleDisconnect) ...
    public Room handleDisconnect(String sessionId) {
        String roomId = userRoomMap.remove(sessionId);
        if (roomId != null) {
            Room room = rooms.get(roomId);
            if (room != null) {
                if (sessionId.equals(room.getHostSessionId())) {
                    room.setHostSessionId(null);
                    log.info("HOST LEFT | Room: {} | Session: {}", roomId, sessionId);
                }
                return room;
            }
        }
        return null;
    }
}