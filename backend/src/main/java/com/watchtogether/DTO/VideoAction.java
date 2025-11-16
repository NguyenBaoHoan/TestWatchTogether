package com.watchtogether.DTO;

import lombok.Data;

@Data
public class VideoAction {
    private String roomId;
    private String type; // "PLAY", "PAUSE", "SYNC", "CHANGE_VIDEO", "SEEK"
    private String videoId;
    private double timestamp;
    private int playerType;
    private String username; // Người thực hiện hành động
}