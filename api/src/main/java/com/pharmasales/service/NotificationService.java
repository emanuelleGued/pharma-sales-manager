package com.pharmasales.service;

import com.pharmasales.model.Notification;
import com.pharmasales.model.UserRole;
import com.pharmasales.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getNotificationsByRole(
            Long userId,
            UserRole role
    ) {

        if (role == UserRole.REPRESENTATIVE) {

            return notificationRepository
                    .findRepresentativeNotifications(userId);
        }

        return notificationRepository
                .findManagerNotifications(userId);
    }

    public void markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Notificação não encontrada"
                                )
                        );

        notification.setRead(true);

        notificationRepository.save(notification);
    }
}