package com.studentpg.modules.owner.service;

import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import org.bson.Document;
import org.bson.types.Binary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class OwnerKycMigrationService {

    private static final Logger logger = LoggerFactory.getLogger(OwnerKycMigrationService.class);

    private final MongoTemplate mongoTemplate;
    private final CloudinaryService cloudinaryService;
    private final AtomicBoolean isMigrating = new AtomicBoolean(false);

    public record MigrationSummary(
            boolean success,
            int totalScanned,
            int successfullyMigrated,
            int failedCount,
            int skippedCount,
            String message
    ) {}

    public OwnerKycMigrationService(MongoTemplate mongoTemplate, CloudinaryService cloudinaryService) {
        this.mongoTemplate = mongoTemplate;
        this.cloudinaryService = cloudinaryService;
    }

    public boolean isMigrationInProgress() {
        return isMigrating.get();
    }

    public MigrationSummary migrateAllLegacyKycDocuments() {
        if (!isMigrating.compareAndSet(false, true)) {
            logger.warn("KYC migration rejected: another migration execution is already in progress.");
            throw new IllegalStateException("KYC migration is already in progress.");
        }

        try {
            Query query = new Query(Criteria.where("verificationDocumentData").exists(true).ne(null));
            List<Document> rawDocs = mongoTemplate.find(query, Document.class, "owners");
            int totalScanned = rawDocs != null ? rawDocs.size() : 0;
            int migratedCount = 0;
            int failedCount = 0;
            int skippedCount = 0;

            if (rawDocs != null) {
                for (Document rawDoc : rawDocs) {
                    String ownerId = rawDoc.get("_id") != null ? rawDoc.get("_id").toString() : "unknown";
                    try {
                        Object rawData = rawDoc.get("verificationDocumentData");
                        if (rawData == null) {
                            skippedCount++;
                            continue;
                        }
                        if (migrateOwnerDocument(rawDoc, ownerId)) {
                            migratedCount++;
                        } else {
                            skippedCount++;
                        }
                    } catch (Exception ex) {
                        failedCount++;
                        logger.error("Failed to migrate legacy KYC document for owner {}: {}", ownerId, ex.getMessage());
                    }
                }
            }

            logger.info("KYC migration finished. Total scanned: {}, Migrated: {}, Failed: {}, Skipped: {}",
                    totalScanned, migratedCount, failedCount, skippedCount);

            return new MigrationSummary(
                    true,
                    totalScanned,
                    migratedCount,
                    failedCount,
                    skippedCount,
                    "Legacy KYC migration completed successfully."
            );
        } finally {
            isMigrating.set(false);
        }
    }

    public boolean migrateOwnerDocument(Document rawDoc, String ownerId) throws Exception {
        Object rawData = rawDoc.get("verificationDocumentData");
        byte[] bytes = null;
        if (rawData instanceof Binary binary) {
            bytes = binary.getData();
        } else if (rawData instanceof byte[] b) {
            bytes = b;
        }

        if (bytes == null || bytes.length == 0) {
            mongoTemplate.updateFirst(new Query(Criteria.where("_id").is(rawDoc.get("_id"))),
                    new Update().unset("verificationDocumentData"), "owners");
            return false;
        }

        String contentType = rawDoc.getString("verificationDocumentContentType");
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/pdf";
        }
        String filename = rawDoc.getString("verificationDocumentFilename");
        if (filename == null || filename.isBlank()) {
            filename = "verification-document.pdf";
        }

        Map<String, String> uploadResult = cloudinaryService.uploadVerificationDocumentBytes(bytes, filename, contentType);

        String publicId = uploadResult != null ? uploadResult.get("publicId") : null;
        String format = uploadResult != null ? uploadResult.get("format") : null;
        String resourceType = uploadResult != null ? uploadResult.get("resourceType") : null;

        if (publicId != null && !publicId.isBlank()) {
            Query updateQuery = new Query(Criteria.where("_id").is(rawDoc.get("_id")));
            Update update = new Update()
                    .set("verificationDocumentPublicId", publicId)
                    .set("verificationDocumentFormat", format)
                    .set("verificationDocumentResourceType", resourceType)
                    .unset("verificationDocumentUrl")
                    .unset("verificationDocumentData");

            mongoTemplate.updateFirst(updateQuery, update, "owners");
            logger.info("Successfully migrated owner {} KYC document to authenticated Cloudinary asset {}", ownerId, publicId);
            return true;
        }
        throw new IllegalStateException("Cloudinary upload did not return a valid publicId.");
    }
}
