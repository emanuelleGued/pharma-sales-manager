package com.pharmasales.repository;

import com.pharmasales.model.Notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    @Query("""
        SELECT n
        FROM Notification n
        WHERE n.userId = :userId
        ORDER BY n.createdAt DESC
    """)
    List<Notification> findRepresentativeNotifications(
            Long userId
    );

    @Query("""
        SELECT n
        FROM Notification n
        WHERE n.userId = :userId
        ORDER BY n.createdAt DESC
    """)
    List<Notification> findManagerNotifications(
            Long userId
    );
}