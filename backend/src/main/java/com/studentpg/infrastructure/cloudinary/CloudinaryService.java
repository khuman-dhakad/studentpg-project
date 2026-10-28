package com.studentpg.infrastructure.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.studentpg.modules.pg.entity.PGImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;
    private RestTemplate restTemplate;
    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

    public CloudinaryService(Cloudinary cloudinary, @Autowired(required = false) RestTemplate restTemplate) {
        this.cloudinary = cloudinary;
        this.restTemplate = (restTemplate != null) ? restTemplate : new RestTemplate();
    }

    public CloudinaryService(Cloudinary cloudinary) {
        this(cloudinary, new RestTemplate());
    }

    public PGImage uploadImage(MultipartFile image) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                image.getBytes(), ObjectUtils.asMap(
                        "folder", "studentpg",
                        "resource_type", "image"
                ));

        String publicId = uploadResult.get("public_id").toString();
        String url = uploadResult.get("secure_url").toString();
        return new PGImage(publicId, url);
    }

    public Map<String, String> uploadProfileImage(MultipartFile image) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                image.getBytes(),
                ObjectUtils.asMap(
                        "folder", "studentpg/owners",
                        "resource_type", "image"
                ));

        Map<String, String> response = new HashMap<>();
        response.put("publicId", uploadResult.get("public_id").toString());
        response.put("url", uploadResult.get("secure_url").toString());
        return response;
    }

    public Map<String, String> uploadVerificationDocumentBytes(byte[] bytes, String filename, String contentType) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                bytes,
                ObjectUtils.asMap(
                        "folder", "studentpg/owner-verifications",
                        "type", "authenticated",
                        "resource_type", "auto"
                )
        );

        Map<String, String> response = new HashMap<>();
        response.put("publicId", uploadResult.get("public_id").toString());
        response.put("format", uploadResult.get("format") != null ? uploadResult.get("format").toString() : "");
        response.put("resourceType", uploadResult.get("resource_type") != null ? uploadResult.get("resource_type").toString() : "image");
        return response;
    }

    public Map<String, String> uploadVerificationDocument(MultipartFile document) throws IOException {
        return uploadVerificationDocumentBytes(document.getBytes(), document.getOriginalFilename(), document.getContentType());
    }

    public void deleteVerificationDocument(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank()) {
            throw new IllegalArgumentException("Public ID is required.");
        }
        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap(
                        "type", "authenticated",
                        "resource_type", "auto"
                )
        );
        logger.info("Cloudinary authenticated verification document deleted: {}", publicId);
    }

    public byte[] downloadVerificationDocument(String publicId, String format, String resourceType) throws IOException {
        if (publicId == null || publicId.isBlank()) {
            return null;
        }
        long expiresAt = (System.currentTimeMillis() / 1000L) + 300L;
        String resType = (resourceType != null && !resourceType.isBlank()) ? resourceType : "image";
        String signedUrl;
        try {
            signedUrl = cloudinary.privateDownload(publicId, format != null ? format : "", ObjectUtils.asMap(
                    "resource_type", resType,
                    "type", "authenticated",
                    "expires_at", expiresAt
            ));
        } catch (Exception ex) {
            signedUrl = cloudinary.url()
                    .resourceType(resType)
                    .type("authenticated")
                    .signed(true)
                    .generate(publicId);
        }

        if (restTemplate == null) {
            restTemplate = new RestTemplate();
        }
        try {
            return restTemplate.getForObject(signedUrl, byte[].class);
        } catch (Exception ex) {
            logger.error("Failed to download authenticated document from Cloudinary URL: {}", ex.getMessage());
            throw new IOException("Failed to download verification document", ex);
        }
    }

    public String generateShortLivedVerificationDocumentUrl(String publicId, String format, String resourceType, int expirySeconds) {
        if (publicId == null || publicId.isBlank()) {
            return null;
        }
        long expiresAt = (System.currentTimeMillis() / 1000L) + expirySeconds;
        String resType = (resourceType != null && !resourceType.isBlank()) ? resourceType : "image";
        try {
            return cloudinary.privateDownload(publicId, format != null ? format : "", ObjectUtils.asMap(
                    "resource_type", resType,
                    "type", "authenticated",
                    "expires_at", expiresAt
            ));
        } catch (Exception ex) {
            return cloudinary.url()
                    .resourceType(resType)
                    .type("authenticated")
                    .signed(true)
                    .generate(publicId);
        }
    }

    public void deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank()) {
            throw new IllegalArgumentException("Public ID is required.");
        }
        Map<?, ?> result = cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap(
                        "resource_type", "image"
                )
        );
        logger.info("Cloudinary image deleted: {}", publicId);
        logger.debug("Cloudinary delete response: {}", result);
    }
}
