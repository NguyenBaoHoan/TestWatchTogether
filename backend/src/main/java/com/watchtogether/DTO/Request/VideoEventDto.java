package com.watchtogether.DTO.Request;

import com.watchtogether.util.Enum.VideoEventType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoEventDto {
    // Loai event: PLAY, PAUSE, SEEK, CHANGE
    private VideoEventType type;
    
    // ID of person who send the event
    private String participantId;
    
    // Current playback time (seconds)
    private Double currentTime;
    
    // Video URL (fixed field name to match frontend)
    private String videoUrl;
    
    // Timestamp when event was created
    private Long timestamp;
    
    // Additional metadata for validation
    private String roomId;
    
    // For SYNC_STATE events
    private String playbackState;         // "PLAYING", "PAUSED", "STOPPED"
    private Boolean isPlaying;            // Convenience field for frontend
}
