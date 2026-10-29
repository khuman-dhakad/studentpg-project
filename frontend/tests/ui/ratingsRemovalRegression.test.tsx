import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PGCard } from '@/components/pg/PGCard';
import { PGDetailsView } from '@/components/pg/PGDetailsView';
import { AdminSidebar, AdminActiveView } from '@/components/admin/AdminSidebar';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import type { PG } from '@/types/pg.types';

// Mock next/navigation for PGDetailsView
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock admin dashboard queries for AdminDashboardView
vi.mock('@/features/admin-dashboard/api/adminApi', () => ({
  useGetDashboardOverviewQuery: () => ({
    data: {
      totalPgs: 250,
      totalOwners: 80,
      totalStudents: 1200,
      pendingApprovals: 5,
      activeCities: 4,
      totalBeds: 600,
      recentActivities: [
        {
          id: 'act-1',
          type: 'REGISTRATION',
          title: 'New PG listed',
          subtitle: 'Green Villa PG',
          actor: 'Rahul Sharma',
          timestamp: new Date().toISOString(),
          relativeTime: '20 mins ago',
        },
        {
          id: 'act-5',
          type: 'VERIFICATION',
          title: 'Owner KYC submitted',
          subtitle: 'Blossom Girls PG',
          actor: 'Owner',
          timestamp: new Date().toISOString(),
          relativeTime: '5 hours ago',
        },
      ],
      pendingPgs: [],
      topLocalities: [],
    },
    isLoading: false,
    refetch: vi.fn(),
  }),
  useApprovePgMutation: () => [vi.fn(), { isLoading: false }],
}));

const mockPg: PG = {
  id: 'pg-test-101',
  pgName: 'Comfort Stay Student PG',
  description: 'Premium student accommodation near metro station.',
  address: '123 University Road, Near Tech Park',
  landmark: 'Opposite Metro Gate 2',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560001',
  rent: 8500,
  securityDeposit: 15000,
  noticePeriod: '1 Month',
  category: 'HOSTEL',
  gender: 'UNISEX',
  roomType: 'DOUBLE',
  foodAvailable: true,
  wifiAvailable: true,
  parkingAvailable: true,
  laundryAvailable: true,
  acAvailable: true,
  powerBackup: true,
  approvalStatus: 'APPROVED',
  ownerId: 'owner-999',
  images: [
    {
      id: 'img-1',
      publicId: 'pgs/comfort-stay-1',
      url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    },
  ],
};

describe('Ratings, Reviews, and Feedback Removal UI Regression Suite', () => {
  describe('1. PGCard Component', () => {
    it('renders essential property listing details without rating or review badges', () => {
      const html = renderToStaticMarkup(<PGCard pg={mockPg} />);

      // Verify core listing details remain functional
      expect(html).toContain('Comfort Stay Student PG');
      expect(html).toContain('Bengaluru');
      expect(html).toContain('8,500');

      // Verify complete absence of rating stars, scores, and review count badges
      expect(html).not.toContain('<span>4.5</span>');
      expect(html).not.toContain('(120)');
      expect(html).not.toContain('fill-amber');
      expect(html).not.toContain('rating');
      expect(html).not.toContain('review');
    });
  });

  describe('2. PGDetailsView Component', () => {
    it('renders property header, address, amenities, and pricing without rating summary', () => {
      const html = renderToStaticMarkup(<PGDetailsView listing={mockPg} />);

      // Verify core view components are present
      expect(html).toContain('Comfort Stay Student PG');
      expect(html).toContain('123 University Road');
      expect(html).toContain('8,500');
      expect(html).toContain('Wi-Fi');

      // Verify absence of rating stars, average scores, and review count indicators
      expect(html).not.toContain('<span>4.5</span>');
      expect(html).not.toContain('(120 reviews)');
      expect(html).not.toContain('120 reviews');
      expect(html).not.toContain('Student Reviews');
      expect(html).not.toContain('Ratings Moderation');
    });
  });

  describe('3. AdminSidebar Component', () => {
    it('renders standard admin navigation items without Reviews view tab', () => {
      const handleViewChange = vi.fn();
      const html = renderToStaticMarkup(
        <AdminSidebar activeView="dashboard" onViewChange={handleViewChange} pendingApprovalsCount={5} />
      );

      // Verify expected navigation items exist
      expect(html).toContain('Dashboard');
      expect(html).toContain('PG Listings');
      expect(html).toContain('Owners');
      expect(html).toContain('Students');
      expect(html).toContain('Approvals');
      expect(html).toContain('Reports');
      expect(html).toContain('Enquiries');
      expect(html).toContain('Users');
      expect(html).toContain('Settings');

      // Verify Reviews navigation tab is completely absent
      expect(html).not.toContain('Reviews');
      expect(html).not.toContain('reviews');
    });

    it('enforces that activeView type contract does not permit reviews', () => {
      const validViews: AdminActiveView[] = [
        'dashboard',
        'pg-listings',
        'owners',
        'students',
        'approvals',
        'reports',
        'enquiries',
        'users',
        'settings',
      ];

      expect(validViews).not.toContain('reviews');
    });
  });

  describe('4. AdminDashboardView Activity Feed', () => {
    it('displays owner verification activity and excludes removed review activity', () => {
      const html = renderToStaticMarkup(<AdminDashboardView />);

      // Verify new verification activity item is rendered
      expect(html).toContain('Owner KYC submitted');
      expect(html).toContain('Blossom Girls PG');

      // Verify removed review activity event is absent
      expect(html).not.toContain('New review received');
      expect(html).not.toContain('REVIEW');
    });
  });
});
