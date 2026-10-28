package com.studentpg.modules.admin.controller;

import com.studentpg.modules.admin.dto.request.RejectOwnerVerificationRequest;
import com.studentpg.modules.admin.dto.response.OwnerVerificationAdminResponse;
import com.studentpg.modules.admin.service.AdminService;
import com.studentpg.modules.owner.service.OwnerKycMigrationService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/owner-verifications")
@PreAuthorize("hasRole('ADMIN')")
public class OwnerVerificationAdminController {

    private final AdminService adminService;
    private final OwnerKycMigrationService kycMigrationService;

    @Autowired
    public OwnerVerificationAdminController(
            AdminService adminService,
            OwnerKycMigrationService kycMigrationService
    ) {
        this.adminService = adminService;
        this.kycMigrationService = kycMigrationService;
    }

    public OwnerVerificationAdminController(AdminService adminService) {
        this(adminService, null);
    }

    @GetMapping
    public List<OwnerVerificationAdminResponse> getVerifications(
            @RequestParam(defaultValue = "PENDING") String status) {
        return adminService.getOwnerVerifications(status);
    }

    @GetMapping("/{ownerId}/document")
    public ResponseEntity<ByteArrayResource> getDocument(@PathVariable String ownerId) {
        AdminService.VerificationDocument document = adminService.getVerificationDocument(ownerId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + document.filename() + "\"")
                .body(new ByteArrayResource(document.data()));
    }

    @PatchMapping("/{ownerId}/approve")
    public ResponseEntity<String> approve(@PathVariable String ownerId) {
        return ResponseEntity.ok(adminService.approveOwnerVerification(ownerId));
    }

    @PatchMapping("/{ownerId}/reject")
    public ResponseEntity<String> reject(
            @PathVariable String ownerId,
            @Valid @RequestBody RejectOwnerVerificationRequest request) {
        return ResponseEntity.ok(adminService.rejectOwnerVerification(ownerId, request.reason()));
    }

    @PostMapping("/migrate-legacy")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> migrateLegacyKyc() {
        if (kycMigrationService == null) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("success", false, "message", "KYC migration service is unavailable."));
        }
        try {
            OwnerKycMigrationService.MigrationSummary summary = kycMigrationService.migrateAllLegacyKycDocuments();
            return ResponseEntity.ok(summary);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Migration execution failed."));
        }
    }
}
