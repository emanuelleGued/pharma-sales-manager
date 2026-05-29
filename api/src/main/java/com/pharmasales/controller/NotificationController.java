package com.pharmasales.controller;

import com.pharmasales.model.Notification;
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
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam Long userId,
            @RequestParam UserRole role
    ) {

        List<Notification> notifications =
                notificationService.getNotificationsByRole(
                        userId,
                        role
                );

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id
    ) {

        notificationService.markAsRead(id);

        return ResponseEntity.noContent().build();
    }
}