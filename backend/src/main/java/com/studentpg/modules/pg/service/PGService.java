package com.studentpg.modules.pg.service;

import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.entity.VerificationStatus;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.entity.PGImage;
import com.studentpg.modules.pg.repository.PGRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.Objects;
import com.studentpg.modules.pg.entity.ApprovalStatus;
import com.studentpg.modules.pg.entity.Category;
import com.studentpg.modules.pg.entity.Gender;
import com.studentpg.modules.pg.entity.RoomType;


import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class PGService {

private final PGRepository pgRepository;
private final OwnerRepository ownerRepository;
private final CloudinaryService cloudinaryService;



    /*
     * ============================================================
     * AUTHENTICATED OWNER HELPER
     * ============================================================
     */

    private Owner getAuthenticatedOwner() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (
    authentication == null
    || !authentication.isAuthenticated()
    || "anonymousUser".equals(authentication.getPrincipal())
    || authentication.getName() == null
    || authentication.getName().isBlank()
) {
            return null;
        }

        return ownerRepository
                .findByEmailIgnoreCase(
                        authentication.getName().trim()
                )
                .orElse(null);
    }


    /*
     * ============================================================
     * GET PG BY ID
     * ============================================================
     */

    public PG getPGById(String id) {
        return pgRepository
                .findById(id)
                .orElse(null);
    }


    /*
     * ============================================================
     * ADD PG
     * ============================================================
     */

    public String addPG(PG pg) {

        if (pg == null) {
            return "PG data is required.";
        }

        Owner owner = getAuthenticatedOwner();

        if (owner == null) {
            throw new SecurityException("Authentication required.");
        }

        if (!owner.isActive()) {
            throw new SecurityException("Account is disabled.");
        }

                if (owner.getVerificationStatus() != VerificationStatus.VERIFIED) {
                        throw new IllegalStateException("Please verify yourself, then list your PG.");
                }

        if (owner.getId() == null || owner.getId().isBlank()) {
            return "Authenticated owner not found.";
        }
        /*
         * NEVER TRUST ownerId FROM FRONTEND
         */

        pg.setOwnerId(owner.getId());
        // Creation must never reuse a client-supplied Mongo document id.
        pg.setId(null);


        /*
         * NEW PG ALWAYS REQUIRES APPROVAL
         */

        pg.setApprovalStatus(
ApprovalStatus.PENDING
);
        pg.setSubmittedAt(Instant.now());



        /*
         * MINIMUM 5 IMAGES
         */

        if (pg.getImages() == null || pg.getImages().size() < 5
        ) {
            return "At least 5 images are required.";
        }


        pgRepository.save(pg);

        return "PG added successfully. Waiting for admin approval.";
    }


    /*
     * ============================================================
     * GET OWNER PGs
     * ============================================================
     */

    public org.springframework.data.domain.Page<PG> getOwnerPGs(
            org.springframework.data.domain.Pageable pageable
    ) {

       Owner owner = getAuthenticatedOwner();

       if (owner == null) {
           throw new SecurityException("Authentication required.");
       }

       if (owner.getId() == null || owner.getId().isBlank()) {
           return Page.empty(pageable);
       }

       if (!owner.isActive()) {
           throw new SecurityException("Account is disabled.");
       }

        return pgRepository.findByOwnerId(
                owner.getId(),
                pageable
        );
    }


    /*
     * ============================================================
     * UPDATE PG
     *
     * IMPORTANT:
     *
     * OLD PG
     *    +
     * NEW PG
     *    ↓
     * COMPARE
     *
     * NO CHANGE
     *    ↓
     * STATUS UNCHANGED
     *
     * ACTUAL CHANGE
     *    ↓
     * STATUS = PENDING
     * ============================================================
     */

    @CacheEvict(
            value = "approvedPgs",
            allEntries = true
    )
    public String updatePG(
            String id,
            PG updatedPG
    ) {

        if (updatedPG == null) {
            return "PG data is required.";
        }


        /*
         * AUTHENTICATED OWNER
         */

        Owner owner = getAuthenticatedOwner();

        if (owner == null) {
    throw new SecurityException("Authentication required.");
}
if (!owner.isActive()) {
    throw new SecurityException("Account is disabled.");
}

        /*
         * FIND EXISTING PG
         */

        PG existingPG = pgRepository
                .findById(id)
                .orElse(null);

        if (existingPG == null) {
            throw new IllegalArgumentException("PG not found.");
        }


        /*
         * OWNERSHIP CHECK
         */

        if (
                !owner.getId()
                        .equals(existingPG.getOwnerId())
        ) {
           throw new SecurityException("Access denied.");       
        }


        /*
         * ========================================================
         * STEP 1
         * CHECK WHETHER ACTUAL CHANGE EXISTS
         * ========================================================
         */

        boolean changed =
                hasPGChanged(
                        existingPG,
                        updatedPG
                );


        /*
         * ========================================================
         * STEP 2
         * MINIMUM 5 IMAGES
         * ========================================================
         */

        if (
                updatedPG.getImages() == null
                        || updatedPG.getImages().size() < 5
        ) {
            return "At least 5 images are required.";
        }


        /*
         * ========================================================
         * STEP 3
         * UPDATE ONLY OWNER-EDITABLE FIELDS
         * ========================================================
         */

        existingPG.setPgName(
                updatedPG.getPgName()
        );

        existingPG.setDescription(
                updatedPG.getDescription()
        );

        existingPG.setGender(
                updatedPG.getGender()
        );

        existingPG.setRoomType(
                updatedPG.getRoomType()
        );

        existingPG.setCategory(
                updatedPG.getCategory()
        );


        /*
         * ========================================================
         * AMENITIES
         * ========================================================
         */

        existingPG.setFoodAvailable(
                updatedPG.isFoodAvailable()
        );

        existingPG.setWifiAvailable(
                updatedPG.isWifiAvailable()
        );

        existingPG.setParkingAvailable(
                updatedPG.isParkingAvailable()
        );

        existingPG.setLaundryAvailable(
                updatedPG.isLaundryAvailable()
        );

        existingPG.setAcAvailable(
                updatedPG.isAcAvailable()
        );

        existingPG.setPowerBackup(
                updatedPG.isPowerBackup()
        );


        /*
         * ========================================================
         * LOCATION
         * ========================================================
         */

        existingPG.setAddress(
                updatedPG.getAddress()
        );

        existingPG.setCity(
                updatedPG.getCity()
        );

        existingPG.setState(
                updatedPG.getState()
        );

        existingPG.setPincode(
                updatedPG.getPincode()
        );

        existingPG.setLandmark(
                updatedPG.getLandmark()
        );


        /*
         * ========================================================
         * PRICING
         * ========================================================
         */

        existingPG.setRent(
                updatedPG.getRent()
        );

        existingPG.setSecurityDeposit(
                updatedPG.getSecurityDeposit()
        );

        existingPG.setNoticePeriod(
                updatedPG.getNoticePeriod()
        );


        /*
         * ========================================================
         * IMAGES
         * ========================================================
         */

        existingPG.setImages(
                updatedPG.getImages()
        );


        /*
         * ========================================================
         * STATUS DECISION
         * ========================================================
         *
         * changed = false
         *     → KEEP OLD STATUS
         *
         * changed = true
         *     → PENDING
         * ========================================================
         */

        if (changed) {

            existingPG.setApprovalStatus(ApprovalStatus.PENDING);
            pgRepository.save(existingPG);

            return "PG updated successfully. Waiting for admin approval.";
        }


        /*
         * NO CHANGE
         *
         * IMPORTANT:
         * approvalStatus is NOT modified.
         */

        pgRepository.save(existingPG);

        return "No changes detected. PG status remains unchanged.";
    }


    /*
     * ============================================================
     * CHANGE DETECTION
     * ============================================================
     */

    private boolean hasPGChanged(
            PG oldPG,
            PG newPG
    ) {


        /*
         * BASIC DETAILS
         */

        if (
                !Objects.equals(
                        oldPG.getPgName(),
                        newPG.getPgName()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getDescription(),
                        newPG.getDescription()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getGender(),
                        newPG.getGender()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getRoomType(),
                        newPG.getRoomType()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getCategory(),
                        newPG.getCategory()
                )
        ) {
            return true;
        }


        /*
         * AMENITIES
         */

        if (
                oldPG.isFoodAvailable()
                        != newPG.isFoodAvailable()
        ) {
            return true;
        }


        if (
                oldPG.isWifiAvailable()
                        != newPG.isWifiAvailable()
        ) {
            return true;
        }


        if (
                oldPG.isParkingAvailable()
                        != newPG.isParkingAvailable()
        ) {
            return true;
        }


        if (
                oldPG.isLaundryAvailable()
                        != newPG.isLaundryAvailable()
        ) {
            return true;
        }


        if (
                oldPG.isAcAvailable()
                        != newPG.isAcAvailable()
        ) {
            return true;
        }


        if (
                oldPG.isPowerBackup()
                        != newPG.isPowerBackup()
        ) {
            return true;
        }


        /*
         * LOCATION
         */

        if (
                !Objects.equals(
                        oldPG.getAddress(),
                        newPG.getAddress()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getCity(),
                        newPG.getCity()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getState(),
                        newPG.getState()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getPincode(),
                        newPG.getPincode()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getLandmark(),
                        newPG.getLandmark()
                )
        ) {
            return true;
        }


        /*
         * PRICING
         */

        if (
                !Objects.equals(
                        oldPG.getRent(),
                        newPG.getRent()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getSecurityDeposit(),
                        newPG.getSecurityDeposit()
                )
        ) {
            return true;
        }


        if (
                !Objects.equals(
                        oldPG.getNoticePeriod(),
                        newPG.getNoticePeriod()
                )
        ) {
            return true;
        }


        /*
         * IMAGES
         */

        if (
                !Objects.equals(
                        oldPG.getImages(),
                        newPG.getImages()
                )
        ) {
            return true;
        }


        /*
         * NOTHING CHANGED
         */

        return false;
    }


    /*
     * ============================================================
     * DELETE PG
     * ============================================================
     */

    @CacheEvict(
            value = "approvedPgs",
            allEntries = true
    )
    public String deletePG(String id) {

        Owner owner = getAuthenticatedOwner();

        if (owner == null) {
    throw new SecurityException("Authentication required.");
}
if (!owner.isActive()) {
    throw new SecurityException("Account is disabled.");
}
        if (
                !pgRepository.existsByIdAndOwnerId(
                        id,
                        owner.getId()
                )
        ) {
            return "PG not found or access denied.";
        }

        pgRepository.deleteByIdAndOwnerId(
                id,
                owner.getId()
        );

        return "PG deleted successfully.";
    }


    /*
     * ============================================================
     * UPLOAD SINGLE IMAGE
     * ============================================================
     */

    public PGImage uploadSingleImage(MultipartFile image) throws IOException {
        Owner owner = getAuthenticatedOwner();
        if (owner == null) {
            throw new SecurityException("Authentication required.");
        }
        if (!owner.isActive()) {
            throw new SecurityException("Account is disabled.");
        }
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Empty image file is not allowed.");
        }
        String contentType = image.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed.");
        }
        if (image.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Image size must not exceed 5 MB.");
        }
        return cloudinaryService.uploadImage(image);
    }

    /*
     * ============================================================
     * UPLOAD IMAGES
     * ============================================================
     */

    public String uploadImages(
            String pgId,
            MultipartFile[] images
    ) throws IOException {


        Owner owner = getAuthenticatedOwner();

       if (owner == null) {
    throw new SecurityException("Authentication required.");
}
if (!owner.isActive()) {
    throw new SecurityException("Account is disabled.");
}

        if (
                images == null
                        || images.length == 0
        ) {
            return "At least one image is required.";
        }


        PG pg = pgRepository
                .findById(pgId)
                .orElse(null);

        if (pg == null) {
            throw new IllegalArgumentException("PG not found.");
        }


        if (
                !owner.getId()
                        .equals(pg.getOwnerId())
        ) {
            throw new SecurityException("Access denied.");
        }


        if (pg.getImages() == null) {
            return "PG image collection is not initialized.";
        }


        /*
         * IMPORTANT:
         *
         * Your requirement is minimum 5.
         *
         * There is NO maximum 3 here.
         */

        if (
                pg.getImages().size()
                        + images.length
                        > 10
        ) {
            return "A PG can have a maximum of 10 images.";
        }


        for (
                MultipartFile image : images
                ) {


            if (
                    image == null
                            || image.isEmpty()
            ) {
                return "Empty image file is not allowed.";
            }


            String contentType =
                    image.getContentType();


            if (
                    contentType == null
                            || !contentType
                            .toLowerCase()
                            .startsWith("image/")
            ) {
                return "Only image files are allowed.";
            }


            if (
                    image.getSize()
                            > 5 * 1024 * 1024
            ) {
                return "Image size must not exceed 5 MB.";
            }


            PGImage uploadedImage =
                    cloudinaryService
                            .uploadImage(image);


            pg.getImages()
                    .add(uploadedImage);
        }


        pgRepository.save(pg);

        return "Images uploaded successfully.";
    }


    /*
     * ============================================================
     * DELETE IMAGE
     *
     * IMPORTANT:
     *
     * Owner can delete images one by one.
     *
     * We DO NOT enforce minimum 5 here.
     *
     * Why?
     *
     * Example:
     *
     * Existing: 5
     * Delete 1
     * Current: 4
     *
     * Owner should now be able to upload
     * a replacement image before final update.
     *
     * Final minimum 5 validation happens in updatePG().
     * ============================================================
     */

    public String deleteImage(
            String pgId,
            String publicId
    ) throws IOException {


        Owner owner = getAuthenticatedOwner();

        if (owner == null) {
    throw new SecurityException("Authentication required.");
}

if (!owner.isActive()) {
    throw new SecurityException("Account is disabled.");
}
        PG pg = pgRepository
                .findById(pgId)
                .orElse(null);

        if (pg == null) {
            throw new IllegalArgumentException("PG not found.");
        }


        if (
                !owner.getId()
                        .equals(pg.getOwnerId())
        ) {
            throw new SecurityException("Access denied.");
        }


        if (
                pg.getImages() == null
                        || pg.getImages().isEmpty()
        ) {
            return "No images found.";
        }


        PGImage imageToDelete =
                pg.getImages()
                        .stream()
                        .filter(
                                image ->
                                        Objects.equals(
                                                image.getPublicId(),
                                                publicId
                                        )
                        )
                        .findFirst()
                        .orElse(null);


        if (imageToDelete == null) {
            return "Image not found.";
        }


        /*
         * DELETE FROM CLOUDINARY
         */

        cloudinaryService.deleteImage(
                imageToDelete.getPublicId()
        );


        /*
         * DELETE FROM DATABASE
         */

        pg.getImages()
                .removeIf(
                        image ->
                                Objects.equals(
                                        image.getPublicId(),
                                        publicId
                                )
                );


        pgRepository.save(pg);

        return "Image deleted successfully.";
    }


    /*
     * ============================================================
     * GET PG FOR OWNER
     * ============================================================
     */

    public PG getPGByIdForOwner(
            String id
    ) {

        Owner owner = getAuthenticatedOwner();

        if (owner == null) {
            throw new SecurityException(
        "Authentication required."
);
        }


        PG pg = pgRepository
        .findById(id)
        .orElseThrow(
                () ->
                        new IllegalArgumentException(
                                "PG not found."
                        )
        );


        if (
                !owner.getId()
                        .equals(pg.getOwnerId())
        ) {
            throw new SecurityException(
        "Access denied."
                );
        }


        return pg;
    }


    /*
     * ============================================================
     * REPLACE IMAGE
     * ============================================================
     */

    public String replaceImage(
            String pgId,
            String publicId,
            MultipartFile newImage
    ) throws IOException {


        Owner owner = getAuthenticatedOwner();

        if (owner == null) {
    throw new SecurityException("Authentication required.");
}
if (!owner.isActive()) {
    throw new SecurityException("Account is disabled.");
}

        PG pg = pgRepository
                .findById(pgId)
                .orElse(null);

        if (pg == null) {
            throw new IllegalArgumentException("PG not found.");
        }


        if (
                !owner.getId()
                        .equals(pg.getOwnerId())
        ) {
           throw new SecurityException("Access denied.");
        }


        PGImage existingImage =
                pg.getImages()
                        .stream()
                        .filter(
                                image ->
                                        Objects.equals(
                                                image.getPublicId(),
                                                publicId
                                        )
                        )
                        .findFirst()
                        .orElse(null);


        if (existingImage == null) {
            return "Image not found.";
        }


        if (
                newImage == null
                        || newImage.isEmpty()
        ) {
            return "New image is required.";
        }


        String contentType =
                newImage.getContentType();


        if (
                contentType == null
                        || !contentType
                        .toLowerCase()
                        .startsWith("image/")
        ) {
            return "Only image files are allowed.";
        }


        if (
                newImage.getSize()
                        > 5 * 1024 * 1024
        ) {
            return "Image size must not exceed 5 MB.";
        }


        /*
         * UPLOAD NEW IMAGE FIRST
         */

        PGImage uploadedImage =
                cloudinaryService
                        .uploadImage(newImage);


        int imageIndex =
                pg.getImages()
                        .indexOf(existingImage);


        pg.getImages()
                .set(
                        imageIndex,
                        uploadedImage
                );


        pgRepository.save(pg);
        /*
         * DELETE OLD IMAGE AFTER DATABASE UPDATE
         */

        cloudinaryService.deleteImage(
                existingImage.getPublicId()
        );


        return "Image replaced successfully.";
    }
}