package com.pharmasales.service;

import com.pharmasales.dto.NotificationDto;
import com.pharmasales.model.UserRole;
import com.pharmasales.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationDto> getNotificationsByRole(Long userId, UserRole role) {
        return notificationRepository
                .findByUserIdDestinyAndRoleOrderByCreatedAtDesc(userId, role)
                .stream()
                .map(n -> new NotificationDto(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getCreatedAt(),
                        n.isRead(),
                        n.getType()
                ))
                .collect(Collectors.toList());
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}