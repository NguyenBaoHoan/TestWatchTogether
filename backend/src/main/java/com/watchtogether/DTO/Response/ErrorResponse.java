package com.watchtogether.DTO.Response;

import lombok.Data;

@Data
public class ErrorResponse {

    private String message;
    private Long timestamp;

    public ErrorResponse(String message, Long timestamp) {
        this.message = message;
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public Long getTimestamp() {
        return timestamp;
    }

}
