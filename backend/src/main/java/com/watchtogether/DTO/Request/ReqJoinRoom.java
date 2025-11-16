package com.watchtogether.DTO.Request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReqJoinRoom {
    private String displayName;
    private String inviteCode;
    private String role; // "host" hoặc "guest"
}