package com.watchtogether.Entity.jpa;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Data
public class Room {
    private String roomId;
    private String hostSessionId; // Session ID của người chủ phòng
    private String hostName;
    
    // Trạng thái Player hiện tại
    private int currPlayer = 0; // 0: YouTube, 1: DailyMotion, etc.
    private String currentVideoId = "M7lc1UVf-VE"; 
    private boolean isPlaying = false;
    private double currentTime = 0.0;

    // Danh sách người dùng trong phòng
    private List<String> users = new ArrayList<>();
    
    // Hàng chờ video (Queue)
    private List<VideoItem> queue = new ArrayList<>();

    public Room(String roomId) {
        this.roomId = roomId;
    }
}