package com.watchtogether.DTO.Request;

import lombok.Data;

// Sử dụng chung cho cả Login và Register
@Data
public class ReqAuth {
    private String name; // Chỉ dùng cho Register
    private String email;
    private String password;
}