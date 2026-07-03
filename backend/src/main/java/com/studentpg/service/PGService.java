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

@Service
public class PGService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // =========================================================================
    // FULLY CRITICAL FIX: Database Mapping with Absolute Structural Fallbacks
    // =========================================================================
   // =========================================================================
    // REAL DATABASE MAPPING: No Mock Data, Pure DB Fetch
    // =========================================================================
  public PG getPGById(String id) {
        // 1. Student ne jis PG par click kiya, pehle use database se nikalenge
        PG pg = pgRepository.findById(id).orElse(null);
        
        if (pg != null) {
            System.out.println("=== STUDENT CLICK TRACE: FETCHING DETAILS FOR PG ID -> " + id);
            
            // 2. Agar us PG ke andar ownerId maujood hai
            if (pg.getOwnerId() != null && !pg.getOwnerId().trim().isEmpty()) {
                
                // 3. Database ke 'owners' collection mein us ID ke owner ko dhoondo
                Owner owner = ownerRepository.findById(pg.getOwnerId()).orElse(null);
                
                // 4. Fallback Stream: Agar ID format match ka koi issue ho, toh saare owners check karo
                if (owner == null) {
                    owner = ownerRepository.findAll().stream()
                            .filter(o -> o.getId() != null && o.getId().toString().trim().equalsIgnoreCase(pg.getOwnerId().trim()))
                            .findFirst()
                            .orElse(null);
                }

                // 5. SUCCESS: Real owner mil gaya! Use PG ke sath attach karo taaki student ko dikhe
                if (owner != null) {
                    owner.setPassword(null); // Security ke liye password hide kiya
                    pg.setOwner(owner);      // PG ke andar real owner ka data daal diya
                    System.out.println("=== AUTOMATIC SUCCESS: REAL OWNER CONNECTED -> " + owner.getName());
                } else {
                    System.out.println("=== ERROR: PG has ownerId but Owner not found in 'owners' collection.");
                    pg.setOwner(null);
                }
            } else {
                System.out.println("=== ERROR: This PG record does not have any ownerId attached.");
                pg.setOwner(null);
            }
        }
        return pg;
    }

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