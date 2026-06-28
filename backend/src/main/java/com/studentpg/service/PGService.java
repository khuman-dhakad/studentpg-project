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
import com.studentpg.model.Owner;
import com.studentpg.repository.OwnerRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.studentpg.model.Owner;
import com.studentpg.repository.OwnerRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@Service
public class PGService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public String addPG(PG pg) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    Owner owner = ownerRepository.findByEmail(email);

    pg.setOwnerId(owner.getId());
    pg.setApprovalStatus("PENDING");

    pgRepository.save(pg);

    return "PG added successfully. Waiting for admin approval.";
}
    public List<PG> getOwnerPGs() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    Owner owner = ownerRepository.findByEmail(email);

    return pgRepository.findByOwnerId(owner.getId());
}
public String updatePG(String id, PG updatedPG) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    Owner owner = ownerRepository.findByEmail(email);

    if (!pgRepository.existsByIdAndOwnerId(id, owner.getId())) {
        return "PG not found or access denied";
    }

    updatedPG.setId(id);
    updatedPG.setOwnerId(owner.getId());
    updatedPG.setApprovalStatus("PENDING");

    pgRepository.save(updatedPG);

    return "PG updated successfully";
}
   public String deletePG(String id) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    Owner owner = ownerRepository.findByEmail(email);

    if (!pgRepository.existsByIdAndOwnerId(id, owner.getId())) {
        return "PG not found or access denied";
    }

    pgRepository.deleteByIdAndOwnerId(id, owner.getId());

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