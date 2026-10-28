package com.studentpg.modules.admin.controller;

import com.studentpg.modules.admin.dto.response.OwnerVerificationAdminResponse;
import com.studentpg.modules.admin.service.AdminService;
import com.studentpg.modules.owner.entity.VerificationStatus;
import com.studentpg.modules.owner.service.OwnerKycMigrationService;
import com.studentpg.modules.owner.service.OwnerKycMigrationService.MigrationSummary;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.lang.reflect.Method;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@DisplayName("OwnerVerificationAdminController Tests")
class OwnerVerificationAdminControllerTest {

    private AdminService adminService;
    private OwnerKycMigrationService migrationService;
    private OwnerVerificationAdminController controller;

    @BeforeEach
    void setUp() {
        adminService = mock(AdminService.class);
        migrationService = mock(OwnerKycMigrationService.class);
        controller = new OwnerVerificationAdminController(adminService, migrationService);

        // Authenticate as Admin
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "admin@studentpg.com",
                        "password",
                        List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                )
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Controller class and migration endpoint enforce @PreAuthorize hasRole('ADMIN')")
    void controllerHasAdminRoleAnnotation() throws NoSuchMethodException {
        PreAuthorize classPreAuth = OwnerVerificationAdminController.class.getAnnotation(PreAuthorize.class);
        assertThat(classPreAuth).isNotNull();
        assertThat(classPreAuth.value()).isEqualTo("hasRole('ADMIN')");

        Method migrateMethod = OwnerVerificationAdminController.class.getMethod("migrateLegacyKyc");
        PreAuthorize methodPreAuth = migrateMethod.getAnnotation(PreAuthorize.class);
        assertThat(methodPreAuth).isNotNull();
        assertThat(methodPreAuth.value()).isEqualTo("hasRole('ADMIN')");
    }

    @Test
    @DisplayName("POST /migrate-legacy returns 200 OK with safe MigrationSummary when authorized")
    void migrateLegacyKyc_authorizedAdmin_returns200WithSummary() {
        MigrationSummary summary = new MigrationSummary(
                true,
                10,
                8,
                1,
                1,
                "Legacy KYC migration completed successfully."
        );
        when(migrationService.migrateAllLegacyKycDocuments()).thenReturn(summary);

        ResponseEntity<?> response = controller.migrateLegacyKyc();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(MigrationSummary.class);

        MigrationSummary body = (MigrationSummary) response.getBody();
        assertThat(body.success()).isTrue();
        assertThat(body.totalScanned()).isEqualTo(10);
        assertThat(body.successfullyMigrated()).isEqualTo(8);
        assertThat(body.failedCount()).isEqualTo(1);
        assertThat(body.skippedCount()).isEqualTo(1);
        assertThat(body.message()).isEqualTo("Legacy KYC migration completed successfully.");

        // Verify summary contains NO sensitive PII or secrets
        String summaryStr = body.toString();
        assertThat(summaryStr).doesNotContain("password");
        assertThat(summaryStr).doesNotContain("secret");
        assertThat(summaryStr).doesNotContain("cloudinary");
        assertThat(summaryStr).doesNotContain("token");
    }

    @Test
    @DisplayName("POST /migrate-legacy returns 409 Conflict when another migration is already running")
    void migrateLegacyKyc_conflictWhenAlreadyInProgress() {
        when(migrationService.migrateAllLegacyKycDocuments())
                .thenThrow(new IllegalStateException("KYC migration is already in progress."));

        ResponseEntity<?> response = controller.migrateLegacyKyc();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isInstanceOf(Map.class);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body.get("success")).isEqualTo(false);
        assertThat(body.get("message")).isEqualTo("KYC migration is already in progress.");
    }

    @Test
    @DisplayName("POST /migrate-legacy returns 503 when migration service is null")
    void migrateLegacyKyc_serviceUnavailable() {
        OwnerVerificationAdminController controllerWithoutService =
                new OwnerVerificationAdminController(adminService, null);

        ResponseEntity<?> response = controllerWithoutService.migrateLegacyKyc();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(response.getBody()).isInstanceOf(Map.class);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body.get("success")).isEqualTo(false);
        assertThat(body.get("message")).isEqualTo("KYC migration service is unavailable.");
    }

    @Test
    @DisplayName("POST /migrate-legacy returns 500 without leaking sensitive exception details")
    void migrateLegacyKyc_unexpectedExceptionHandledSafely() {
        when(migrationService.migrateAllLegacyKycDocuments())
                .thenThrow(new RuntimeException("Internal database timeout"));

        ResponseEntity<?> response = controller.migrateLegacyKyc();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isInstanceOf(Map.class);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body.get("success")).isEqualTo(false);
        assertThat(body.get("message")).isEqualTo("Migration execution failed.");
    }

    @Test
    @DisplayName("GET /{ownerId}/document streams bytes directly with inline Content-Disposition")
    void getDocumentStreamsDirectly() {
        byte[] docBytes = "%PDF-1.4 test".getBytes();
        when(adminService.getVerificationDocument("owner-123"))
                .thenReturn(new AdminService.VerificationDocument(docBytes, "application/pdf", "pan-card.pdf"));

        ResponseEntity<ByteArrayResource> response = controller.getDocument("owner-123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType().toString()).isEqualTo("application/pdf");
        assertThat(response.getHeaders().getFirst("Content-Disposition")).isEqualTo("inline; filename=\"pan-card.pdf\"");
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getByteArray()).isEqualTo(docBytes);
    }
}
