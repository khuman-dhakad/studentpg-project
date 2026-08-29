package com.studentpg.modules.admin.dto.response;

import com.studentpg.modules.owner.entity.VerificationStatus;
import java.time.Instant;

public record OwnerVerificationAdminResponse(
        String ownerId,
        String name,
        String email,
        String phone,
        String legalName,
        String documentType,
        String documentNumber,
        String documentUrl,
        VerificationStatus verificationStatus,
        Instant submittedAt,
        Instant reviewedAt,
        String reviewedBy,
        String rejectionReason
) {}