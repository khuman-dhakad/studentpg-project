package com.studentpg.modules.admin.dto.response;

import java.time.Instant;
import java.util.List;

public record AdminDashboardOverviewResponse(
        long totalPgs,
        long totalOwners,
        long totalStudents,
        long pendingApprovals,
        long approvedPgs,
        long rejectedPgs,
        long draftPgs,
        double pgsGrowthPercent,
        double ownersGrowthPercent,
        double studentsGrowthPercent,
        long newApprovalsToday,
        List<MonthlyTrendItem> listingsTrend,
        List<LocalityStatItem> topLocalities,
        List<RecentActivityItem> recentActivities,
        List<PendingPGItem> pendingListings
) {

    public record MonthlyTrendItem(
            String month,
            int year,
            long count
    ) {}

    public record LocalityStatItem(
            int rank,
            String locality,
            long count,
            double percentage
    ) {}

    public record RecentActivityItem(
            String id,
            String type,
            String title,
            String subtitle,
            String actor,
            Instant timestamp,
            String relativeTime
    ) {}

    public record PendingPGItem(
            String id,
            String pgName,
            String ownerName,
            String locality,
            String city,
            String rent,
            Instant submittedAt,
            String thumbnailUrl
    ) {}
}
