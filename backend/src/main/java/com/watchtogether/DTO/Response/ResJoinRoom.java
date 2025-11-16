package com.watchtogether.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class ResJoinRoom {
    private String roomId;
    private String displayName;
    private String participantId;
    private String participantRole;
    private String accessToken;
    private String wsUrl;
}
