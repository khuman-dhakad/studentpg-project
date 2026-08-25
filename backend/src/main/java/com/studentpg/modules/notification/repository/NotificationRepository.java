package com.studentpg.modules.notification.repository;

import com.studentpg.modules.notification.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    List<Notification>
    findTop20ByOwnerIdOrderByCreatedAtDesc(
            String ownerId
    );

    long countByOwnerIdAndReadFalse(
            String ownerId
    );

    Optional<Notification>
    findByIdAndOwnerId(
            String id,
            String ownerId
    );
}