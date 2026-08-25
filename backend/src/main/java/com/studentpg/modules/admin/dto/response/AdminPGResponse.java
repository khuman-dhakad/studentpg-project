package com.studentpg.modules.admin.dto.response;

import java.time.Instant;

public record AdminPGResponse(

        String id,

        String pgName,

        String city,

        String approvalStatus,

        String ownerId,

        String ownerName,

        String ownerEmail,

        Instant submittedAt,

        Instant approvedAt,

        String approvedBy,

        Instant rejectedAt,

        String rejectedBy,

        String rejectionReason

) {
}