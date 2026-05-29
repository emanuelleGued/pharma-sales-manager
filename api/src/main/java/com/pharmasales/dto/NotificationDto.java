package com.pharmasales.dto;

import com.pharmasales.model.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean read;
    private NotificationType type;
}