package com.studentpg.modules.notification.dto.response;

import com.studentpg.modules.notification.entity.Notification;

import java.time.Instant;

public record NotificationResponse(
        String id,
        String pgId,
        String type,
        String title,
        String message,
        boolean read,
        Instant createdAt
) {

    public static NotificationResponse from(
            Notification notification
    ) {
        return new NotificationResponse(
                notification.getId(),
                notification.getPgId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}