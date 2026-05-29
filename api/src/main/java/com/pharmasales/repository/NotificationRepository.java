package com.pharmasales.repository;

import com.pharmasales.model.Notification;
import com.pharmasales.model.NotificationType;
import com.pharmasales.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdDestinyAndRoleOrderByCreatedAtDesc(Long userIdDestiny, UserRole role);

    boolean existsByVisitIdAndType(Long visitId, NotificationType type);
}