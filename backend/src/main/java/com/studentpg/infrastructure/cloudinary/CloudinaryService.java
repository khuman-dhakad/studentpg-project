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

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public PGImage uploadImage(MultipartFile image) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                image.getBytes(), ObjectUtils.asMap("folder", "studentpg"));

        String publicId = uploadResult.get("public_id").toString();
        String url = uploadResult.get("secure_url").toString();
        return new PGImage(publicId, url);
    }

    public Map<String, String> uploadProfileImage(MultipartFile image) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                image.getBytes(), ObjectUtils.asMap("folder", "studentpg/owners"));

        Map<String, String> response = new HashMap<>();
        response.put("publicId", uploadResult.get("public_id").toString());
        response.put("url", uploadResult.get("secure_url").toString());
        return response;
    }

    public void deleteImage(String publicId) throws IOException {
        Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        System.out.println("Cloudinary Delete Response: " + result);
    }
}