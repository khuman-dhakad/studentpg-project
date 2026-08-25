package com.studentpg.modules.pg.service;

import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.repository.PGRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.TestingAuthenticationToken;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class PGServiceTest {

    @Mock
    private PGRepository pgRepository;

    @Mock
    private OwnerRepository ownerRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private PGService pgService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getOwnerPGsThrowsWhenNoAuthenticatedOwnerExists() {
        Pageable pageable = PageRequest.of(0, 10);

        assertThatThrownBy(() -> pgService.getOwnerPGs(pageable))
                .isInstanceOf(SecurityException.class)
                .hasMessage("Authentication required.");
        verifyNoInteractions(pgRepository);
    }
}
