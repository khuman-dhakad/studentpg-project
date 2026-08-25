package com.studentpg.modules.notification.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notifications")
@CompoundIndex(
        name = "owner_created_at_idx",
        def = "{'ownerId': 1, 'createdAt': -1}"
)
public class Notification {

    @Id
    private String id;

    @Indexed
    private String ownerId;

    private String pgId;

    private String type;

    private String title;

    private String message;

    @Indexed
    private boolean read = false;

    @CreatedDate
    private Instant createdAt;

    public Notification() {
    }

    public Notification(
            String ownerId,
            String pgId,
            String type,
            String title,
            String message
    ) {
        this.ownerId = ownerId;
        this.pgId = pgId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.read = false;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public String getPgId() {
        return pgId;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRead() {
        return read;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void markAsRead() {
        this.read = true;
    }
}