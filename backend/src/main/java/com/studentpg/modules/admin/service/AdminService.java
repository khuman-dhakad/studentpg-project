package com.studentpg.modules.admin.service;

import com.studentpg.modules.notification.service.NotificationService;
import com.studentpg.modules.pg.entity.ApprovalStatus;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.repository.PGRepository;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.entity.VerificationStatus;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.modules.admin.dto.response.OwnerVerificationAdminResponse;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AdminService {

    private final PGRepository pgRepository;

    private final NotificationService notificationService;
        private final OwnerRepository ownerRepository;


    /*
     * ============================================================
     * APPROVAL STATUS CONSTANTS
     * ============================================================
     */

//     private static final String STATUS_PENDING =
//             "PENDING";

//     private static final String STATUS_APPROVED =
//             "APPROVED";

//     private static final String STATUS_REJECTED =
//             "REJECTED";


    /*
     * ============================================================
     * CONSTRUCTOR
     * ============================================================
     */

    public AdminService(

            PGRepository pgRepository,

            NotificationService notificationService,
            OwnerRepository ownerRepository

    ) {

        this.pgRepository =
                pgRepository;

        this.notificationService =
                notificationService;
                this.ownerRepository = ownerRepository;
    }

        public List<OwnerVerificationAdminResponse> getOwnerVerifications(String status) {
                VerificationStatus requestedStatus;
                try {
                        requestedStatus = VerificationStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
                } catch (Exception exception) {
                        throw new IllegalArgumentException("Invalid verification status.");
                }

                return ownerRepository.findAll().stream()
                                .filter(owner -> owner.getVerificationStatus() == requestedStatus)
                                .map(this::toOwnerVerificationResponse)
                                .toList();
        }

        public VerificationDocument getVerificationDocument(String ownerId) {
                Owner owner = ownerRepository.findById(ownerId)
                                .orElseThrow(() -> new IllegalArgumentException("Owner not found."));
                if (owner.getVerificationDocumentData() == null
                                || owner.getVerificationDocumentData().length == 0) {
                        throw new IllegalArgumentException("Verification document not found.");
                }
                return new VerificationDocument(
                                owner.getVerificationDocumentData(),
                                owner.getVerificationDocumentContentType(),
                                owner.getVerificationDocumentFilename());
        }

        public String approveOwnerVerification(String ownerId) {
                Owner owner = getOwnerForVerificationReview(ownerId);
                owner.setVerificationStatus(VerificationStatus.VERIFIED);
                owner.setVerificationReviewedAt(Instant.now());
                owner.setVerifiedAt(Instant.now());
                owner.setVerificationReviewedBy(getCurrentAdminEmail());
                owner.setVerificationRejectionReason(null);
                ownerRepository.save(owner);
                notificationService.createOwnerVerificationApprovedNotification(owner.getId());
                return "Owner verification approved successfully.";
        }

        public String rejectOwnerVerification(String ownerId, String reason) {
                if (reason == null || reason.isBlank()) {
                        throw new IllegalArgumentException("Rejection reason is required.");
                }
                Owner owner = getOwnerForVerificationReview(ownerId);
                owner.setVerificationStatus(VerificationStatus.REJECTED);
                owner.setVerificationReviewedAt(Instant.now());
                owner.setVerifiedAt(null);
                owner.setVerificationReviewedBy(getCurrentAdminEmail());
                owner.setVerificationRejectionReason(reason.trim());
                ownerRepository.save(owner);
                notificationService.createOwnerVerificationRejectedNotification(owner.getId(), reason);
                return "Owner verification rejected.";
        }

        private Owner getOwnerForVerificationReview(String ownerId) {
                Owner owner = ownerRepository.findById(ownerId)
                                .orElseThrow(() -> new IllegalArgumentException("Owner not found."));
                if (owner.getVerificationStatus() != VerificationStatus.PENDING) {
                        throw new IllegalStateException("Only pending owner verifications can be reviewed.");
                }
                return owner;
        }

        private OwnerVerificationAdminResponse toOwnerVerificationResponse(Owner owner) {
                return new OwnerVerificationAdminResponse(
                                owner.getId(), owner.getName(), owner.getEmail(), owner.getPhone(),
                                owner.getVerificationLegalName(), owner.getVerificationDocumentType(),
                                owner.getVerificationDocumentNumber(), owner.getVerificationDocumentUrl(),
                                owner.getVerificationStatus(), owner.getVerificationSubmittedAt(),
                                owner.getVerificationReviewedAt(), owner.getVerificationReviewedBy(),
                                owner.getVerificationRejectionReason());
        }

        public record VerificationDocument(byte[] data, String contentType, String filename) {}


    /*
     * ============================================================
     * GET CURRENT ADMIN IDENTITY
     * ============================================================
     */

    private String getCurrentAdminEmail() {

        Authentication authentication =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (

                authentication == null

                        ||

                !authentication.isAuthenticated()

        ) {

            throw new IllegalStateException(

                    "Authenticated admin not found"

            );
        }


        String adminEmail =

                authentication.getName();


        if (

                adminEmail == null

                        ||

                adminEmail.trim().isEmpty()

        ) {

            throw new IllegalStateException(

                    "Admin identity not found"

            );
        }


        return adminEmail
                .trim()
                .toLowerCase(Locale.ROOT);
    }


    /*
     * ============================================================
     * GET PENDING PGs
     * ============================================================
     */

    public Page<PG> getPendingPGs(

            Pageable pageable

    ) {

        return pgRepository.findByApprovalStatus(
                ApprovalStatus.PENDING,

                pageable

        );
    }


    /*
     * ============================================================
     * APPROVE PG
     * ============================================================
     */

    @CacheEvict(

            value = "approvedPgs",

            allEntries = true

    )
    public String approvePG(

            String id

    ) {


        /*
         * VALIDATE ID
         */

        if (

                id == null

                        ||

                id.trim().isEmpty()

        ) {

            return "PG ID is required";
        }


        /*
         * GET PG
         */

       PG pg = pgRepository
        .findById(id.trim())
        .orElseThrow(() ->
                new IllegalArgumentException("PG not found.")
        );


        /*
         * ONLY PENDING PG CAN BE APPROVED
         */

        

                if (pg.getApprovalStatus() != ApprovalStatus.PENDING) {

    return "Only pending PG listings can be approved";

}


        /*
         * GET ACTUAL LOGGED-IN ADMIN
         */

        String adminEmail =

                getCurrentAdminEmail();


        /*
         * APPROVAL STATUS
         */

       pg.setApprovalStatus(ApprovalStatus.APPROVED);


        /*
         * APPROVAL AUDIT
         */

        pg.setApprovedBy(

                adminEmail

        );

        pg.setApprovedAt(

                Instant.now()

        );


        /*
         * CLEAR PREVIOUS REJECTION DATA
         */

        pg.setRejectionReason(

                null

        );

        pg.setRejectedAt(

                null

        );

        pg.setRejectedBy(

                null

        );


        /*
         * SAVE PG
         */

        pgRepository.save(

                pg

        );


        /*
         * NOTIFY OWNER
         *
         * APPROVED PG DOES NOT NEED
         * REJECTION REASON.
         */

        notificationService

                .createPGApprovedNotification(

                        new NotificationService.PGNotificationData(

                                pg.getOwnerId(),

                                pg.getId(),

                                pg.getPgName(),

                                null

                        )

                );


        return "PG approved successfully";
    }


    /*
     * ============================================================
     * REJECT PG
     * ============================================================
     */

    @CacheEvict(

            value = "approvedPgs",

            allEntries = true

    )
    public String rejectPG(

            String id,

            String reason

    ) {


        /*
         * VALIDATE ID
         */

        if (

                id == null

                        ||

                id.trim().isEmpty()

        ) {

            return "PG ID is required";
        }


        /*
         * VALIDATE REASON
         */

        if (

                reason == null

                        ||

                reason.trim().isEmpty()

        ) {

            return "Rejection reason is required";
        }


        /*
         * GET PG
         */

       PG pg = pgRepository
        .findById(id.trim())
        .orElseThrow(() ->
                new IllegalArgumentException("PG not found.")
        );

        /*
         * ONLY PENDING PG CAN BE REJECTED
         */

        if (pg.getApprovalStatus() != ApprovalStatus.PENDING) {

    return "Only pending PG listings can be rejected";

} 


        /*
         * GET ACTUAL LOGGED-IN ADMIN
         */

        String adminEmail =

                getCurrentAdminEmail();


        /*
         * SET REJECTION STATUS
         */

        pg.setApprovalStatus(ApprovalStatus.REJECTED);


        /*
         * SAVE REJECTION DATA
         */

        pg.setRejectionReason(

                reason.trim()

        );

        pg.setRejectedAt(

                Instant.now()

        );

        pg.setRejectedBy(

                adminEmail

        );


        /*
         * CLEAR APPROVAL DATA
         */

        pg.setApprovedBy(

                null

        );

        pg.setApprovedAt(

                null

        );


        /*
         * SAVE PG
         */

        pgRepository.save(

                pg

        );


        /*
         * NOTIFY OWNER
         *
         * IMPORTANT:
         *
         * YAHAN:
         *
         * pg.getRejectionReason()
         *
         * PASS HOGA.
         */

        notificationService

                .createPGRejectedNotification(

                        new NotificationService.PGNotificationData(

                                pg.getOwnerId(),

                                pg.getId(),

                                pg.getPgName(),

                                pg.getRejectionReason()

                        )

                );


        return "PG rejected successfully";
    }


    /*
     * ============================================================
     * ADMIN STATS
     * ============================================================
     */

    public Map<String, Long> getAdminStats() {

        Map<String, Long> stats =

                new HashMap<>();


        stats.put(

                "total",

                pgRepository.count()

        );


        stats.put(

                "approved",

                pgRepository.countByApprovalStatus(
                                ApprovalStatus.APPROVED
                        )

        );


        stats.put(

                "pending",

                pgRepository.countByApprovalStatus(

                        ApprovalStatus.PENDING

                )

        );


        stats.put(

                "rejected",

                pgRepository.countByApprovalStatus(

                     ApprovalStatus.REJECTED

                )

        );


        return stats;
    }


    /*
     * ============================================================
     * GET PGs BY STATUS
     * ============================================================
     */

  public Page<PG> getAllPGsByStatus(
        String status,
        Pageable pageable
) {

    if (status == null
            || status.trim().isEmpty()
            || status.equalsIgnoreCase("ALL")) {

        return pgRepository.findAll(pageable);
    }

    String normalizedStatus =
            status.trim().toUpperCase(Locale.ROOT);

    ApprovalStatus approvalStatus;

    try {
        approvalStatus = ApprovalStatus.valueOf(normalizedStatus);
    } catch (IllegalArgumentException e) {
        return Page.empty(pageable);
    }

    return pgRepository.findByApprovalStatus(
            approvalStatus,
            pageable
    );
}public PG getPGById(String id) {

    if (id == null || id.trim().isBlank()) {
        throw new IllegalArgumentException("PG ID is required.");
    }

    return pgRepository
            .findById(id.trim())
            .orElseThrow(() ->
                    new IllegalArgumentException("PG not found.")
            );
}




@CacheEvict(
        value = "approvedPgs",
        allEntries = true
)
public String deletePG(String id) {

    if (id == null || id.trim().isBlank()) {
        throw new IllegalArgumentException("PG ID is required.");
    }

    PG pg = pgRepository
            .findById(id.trim())
            .orElseThrow(() ->
                    new IllegalArgumentException("PG not found.")
            );

    pgRepository.delete(pg);

    return "PG deleted successfully.";
}

    /*
     * ============================================================
     * SEARCH SUGGESTIONS
     * ============================================================
     */

   public List<String> getSearchSuggestions(
        String query
) {

    if (query == null || query.trim().isBlank()) {
        return List.of();
    }

    return pgRepository
        .findTop8ByApprovalStatusAndPgNameContainingIgnoreCase(
        ApprovalStatus.APPROVED,
        query.trim()
)
        .stream()
        .map(PG::getPgName)
        .distinct()
        .toList();
}
}