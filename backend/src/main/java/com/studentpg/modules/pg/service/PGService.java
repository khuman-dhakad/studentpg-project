package com.studentpg.modules.pg.service;

import org.springframework.cache.annotation.CacheEvict;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.entity.PGImage;
import com.studentpg.modules.pg.repository.PGRepository;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class PGService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public PG getPGById(String id) {
        PG pg = pgRepository.findById(id).orElse(null);

        if (pg != null) {
            if (pg.getOwnerId() != null && !pg.getOwnerId().trim().isEmpty()) {

                Owner owner = ownerRepository.findById(pg.getOwnerId()).orElse(null);

                if (owner == null) {
                    owner = ownerRepository.findAll().stream()
                            .filter(o -> o.getId() != null && o.getId().trim().equalsIgnoreCase(pg.getOwnerId().trim()))
                            .findFirst()
                            .orElse(null);
                }

                if (owner != null) {
                    owner.setPassword(null);
                    pg.setOwner(owner);
                } else {
                    pg.setOwner(null);
                }
            } else {
                pg.setOwner(null);
            }
        }
        return pg;
    }

    public String addPG(PG pg) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Owner owner = ownerRepository.findByEmail(email);

        pg.setOwnerId(owner.getId());
        pg.setApprovalStatus("PENDING");
        pgRepository.save(pg);

        return "PG added successfully. Waiting for admin approval.";
    }

    public org.springframework.data.domain.Page<PG> getOwnerPGs(org.springframework.data.domain.Pageable pageable) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Owner owner = ownerRepository.findByEmail(email);

            return pgRepository.findByOwnerId(owner.getId(), pageable);
        }
    @CacheEvict(value = "approvedPgs", allEntries = true)
    public String updatePG(String id, PG updatedPG) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
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
    @CacheEvict(value = "approvedPgs", allEntries = true)
    public String deletePG(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
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

        cloudinaryService.deleteImage(publicId);
        pg.getImages().removeIf(image -> image.getPublicId().equals(publicId));
        pgRepository.save(pg);

        return "Image deleted successfully";
    }

    public String replaceImage(String pgId, String publicId, MultipartFile newImage) throws IOException {
        PG pg = pgRepository.findById(pgId).orElse(null);

        if (pg == null) {
            return "PG not found";
        }

        String contentType = newImage.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            return "Only image files are allowed.";
        }

        if (newImage.getSize() > 5 * 1024 * 1024) {
            return "Image size must not exceed 5 MB.";
        }

        cloudinaryService.deleteImage(publicId);
        PGImage uploadedImage = cloudinaryService.uploadImage(newImage);

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