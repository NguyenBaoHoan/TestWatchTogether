package com.watchtogether.DTO.Response;

import java.time.Instant;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResParticipant {
    private String id;
    private String displayName;
    private String role;
    private Instant joinedAt;
    private boolean isOnline;
}
