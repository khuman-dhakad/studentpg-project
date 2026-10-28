package com.studentpg.modules.owner.service;

import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.modules.admin.dto.response.OwnerVerificationAdminResponse;
import com.studentpg.modules.admin.service.AdminService;
import com.studentpg.modules.notification.service.NotificationService;
import com.studentpg.modules.owner.dto.request.OwnerVerificationRequest;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.entity.VerificationStatus;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.entity.PGImage;
import com.studentpg.modules.pg.entity.UnassignedImageUpload;
import com.studentpg.modules.pg.repository.PGRepository;
import com.studentpg.modules.pg.repository.UnassignedImageUploadRepository;
import com.studentpg.modules.pg.service.PGService;
import org.bson.Document;
import org.bson.types.Binary;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OwnerVerificationSecurityRegressionTest {

    @Mock
    private OwnerRepository ownerRepository;

    @Mock
    private PGRepository pgRepository;

    @Mock
    private UnassignedImageUploadRepository unassignedImageUploadRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private MongoTemplate mongoTemplate;

    private OwnerService ownerService;
    private AdminService adminService;
    private PGService pgService;
    private OwnerKycMigrationService migrationService;

    private static final byte[] VALID_PDF_BYTES = new byte[]{'%', 'P', 'D', 'F', '-', '1', '.', '4', 0x0A};
    private static final byte[] VALID_PNG_BYTES = new byte[]{(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A};
        private static byte[] createValidImage(int width, int height, String format) throws Exception {
        java.awt.image.BufferedImage image = new java.awt.image.BufferedImage(width, height, java.awt.image.BufferedImage.TYPE_INT_RGB);
        java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
        javax.imageio.ImageIO.write(image, format, baos);
        return baos.toByteArray();
    }
    private static final byte[] VALID_JPEG_BYTES = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0};

    @BeforeEach
    void setUp() {
        ownerService = new OwnerService(
                ownerRepository,
                mock(com.studentpg.modules.admin.repository.AdminRepository.class),
                mock(com.studentpg.security.jwt.JwtService.class),
                cloudinaryService,
                mock(com.studentpg.infrastructure.email.EmailService.class),
                mock(org.springframework.security.crypto.password.PasswordEncoder.class)
        );

        adminService = new AdminService(
                pgRepository,
                notificationService,
                ownerRepository,
                cloudinaryService,
                mongoTemplate
        );

        pgService = new PGService(
                pgRepository,
                ownerRepository,
                cloudinaryService,
                unassignedImageUploadRepository
        );

        migrationService = new OwnerKycMigrationService(
                mongoTemplate,
                cloudinaryService
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void authenticateOwner(String email, String role) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                email,
                "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
    }

    @Nested
    @DisplayName("Priority 1: KYC Private Storage & Database Bloat Remediation (SPG-QA-007, SPG-QA-008)")
    class KycPrivateStorageTests {

        @Test
        @DisplayName("submitVerification uploads to authenticated Cloudinary and does NOT store raw binary in Owner entity")
        void submitVerificationStoresPrivateMetadataAndNullsRawBytes() throws Exception {
            Owner owner = new Owner();
            owner.setId("owner-123");
            owner.setEmail("host@example.com");
            owner.setActive(true);
            owner.setVerificationStatus(VerificationStatus.NOT_VERIFIED);

            authenticateOwner("host@example.com", "OWNER");
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.of(owner));

            when(cloudinaryService.uploadVerificationDocument(any())).thenReturn(Map.of(
                    "publicId", "studentpg/owner-verifications/abc-123",
                    "format", "pdf",
                    "resourceType", "image"
            ));

            OwnerVerificationRequest request = new OwnerVerificationRequest();
            request.setLegalName("Balwinder Singh");
            request.setDocumentType("PAN");
            request.setDocumentNumber("ABCDE1234F");

            MockMultipartFile file = new MockMultipartFile(
                    "document", "pan-card.pdf", "application/pdf", VALID_PDF_BYTES);

            String result = ownerService.submitVerification(request, file);

            assertThat(result).contains("Verification submitted successfully");
            assertThat(owner.getVerificationDocumentPublicId()).isEqualTo("studentpg/owner-verifications/abc-123");
            assertThat(owner.getVerificationDocumentFormat()).isEqualTo("pdf");
            assertThat(owner.getVerificationDocumentResourceType()).isEqualTo("image");
            assertThat(owner.getVerificationStatus()).isEqualTo(VerificationStatus.PENDING);
            // Critical: verificationDocumentData MUST be null so MongoDB never stores 5MB binary
            assertThat(owner.getVerificationDocumentData()).isNull();
            // Critical: verificationDocumentUrl MUST be null so no public CDN URL is exposed
            assertThat(owner.getVerificationDocumentUrl()).isNull();

            verify(ownerRepository).save(owner);
            verify(cloudinaryService).uploadVerificationDocument(any());
        }

        @Test
        @DisplayName("submitVerification deletes previous Cloudinary asset when re-submitting")
        void submitVerificationCleansUpPreviousPrivateAsset() throws Exception {
            Owner owner = new Owner();
            owner.setId("owner-123");
            owner.setEmail("host@example.com");
            owner.setActive(true);
            owner.setVerificationStatus(VerificationStatus.REJECTED);
            owner.setVerificationDocumentPublicId("studentpg/owner-verifications/old-doc-999");

            authenticateOwner("host@example.com", "OWNER");
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.of(owner));
            when(cloudinaryService.uploadVerificationDocument(any())).thenReturn(Map.of(
                    "publicId", "studentpg/owner-verifications/new-doc-100",
                    "format", "png",
                    "resourceType", "image"
            ));

            OwnerVerificationRequest request = new OwnerVerificationRequest();
            request.setLegalName("Balwinder Singh");
            request.setDocumentType("AADHAAR");
            request.setDocumentNumber("123456789012");

            MockMultipartFile file = new MockMultipartFile(
                    "document", "aadhaar.png", "image/png", VALID_PNG_BYTES);

            ownerService.submitVerification(request, file);

            verify(cloudinaryService).deleteVerificationDocument("studentpg/owner-verifications/old-doc-999");
        }

        @Test
        @DisplayName("submitVerification rejects files exceeding 5MB limit")
        void submitVerificationRejectsOversizedFiles() {
            Owner owner = new Owner();
            owner.setId("owner-123");
            owner.setEmail("host@example.com");
            owner.setActive(true);
            owner.setVerificationStatus(VerificationStatus.NOT_VERIFIED);

            authenticateOwner("host@example.com", "OWNER");
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.of(owner));

            OwnerVerificationRequest request = new OwnerVerificationRequest();
            request.setLegalName("Balwinder Singh");
            request.setDocumentType("PAN");
            request.setDocumentNumber("ABCDE1234F");

            // Mock file with size 5MB + 1 byte
            byte[] oversizedBytes = new byte[5 * 1024 * 1024 + 1];
            MockMultipartFile file = new MockMultipartFile(
                    "document", "large.pdf", "application/pdf", oversizedBytes);

            assertThatThrownBy(() -> ownerService.submitVerification(request, file))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("5 MB or smaller");

            verifyNoInteractions(cloudinaryService);
        }

        @Test
        @DisplayName("submitVerification rejects files with invalid magic byte signature")
        void submitVerificationRejectsInvalidMagicByteSignatures() {
            Owner owner = new Owner();
            owner.setId("owner-123");
            owner.setEmail("host@example.com");
            owner.setActive(true);
            owner.setVerificationStatus(VerificationStatus.NOT_VERIFIED);

            authenticateOwner("host@example.com", "OWNER");
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.of(owner));

            OwnerVerificationRequest request = new OwnerVerificationRequest();
            request.setLegalName("Balwinder Singh");
            request.setDocumentType("PAN");
            request.setDocumentNumber("ABCDE1234F");

            // Content-Type says application/pdf, but bytes are plain text/executable
            byte[] fakePdfBytes = "MZ...This is not a PDF".getBytes();
            MockMultipartFile file = new MockMultipartFile(
                    "document", "fake.pdf", "application/pdf", fakePdfBytes);

            assertThatThrownBy(() -> ownerService.submitVerification(request, file))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("does not match its file type");

            verifyNoInteractions(cloudinaryService);
        }

        @Test
        @DisplayName("submitVerification rejects unverified document number formats")
        void submitVerificationRejectsInvalidDocumentNumbers() {
            Owner owner = new Owner();
            owner.setId("owner-123");
            owner.setEmail("host@example.com");
            owner.setActive(true);
            owner.setVerificationStatus(VerificationStatus.NOT_VERIFIED);

            authenticateOwner("host@example.com", "OWNER");
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.of(owner));

            OwnerVerificationRequest request = new OwnerVerificationRequest();
            request.setLegalName("Balwinder Singh");
            request.setDocumentType("PAN");
            request.setDocumentNumber("INVALID_PAN");

            MockMultipartFile file = new MockMultipartFile(
                    "document", "pan.pdf", "application/pdf", VALID_PDF_BYTES);

            assertThatThrownBy(() -> ownerService.submitVerification(request, file))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Invalid PAN number");
        }
    }

    @Nested
    @DisplayName("Admin Document Access & Private Server-Authorized Delivery")
    class AdminDocumentDeliveryTests {

        @Test
        @DisplayName("getVerificationDocument downloads private asset from Cloudinary when publicId present")
        void getVerificationDocumentFetchesFromCloudinary() throws IOException {
            Owner owner = new Owner();
            owner.setId("owner-123");
            owner.setVerificationDocumentPublicId("studentpg/owner-verifications/doc-123");
            owner.setVerificationDocumentFormat("pdf");
            owner.setVerificationDocumentResourceType("image");
            owner.setVerificationDocumentContentType("application/pdf");
            owner.setVerificationDocumentFilename("id-card.pdf");

            when(ownerRepository.findById("owner-123")).thenReturn(Optional.of(owner));
            when(cloudinaryService.downloadVerificationDocument("studentpg/owner-verifications/doc-123", "pdf", "image"))
                    .thenReturn(VALID_PDF_BYTES);

            AdminService.VerificationDocument document = adminService.getVerificationDocument("owner-123");

            assertThat(document.data()).isEqualTo(VALID_PDF_BYTES);
            assertThat(document.contentType()).isEqualTo("application/pdf");
            assertThat(document.filename()).isEqualTo("id-card.pdf");
        }

        @Test
        @DisplayName("getVerificationDocument falls back to legacy MongoDB binary when publicId not present")
        void getVerificationDocumentFallsBackToMongoLegacyBinary() {
            Owner owner = new Owner();
            owner.setId("owner-legacy");
            owner.setVerificationDocumentContentType("application/pdf");
            owner.setVerificationDocumentFilename("legacy.pdf");

            when(ownerRepository.findById("owner-legacy")).thenReturn(Optional.of(owner));

            Document rawDoc = new Document("_id", "owner-legacy")
                    .append("verificationDocumentData", new Binary(VALID_PDF_BYTES))
                    .append("verificationDocumentContentType", "application/pdf")
                    .append("verificationDocumentFilename", "legacy.pdf");

            when(mongoTemplate.findById("owner-legacy", Document.class, "owners")).thenReturn(rawDoc);

            AdminService.VerificationDocument document = adminService.getVerificationDocument("owner-legacy");

            assertThat(document.data()).isEqualTo(VALID_PDF_BYTES);
            assertThat(document.contentType()).isEqualTo("application/pdf");
        }

        @Test
        @DisplayName("toOwnerVerificationResponse never exposes public CDN URL; emits server-authorized path")
        void toOwnerVerificationResponseEmitsServerAuthorizedPath() {
            Owner owner = new Owner();
            owner.setId("owner-abc");
            owner.setName("John Host");
            owner.setEmail("john@host.com");
            owner.setPhone("9876543210");
            owner.setVerificationLegalName("Johnathan Host");
            owner.setVerificationDocumentType("PAN");
            owner.setVerificationDocumentNumber("ABCDE1234F");
            owner.setVerificationStatus(VerificationStatus.PENDING);
            owner.setVerificationDocumentUrl("https://res.cloudinary.com/dummy/image/upload/v1/bad-public-url.pdf");

            when(ownerRepository.findByVerificationStatus(VerificationStatus.PENDING))
                    .thenReturn(List.of(owner));

            List<OwnerVerificationAdminResponse> responses = adminService.getOwnerVerifications("PENDING");

            assertThat(responses).hasSize(1);
            OwnerVerificationAdminResponse resp = responses.get(0);
            // Public URL must be replaced with server-authorized admin path
            assertThat(resp.documentUrl()).isEqualTo("/api/admin/owner-verifications/owner-abc/document");
            assertThat(resp.documentUrl()).doesNotContain("cloudinary.com");
        }
    }

    @Nested
    @DisplayName("Legacy KYC Migration Service Tests")
    class KycMigrationTests {

        @Test
        @DisplayName("migrateOwnerDocument unsets legacy binary only after successful Cloudinary upload")
        void migrationUnsetsBinaryOnlyAfterSuccessfulUpload() throws Exception {
            Document rawDoc = new Document("_id", "owner-legacy-1")
                    .append("verificationDocumentData", new Binary(VALID_PDF_BYTES))
                    .append("verificationDocumentContentType", "application/pdf")
                    .append("verificationDocumentFilename", "legacy-pan.pdf");

            when(cloudinaryService.uploadVerificationDocumentBytes(eq(VALID_PDF_BYTES), eq("legacy-pan.pdf"), eq("application/pdf")))
                    .thenReturn(Map.of(
                            "publicId", "studentpg/owner-verifications/migrated-123",
                            "format", "pdf",
                            "resourceType", "image"
                    ));

            boolean success = migrationService.migrateOwnerDocument(rawDoc, "owner-legacy-1");

            assertThat(success).isTrue();
            verify(mongoTemplate).updateFirst(
                    any(Query.class),
                    any(Update.class),
                    eq("owners")
            );
        }

        @Test
        @DisplayName("migrateOwnerDocument leaves binary intact when upload fails")
        void migrationPreservesBinaryWhenUploadFails() throws Exception {
            Document rawDoc = new Document("_id", "owner-legacy-fail")
                    .append("verificationDocumentData", new Binary(VALID_PDF_BYTES))
                    .append("verificationDocumentContentType", "application/pdf")
                    .append("verificationDocumentFilename", "legacy.pdf");

            doAnswer(inv -> { throw new IOException("Cloudinary timeout"); })
                    .when(cloudinaryService).uploadVerificationDocumentBytes(any(), any(), any());

            assertThatThrownBy(() -> migrationService.migrateOwnerDocument(rawDoc, "owner-legacy-fail"))
                    .isInstanceOf(IOException.class);

            // Document in Mongo was NOT touched or deleted
            verify(mongoTemplate, never()).updateFirst(any(Query.class), any(Update.class), eq("owners"));
        }

        @Test
        @DisplayName("migrateAllLegacyKycDocuments calculates accurate counts across success, failure, and skip")
        void migrateAllLegacyKycDocuments_calculatesAccurateCounts() throws Exception {
            Document docSuccess = new Document("_id", "owner-success")
                    .append("verificationDocumentData", new Binary(VALID_PDF_BYTES))
                    .append("verificationDocumentContentType", "application/pdf")
                    .append("verificationDocumentFilename", "success.pdf");

            Document docEmpty = new Document("_id", "owner-empty")
                    .append("verificationDocumentData", new byte[0]);

            Document docFail = new Document("_id", "owner-fail")
                    .append("verificationDocumentData", new Binary(VALID_PDF_BYTES))
                    .append("verificationDocumentContentType", "application/pdf")
                    .append("verificationDocumentFilename", "fail.pdf");

            when(mongoTemplate.find(any(Query.class), eq(Document.class), eq("owners")))
                    .thenReturn(List.of(docSuccess, docEmpty, docFail));

            when(cloudinaryService.uploadVerificationDocumentBytes(eq(VALID_PDF_BYTES), eq("success.pdf"), eq("application/pdf")))
                    .thenReturn(Map.of("publicId", "studentpg/owner-verifications/migrated-success", "format", "pdf", "resourceType", "image"));

            when(cloudinaryService.uploadVerificationDocumentBytes(eq(VALID_PDF_BYTES), eq("fail.pdf"), eq("application/pdf")))
                    .thenThrow(new IOException("Cloudinary 500 error"));

            OwnerKycMigrationService.MigrationSummary summary = migrationService.migrateAllLegacyKycDocuments();

            assertThat(summary).isNotNull();
            assertThat(summary.success()).isTrue();
            assertThat(summary.totalScanned()).isEqualTo(3);
            assertThat(summary.successfullyMigrated()).isEqualTo(1);
            assertThat(summary.skippedCount()).isEqualTo(1);
            assertThat(summary.failedCount()).isEqualTo(1);

            // Verified success doc was updated
            verify(mongoTemplate, times(1)).updateFirst(
                    argThat(q -> q.toString().contains("owner-success")),
                    any(Update.class),
                    eq("owners")
            );

            // Empty doc was unset (skipped)
            verify(mongoTemplate, times(1)).updateFirst(
                    argThat(q -> q.toString().contains("owner-empty")),
                    any(Update.class),
                    eq("owners")
            );

            // Failed doc was never updated
            verify(mongoTemplate, never()).updateFirst(
                    argThat(q -> q.toString().contains("owner-fail")),
                    any(Update.class),
                    eq("owners")
            );
        }

        @Test
        @DisplayName("migrateAllLegacyKycDocuments prevents concurrent execution")
        void migrateAllLegacyKycDocuments_preventsConcurrency() throws Exception {
            java.util.concurrent.CountDownLatch startedLatch = new java.util.concurrent.CountDownLatch(1);
            java.util.concurrent.CountDownLatch finishLatch = new java.util.concurrent.CountDownLatch(1);
            java.util.concurrent.atomic.AtomicReference<Throwable> concurrentError = new java.util.concurrent.atomic.AtomicReference<>();

            Document blockingDoc = new Document("_id", "owner-blocking")
                    .append("verificationDocumentData", new Binary(VALID_PDF_BYTES));

            when(mongoTemplate.find(any(Query.class), eq(Document.class), eq("owners")))
                    .thenAnswer(inv -> {
                        startedLatch.countDown();
                        finishLatch.await(5, java.util.concurrent.TimeUnit.SECONDS);
                        return List.of(blockingDoc);
                    });

            when(cloudinaryService.uploadVerificationDocumentBytes(any(), any(), any()))
                    .thenReturn(Map.of("publicId", "id-1"));

            Thread thread1 = new Thread(() -> {
                try {
                    migrationService.migrateAllLegacyKycDocuments();
                } catch (Throwable t) {
                    // ignore
                }
            });

            Thread thread2 = new Thread(() -> {
                try {
                    migrationService.migrateAllLegacyKycDocuments();
                } catch (Throwable t) {
                    concurrentError.set(t);
                }
            });

            thread1.start();
            assertThat(startedLatch.await(3, java.util.concurrent.TimeUnit.SECONDS)).isTrue();

            // Try starting concurrent migration on thread 2
            thread2.start();
            thread2.join(3000);

            finishLatch.countDown();
            thread1.join(3000);

            assertThat(concurrentError.get())
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("KYC migration is already in progress.");
        }
    }

    @Nested
    @DisplayName("Priority 3: Unassigned Image Ownership Isolation Tests")
    class UnassignedImageOwnershipTests {

        @Test
        @DisplayName("uploadSingleImage records unassigned upload with authenticated owner ID")
        void uploadSingleImageTracksOwnerId() throws Exception {
            Owner owner = new Owner();
            owner.setId("owner-alice");
            owner.setActive(true);

            authenticateOwner("alice@example.com", "OWNER");
            when(ownerRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(owner));
            when(cloudinaryService.uploadImage(any())).thenReturn(new PGImage("studentpg/img-alice-1", "https://cdn.com/1"));

            MockMultipartFile file = new MockMultipartFile("image", "photo.png", "image/png", createValidImage(10, 10, "png"));

            PGImage result = pgService.uploadSingleImage(file);

            assertThat(result.getPublicId()).isEqualTo("studentpg/img-alice-1");
            verify(unassignedImageUploadRepository).save(argThat(upload ->
                    "studentpg/img-alice-1".equals(upload.getPublicId()) &&
                    "owner-alice".equals(upload.getOwnerId())
            ));
        }

        @Test
        @DisplayName("deleteUnassignedImage blocks Owner B from deleting Owner A's unassigned image")
        void deleteUnassignedImageBlocksCrossTenantDeletion() throws Exception {
            Owner ownerBob = new Owner();
            ownerBob.setId("owner-bob");
            ownerBob.setActive(true);

            authenticateOwner("bob@example.com", "OWNER");
            when(ownerRepository.findByEmailIgnoreCase("bob@example.com")).thenReturn(Optional.of(ownerBob));

            // Image was uploaded by Alice
            UnassignedImageUpload uploadByAlice = new UnassignedImageUpload("studentpg/img-alice-1", "owner-alice", null);
            when(unassignedImageUploadRepository.findByPublicId("studentpg/img-alice-1")).thenReturn(Optional.of(uploadByAlice));
            when(pgRepository.existsByImagesPublicId("studentpg/img-alice-1")).thenReturn(false);

            assertThatThrownBy(() -> pgService.deleteUnassignedImage("studentpg/img-alice-1"))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessageContaining("You do not have permission to delete this unassigned image");

            verify(cloudinaryService, never()).deleteImage(anyString());
        }

        @Test
        @DisplayName("deleteUnassignedImage permits Owner A to delete their own unassigned image")
        void deleteUnassignedImagePermitsOwnerToDeleteOwnAsset() throws Exception {
            Owner ownerAlice = new Owner();
            ownerAlice.setId("owner-alice");
            ownerAlice.setActive(true);

            authenticateOwner("alice@example.com", "OWNER");
            when(ownerRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(ownerAlice));

            UnassignedImageUpload uploadByAlice = new UnassignedImageUpload("studentpg/img-alice-1", "owner-alice", null);
            when(unassignedImageUploadRepository.findByPublicId("studentpg/img-alice-1")).thenReturn(Optional.of(uploadByAlice));
            when(pgRepository.existsByImagesPublicId("studentpg/img-alice-1")).thenReturn(false);

            String message = pgService.deleteUnassignedImage("studentpg/img-alice-1");

            assertThat(message).contains("cleaned up successfully");
            verify(cloudinaryService).deleteImage("studentpg/img-alice-1");
            verify(unassignedImageUploadRepository).deleteByPublicId("studentpg/img-alice-1");
        }

        @Test
        @DisplayName("deleteUnassignedImage blocks deletion of images assigned to an active PG listing")
        void deleteUnassignedImageProtectsActiveListings() throws Exception {
            Owner owner = new Owner();
            owner.setId("owner-alice");
            owner.setActive(true);

            authenticateOwner("alice@example.com", "OWNER");
            when(ownerRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(owner));
            when(pgRepository.existsByImagesPublicId("studentpg/active-pg-img")).thenReturn(true);

            assertThatThrownBy(() -> pgService.deleteUnassignedImage("studentpg/active-pg-img"))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Cannot delete an image that is assigned to an existing PG listing");

            verify(cloudinaryService, never()).deleteImage(anyString());
        }
    }
}
