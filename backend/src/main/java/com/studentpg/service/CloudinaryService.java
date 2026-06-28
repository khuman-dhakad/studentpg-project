package com.studentpg.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.studentpg.model.PGImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Collections;


import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public PGImage uploadImage(MultipartFile image) throws IOException {

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                image.getBytes(),
                ObjectUtils.asMap(
                        "folder", "studentpg"
                )
        );

        String publicId = uploadResult.get("public_id").toString();
        String url = uploadResult.get("secure_url").toString();

        return new PGImage(publicId, url);
    }
    public void deleteImage(String publicId) throws IOException {

    Map<?, ?> result = cloudinary.uploader().destroy(
            publicId,
            ObjectUtils.emptyMap()
    );

    System.out.println("Cloudinary Delete Response: " + result);
    }
}