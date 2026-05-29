package com.pharmasales.controller;

import com.pharmasales.dto.NotificationDto;
import com.pharmasales.model.UserRole;
import com.pharmasales.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(
            @RequestParam Long userId,
            @RequestParam UserRole role
    ) {
        return ResponseEntity.ok(
                notificationService.getNotificationsByRole(userId, role)
        );
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }
}