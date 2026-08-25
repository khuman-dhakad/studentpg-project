export const CACHE_TAGS = {
  SESSION: 'Session',
  OWNER_PROFILE: 'OwnerProfile',
  OWNER_LISTINGS: 'OwnerListings',
  ADMIN_PENDING: 'AdminPending',
  ADMIN_STATS: 'AdminStats',
  PUBLIC_PGS: 'PublicPgs',
  NOTIFICATIONS: 'Notifications',
} as const;

export type CacheTag =
  (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const CACHE_TAGS_LIST =
  Object.values(CACHE_TAGS) as CacheTag[];