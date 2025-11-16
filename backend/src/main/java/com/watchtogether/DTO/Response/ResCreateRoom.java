package com.watchtogether.DTO.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class ResCreateRoom {
     private String roomId;
    private String inviteCode;
    private String accessToken; // Token để xác thực cho các thao tác sau này (VD: WebSocket)
    private String wsUrl;
    private String joinUrl;
}
