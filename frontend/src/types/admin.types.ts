/**
 * Operational metrics and dashboard aggregates for the Administrator portal.
 */

export interface AdminStats {
  total: number;
  approved: number;
  pending: number;
}

export interface AdminSuggestion {
  id: string;
  pgName: string;
}