package com.studentpg.modules.admin.controller;

import com.studentpg.modules.admin.dto.request.RejectOwnerVerificationRequest;
import com.studentpg.modules.admin.dto.response.OwnerVerificationAdminResponse;
import com.studentpg.modules.admin.service.AdminService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/owner-verifications")
@PreAuthorize("hasRole('ADMIN')")
public class OwnerVerificationAdminController {

    private final AdminService adminService;

    public OwnerVerificationAdminController(AdminService adminService) {
        this.adminService = adminService;
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
}