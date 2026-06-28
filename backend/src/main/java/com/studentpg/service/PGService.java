package com.studentpg.service;

import com.studentpg.model.PG;
import com.studentpg.repository.PGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.studentpg.model.PGImage;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Iterator;


@Service
public class PGService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public String addPG(PG pg) {

        pg.setApprovalStatus("PENDING");

        pgRepository.save(pg);

        return "PG added successfully. Waiting for admin approval.";
    }
    public List<PG> getOwnerPGs(String ownerId) {
    return pgRepository.findByOwnerId(ownerId);
 }
 public String updatePG(String id, String ownerId, PG updatedPG) {

    if (!pgRepository.existsByIdAndOwnerId(id, ownerId)) {
        return "PG not found or access denied";
    }

    updatedPG.setId(id);
    updatedPG.setOwnerId(ownerId);
    updatedPG.setApprovalStatus("PENDING");

    pgRepository.save(updatedPG);

    return "PG updated successfully";
    }
    public String deletePG(String id, String ownerId) {

    if (!pgRepository.existsByIdAndOwnerId(id, ownerId)) {
        return "PG not found or access denied";
    }

    pgRepository.deleteByIdAndOwnerId(id, ownerId);

    return "PG deleted successfully";
   }
   public String uploadImages(String pgId, MultipartFile[] images) throws IOException {

    
    PG pg = pgRepository.findById(pgId).orElse(null);

    if (pg == null) {
        return "PG not found";
    }

    if (pg.getImages().size() + images.length > 3) {
    return "A PG can have a maximum of 3 images.";
    }

    for (MultipartFile image : images) {
        String contentType = image.getContentType();

    if (contentType == null || !contentType.startsWith("image/")) {
    return "Only image files are allowed.";
    }

    if (image.getSize() > 5 * 1024 * 1024) {
    return "Image size must not exceed 5 MB.";
    }  

        PGImage uploadedImage = cloudinaryService.uploadImage(image);

        pg.getImages().add(uploadedImage);
    }

    pgRepository.save(pg);

    return "Images uploaded successfully";
    }
    public String deleteImage(String pgId, String publicId) throws IOException {

    PG pg = pgRepository.findById(pgId).orElse(null);

    if (pg == null) {
        return "PG not found";
    }

    // Delete from Cloudinary
    cloudinaryService.deleteImage(publicId);

    // Remove from MongoDB
    pg.getImages().removeIf(image -> image.getPublicId().equals(publicId));

    // Save updated PG
    pgRepository.save(pg);

    return "Image deleted successfully";
    }
    // Replacr images
    public String replaceImage(String pgId,
                           String publicId,
                           MultipartFile newImage) throws IOException {

    PG pg = pgRepository.findById(pgId).orElse(null);

    if (pg == null) {
        return "PG not found";
    }

    // Validate file type
    String contentType = newImage.getContentType();

    if (contentType == null || !contentType.startsWith("image/")) {
        return "Only image files are allowed.";
    }

    // Validate file size
    if (newImage.getSize() > 5 * 1024 * 1024) {
        return "Image size must not exceed 5 MB.";
    }

    // Delete old image from Cloudinary
    cloudinaryService.deleteImage(publicId);

    // Upload new image
    PGImage uploadedImage = cloudinaryService.uploadImage(newImage);

    // Replace in MongoDB
    for (int i = 0; i < pg.getImages().size(); i++) {

        if (pg.getImages().get(i).getPublicId().equals(publicId)) {

            pg.getImages().set(i, uploadedImage);
            break;
        }
    }

    pgRepository.save(pg);

    return "Image replaced successfully";
}
}