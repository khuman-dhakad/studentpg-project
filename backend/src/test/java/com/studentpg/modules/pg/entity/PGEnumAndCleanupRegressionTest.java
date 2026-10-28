package com.studentpg.modules.pg.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.modules.pg.repository.PGRepository;
import com.studentpg.modules.pg.service.PGService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PGEnumAndCleanupRegressionTest {

    private ObjectMapper objectMapper;

    @Mock
    private PGRepository pgRepository;

    @Mock
    private OwnerRepository ownerRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private PGService pgService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("Fix E & SPG-QA-005: PG Listing Enum Deserialization")
    class EnumDeserializationTests {

        @Test
        @DisplayName("Every supported Category enum value deserializes cleanly from JSON")
        void supportedCategoriesDeserialize() throws Exception {
            for (Category category : Category.values()) {
                String json = "\"" + category.name() + "\"";
                Category result = objectMapper.readValue(json, Category.class);
                assertThat(result).isEqualTo(category);
            }
        }

        @Test
        @DisplayName("Every supported RoomType enum value deserializes cleanly from JSON")
        void supportedRoomTypesDeserialize() throws Exception {
            for (RoomType roomType : RoomType.values()) {
                String json = "\"" + roomType.name() + "\"";
                RoomType result = objectMapper.readValue(json, RoomType.class);
                assertThat(result).isEqualTo(roomType);
            }
        }

        @Test
        @DisplayName("Legacy / friendly Category values (Standard, Premium) map to safe fallback enums")
        void legacyCategoriesMapToEnums() throws Exception {
            assertThat(objectMapper.readValue("\"Standard\"", Category.class)).isEqualTo(Category.HOSTEL);
            assertThat(objectMapper.readValue("\"Premium\"", Category.class)).isEqualTo(Category.CO_LIVING);
            assertThat(objectMapper.readValue("\"Luxury\"", Category.class)).isEqualTo(Category.CO_LIVING);
            assertThat(objectMapper.readValue("\"co-living\"", Category.class)).isEqualTo(Category.CO_LIVING);
        }

        @Test
        @DisplayName("Legacy / friendly RoomType values ('Single Sharing', 'Double Sharing') map to canonical enums")
        void legacyRoomTypesMapToEnums() throws Exception {
            assertThat(objectMapper.readValue("\"Single Sharing\"", RoomType.class)).isEqualTo(RoomType.SINGLE);
            assertThat(objectMapper.readValue("\"Double Sharing\"", RoomType.class)).isEqualTo(RoomType.DOUBLE);
            assertThat(objectMapper.readValue("\"Triple Sharing\"", RoomType.class)).isEqualTo(RoomType.TRIPLE);
            assertThat(objectMapper.readValue("\"Four Sharing\"", RoomType.class)).isEqualTo(RoomType.FOUR_SHARING);
        }

        @Test
        @DisplayName("Gender parse handles standard and friendly variants (BOYS, GIRLS, UNISEX)")
        void genderDeserialization() throws Exception {
            assertThat(objectMapper.readValue("\"MALE\"", Gender.class)).isEqualTo(Gender.MALE);
            assertThat(objectMapper.readValue("\"FEMALE\"", Gender.class)).isEqualTo(Gender.FEMALE);
            assertThat(objectMapper.readValue("\"UNISEX\"", Gender.class)).isEqualTo(Gender.UNISEX);
            assertThat(objectMapper.readValue("\"BOYS\"", Gender.class)).isEqualTo(Gender.MALE);
            assertThat(objectMapper.readValue("\"GIRLS\"", Gender.class)).isEqualTo(Gender.FEMALE);
        }
    }

    @Nested
    @DisplayName("Fix F & SPG-QA-006: Unassigned Cloudinary Image Cleanup")
    class UnassignedImageCleanupTests {

        private void authenticateOwner(String email) {
            SecurityContextHolder.getContext().setAuthentication(
                    new TestingAuthenticationToken(email, "password", "ROLE_OWNER")
            );
            Owner owner = new Owner();
            owner.setId("owner-123");
            owner.setEmail(email);
            owner.setActive(true);
            when(ownerRepository.findByEmailIgnoreCase(email)).thenReturn(Optional.of(owner));
        }

        @Test
        @DisplayName("Deleting unassigned image succeeds when not referenced by any PG")
        void deleteUnassignedImageSuccess() throws IOException {
            authenticateOwner("owner@studentpg.com");
            String publicId = "studentpg/temp_img_12345";
            when(pgRepository.existsByImagesPublicId(publicId)).thenReturn(false);

            String result = pgService.deleteUnassignedImage(publicId);

            assertThat(result).contains("Image cleaned up successfully");
            verify(cloudinaryService).deleteImage(publicId);
        }

        @Test
        @DisplayName("Deleting an image that is assigned to an existing PG is rejected")
        void deleteAssignedImageIsRejected() {
            authenticateOwner("owner@studentpg.com");
            String publicId = "studentpg/live_pg_image";
            when(pgRepository.existsByImagesPublicId(publicId)).thenReturn(true);

            assertThatThrownBy(() -> pgService.deleteUnassignedImage(publicId))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Cannot delete an image that is assigned to an existing PG listing");

            verifyNoInteractions(cloudinaryService);
        }

        @Test
        @DisplayName("Deleting assets outside studentpg folder (like profile or KYC) is rejected")
        void deleteNonPgImageIsRejected() {
            authenticateOwner("owner@studentpg.com");

            assertThatThrownBy(() -> pgService.deleteUnassignedImage("studentpg/owners/avatar_123"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Invalid image public ID.");

            assertThatThrownBy(() -> pgService.deleteUnassignedImage("studentpg/owner-verifications/doc_123"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Invalid image public ID.");

            assertThatThrownBy(() -> pgService.deleteUnassignedImage("other_folder/file"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Invalid image public ID.");

            verifyNoInteractions(cloudinaryService);
        }

        @Test
        @DisplayName("Unauthenticated cleanup call throws SecurityException")
        void unauthenticatedCleanupThrows() {
            assertThatThrownBy(() -> pgService.deleteUnassignedImage("studentpg/test_img"))
                    .isInstanceOf(SecurityException.class)
                    .hasMessage("Authentication required.");
            verifyNoInteractions(cloudinaryService);
        }
    }
}
