/**
 * Operational metrics and dashboard aggregates for the Administrator portal.
 */

export interface AdminStats {
  total: number;
  approved: number;
  pending: number;
  rejected?: number;
}

export interface AdminSuggestion {
  id: string;
  pgName: string;
}

export interface MonthlyTrendItem {
  month: string;
  year: number;
  count: number;
}

export interface LocalityStatItem {
  rank: number;
  locality: string;
  count: number;
  percentage: number;
}

export interface RecentActivityItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  actor: string;
  timestamp: string;
  relativeTime: string;
}

export interface PendingPGItem {
  id: string;
  pgName: string;
  ownerName: string;
  locality: string;
  city: string;
  rent: string;
  submittedAt: string;
  thumbnailUrl: string | null;
}

export interface AdminDashboardOverview {
  totalPgs: number;
  totalOwners: number;
  totalStudents: number;
  pendingApprovals: number;
  approvedPgs: number;
  rejectedPgs: number;
  draftPgs: number;
  pgsGrowthPercent: number;
  ownersGrowthPercent: number;
  studentsGrowthPercent: number;
  newApprovalsToday: number;
  listingsTrend: MonthlyTrendItem[];
  topLocalities: LocalityStatItem[];
  recentActivities: RecentActivityItem[];
  pendingListings: PendingPGItem[];
}