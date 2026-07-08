/**
 * Caching tags matrix used by RTK Query layer for automatic data re-fetching.
 */
export const CACHE_TAGS = {
  OWNER_PROFILE: 'OwnerProfile',
  OWNER_LISTINGS: 'OwnerListings',
  ADMIN_PENDING: 'AdminPending',
  ADMIN_STATS: 'AdminStats',
  PUBLIC_PGS: 'PublicPgs',
} as const;

export const CACHE_TAGS_LIST = Object.values(CACHE_TAGS);