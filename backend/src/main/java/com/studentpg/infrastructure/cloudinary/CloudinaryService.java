package com.studentpg.infrastructure.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.studentpg.modules.pg.entity.PGImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;
    private static final Logger logger =
        LoggerFactory.getLogger(CloudinaryService.class);

    public PGImage uploadImage(MultipartFile image) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                image.getBytes(), ObjectUtils.asMap(
        "folder",
        "studentpg",
        "resource_type",
        "image"
));

        String publicId = uploadResult.get("public_id").toString();
        String url = uploadResult.get("secure_url").toString();
        return new PGImage(publicId, url);
    }

    public Map<String, String> uploadProfileImage(MultipartFile image) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                image.getBytes(), 
                ObjectUtils.asMap(
        "folder",
        "studentpg/owners",
        "resource_type",
        "image"
));

        Map<String, String> response = new HashMap<>();
        response.put("publicId", uploadResult.get("public_id").toString());
        response.put("url", uploadResult.get("secure_url").toString());
        return response;
    }

    
    public void deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank()) {

    throw new IllegalArgumentException(
            "Public ID is required."
    );
}
        Map<?, ?> result = cloudinary.uploader().destroy(
        publicId,
        ObjectUtils.asMap(
                "resource_type",
                "image"
        )
);
        logger.info(
        "Cloudinary image deleted: {}",
        publicId
);
        logger.debug(
        "Cloudinary delete response: {}",
        result
);
    }
}