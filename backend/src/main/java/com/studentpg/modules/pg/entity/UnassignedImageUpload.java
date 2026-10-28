package com.studentpg.modules.pg.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "unassigned_image_uploads")
public class UnassignedImageUpload {

    @Id
    private String id;

    @Indexed(unique = true)
    private String publicId;

    @Indexed
    private String ownerId;

    private Instant uploadedAt;

    public UnassignedImageUpload() {}

    public UnassignedImageUpload(String publicId, String ownerId, Instant uploadedAt) {
        this.publicId = publicId;
        this.ownerId = ownerId;
        this.uploadedAt = uploadedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
