package com.studentpg.modules.admin.service;

import com.studentpg.modules.notification.service.NotificationService;
import com.studentpg.modules.pg.entity.ApprovalStatus;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.repository.PGRepository;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AdminService {

    private final PGRepository pgRepository;

    private final NotificationService notificationService;


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

            NotificationService notificationService

    ) {

        this.pgRepository =
                pgRepository;

        this.notificationService =
                notificationService;
    }


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