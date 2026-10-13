package com.studentpg.modules.admin.service;

import com.studentpg.modules.admin.dto.response.AdminDashboardOverviewResponse;
import com.studentpg.modules.notification.service.NotificationService;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.modules.pg.entity.ApprovalStatus;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.repository.PGRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminDashboardTest {

    @Mock
    private PGRepository pgRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private OwnerRepository ownerRepository;

    private AdminService adminService;

    @BeforeEach
    void setUp() {
        adminService = new AdminService(pgRepository, notificationService, ownerRepository);
    }

    @Test
    @DisplayName("getDashboardOverview computes complete metrics successfully")
    void testGetDashboardOverview() {
        // Arrange
        when(pgRepository.count()).thenReturn(10L);
        when(pgRepository.countByApprovalStatus(ApprovalStatus.APPROVED)).thenReturn(7L);
        when(pgRepository.countByApprovalStatus(ApprovalStatus.PENDING)).thenReturn(2L);
        when(pgRepository.countByApprovalStatus(ApprovalStatus.REJECTED)).thenReturn(1L);
        when(ownerRepository.count()).thenReturn(5L);

        PG testPg = new PG();
        testPg.setPgName("Test Hostel");
        testPg.setApprovalStatus(ApprovalStatus.APPROVED);
        testPg.setCity("Bhopal");
        testPg.setLandmark("MP Nagar");
        testPg.setRent(new BigDecimal("8000"));
        testPg.setSubmittedAt(Instant.now());

        when(pgRepository.findAll()).thenReturn(List.of(testPg));
        when(pgRepository.findByApprovalStatus(eq(ApprovalStatus.PENDING), any())).thenReturn(org.springframework.data.domain.Page.empty());

        // Act
        AdminDashboardOverviewResponse response = adminService.getDashboardOverview();

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.totalPgs());
        assertEquals(5L, response.totalOwners());
        assertEquals(2L, response.pendingApprovals());
        assertEquals(7L, response.approvedPgs());
        assertEquals(1L, response.rejectedPgs());

        assertNotNull(response.listingsTrend());
        assertFalse(response.listingsTrend().isEmpty());

        assertNotNull(response.topLocalities());
        assertFalse(response.topLocalities().isEmpty());

        assertNotNull(response.recentActivities());
        assertFalse(response.recentActivities().isEmpty());

        assertNotNull(response.pendingListings());
        assertFalse(response.pendingListings().isEmpty());
    }
}
