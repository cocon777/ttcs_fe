package com.example.ttcs.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GiaoBaiRequest {
    private Integer deId;          // Sửa Long thành Integer
    private Integer lopHocId;      // Sửa Long thành Integer
    private LocalDateTime hanNop;
}