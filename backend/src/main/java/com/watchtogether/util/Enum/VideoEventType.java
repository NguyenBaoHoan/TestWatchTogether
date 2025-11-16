package com.watchtogether.util.Enum;

public enum VideoEventType {
    PLAY,           // Play video
    PAUSE,          // Pause video  
    SEEK,           // Seek to specific time
    CHANGE,         // Change video URL
    SYNC_STATE,     // Full state sync for new users
    REQUEST_SYNC    // Request current state from server
}