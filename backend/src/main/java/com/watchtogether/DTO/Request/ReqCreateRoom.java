package com.watchtogether.DTO.Request;
import lombok.Data;

// Lớp này định nghĩa dữ liệu mà Frontend sẽ gửi lên khi muốn tạo phòng.
// Hiện tại chỉ có displayName của Host, có thể có hoặc không.
@Data
public class ReqCreateRoom {
    private String displayName;
}
