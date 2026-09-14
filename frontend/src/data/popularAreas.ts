export interface PopularArea {
  id: string;
  name: string;
  slug: string;
  href: string;
  image: string;
  type: 'locality' | 'college_hub';
  categoryLabel: string;
  description: string;
  featured: boolean;
}

export const POPULAR_AREAS: PopularArea[] = [
  // =========================================================================
  // 1. EXISTING MAJOR AREAS (4)
  // =========================================================================
  {
    id: 'mp-nagar',
    name: 'MP Nagar Zone 1 & 2',
    slug: 'mp-nagar',
    href: '/search?q=MP+Nagar',
    image: '/areas/mp-nagar.jpg',
    type: 'locality',
    categoryLabel: 'Coaching & Commercial Hub',
    description: 'Prime coaching, corporate and commercial hub with verified student PGs and co-living spaces.',
    featured: true,
  },
  {
    id: 'kolar-road',
    name: 'Kolar Road',
    slug: 'kolar-road',
    href: '/search?q=Kolar+Road',
    image: '/areas/kolar-road.jpg',
    type: 'locality',
    categoryLabel: 'University Corridor',
    description: 'Rapidly growing residential and university corridor with peaceful hostels and student apartments.',
    featured: true,
  },
  {
    id: 'indrapuri',
    name: 'Indrapuri',
    slug: 'indrapuri',
    href: '/search?q=Indrapuri',
    image: '/areas/indrapuri.jpg',
    type: 'locality',
    categoryLabel: 'Prime Student Center',
    description: 'Bhopal’s premier student hub close to BHEL, coaching centres, libraries, and lively markets.',
    featured: true,
  },
  {
    id: 'arera-colony',
    name: 'Arera Colony',
    slug: 'arera-colony',
    href: '/search?q=Arera+Colony',
    image: '/areas/arera-colony.jpg',
    type: 'locality',
    categoryLabel: 'Premium Residential Hub',
    description: 'Prestigious, leafy residential colony offering peaceful, high-end student accommodations.',
    featured: true,
  },

  // =========================================================================
  // 2. ADDITIONAL MAJOR BHOPAL LOCALITIES (8)
  // =========================================================================
  {
    id: 'hoshangabad-road',
    name: 'Hoshangabad Road',
    slug: 'hoshangabad-road',
    href: '/search?q=Hoshangabad+Road',
    image: '/areas/hoshangabad-road.jpg',
    type: 'locality',
    categoryLabel: 'Major Transit Hub',
    description: 'Wide transit corridor with modern multi-storey student apartments, malls, and tech institutes.',
    featured: true,
  },
  {
    id: 'ayodhya-bypass',
    name: 'Ayodhya Bypass',
    slug: 'ayodhya-bypass',
    href: '/search?q=Ayodhya+Bypass',
    image: '/areas/ayodhya-bypass.jpg',
    type: 'locality',
    categoryLabel: 'University Hub',
    description: 'Hub for engineering colleges, wide expressways, and budget-friendly student hostels.',
    featured: true,
  },
  {
    id: 'shahpura',
    name: 'Shahpura',
    slug: 'shahpura',
    href: '/search?q=Shahpura',
    image: '/areas/shahpura.jpg',
    type: 'locality',
    categoryLabel: 'Lakeside Residential Hub',
    description: 'Scenic lakeside neighborhood with student cafes, walking promenades, and verified stays.',
    featured: true,
  },
  {
    id: 'bawadia-kalan',
    name: 'Bawadia Kalan',
    slug: 'bawadia-kalan',
    href: '/search?q=Bawadia+Kalan',
    image: '/areas/bawadia-kalan.jpg',
    type: 'locality',
    categoryLabel: 'Modern Residential Enclave',
    description: 'Modern gated residential sector with quiet student residences and green open spaces.',
    featured: true,
  },
  {
    id: 'anand-nagar',
    name: 'Anand Nagar',
    slug: 'anand-nagar',
    href: '/search?q=Anand+Nagar',
    image: '/areas/anand-nagar.jpg',
    type: 'locality',
    categoryLabel: 'Student Campus Market',
    description: 'Active student marketplace filled with academic book stalls, food points, and affordable hostels.',
    featured: false,
  },
  {
    id: 'piplani',
    name: 'Piplani',
    slug: 'piplani',
    href: '/search?q=Piplani',
    image: '/areas/piplani.jpg',
    type: 'locality',
    categoryLabel: 'BHEL & Student Enclave',
    description: 'Well-connected residential locality next to BHEL with established student hostels.',
    featured: false,
  },
  {
    id: 'govindpura',
    name: 'Govindpura',
    slug: 'govindpura',
    href: '/search?q=Govindpura',
    image: '/areas/govindpura.jpg',
    type: 'locality',
    categoryLabel: 'Industrial & Tech Area',
    description: 'Close to technical training institutes, colleges, and budget accommodation facilities.',
    featured: false,
  },
  {
    id: 'habibganj',
    name: 'Habibganj',
    slug: 'habibganj',
    href: '/search?q=Habibganj',
    image: '/areas/habibganj.jpg',
    type: 'locality',
    categoryLabel: 'Transit & Metro Hub',
    description: 'Adjacent to world-class Rani Kamlapati station with metro access and urban co-living stays.',
    featured: false,
  },

  // =========================================================================
  // 3. ADDITIONAL KEY LOCALITIES (2)
  // =========================================================================
  {
    id: 'awadhpuri',
    name: 'Awadhpuri',
    slug: 'awadhpuri',
    href: '/search?q=Awadhpuri',
    image: '/areas/awadhpuri.jpg',
    type: 'locality',
    categoryLabel: 'Residential Student Zone',
    description: 'Tranquil colony with numerous dedicated boys and girls PGs and local student amenities.',
    featured: false,
  },
  {
    id: 'new-market',
    name: 'New Market',
    slug: 'new-market',
    href: '/search?q=New+Market',
    image: '/areas/new-market.jpg',
    type: 'locality',
    categoryLabel: 'City Center Hub',
    description: 'Central Bhopal retail, coaching, and transit hub with easy reach to colleges across the city.',
    featured: false,
  },

  // =========================================================================
  // 4. STUDENT / COLLEGE LOCATION HUBS (7)
  // =========================================================================
  {
    id: 'near-lnct',
    name: 'Near LNCT',
    slug: 'near-lnct',
    href: '/search?q=LNCT',
    image: '/areas/near-lnct.jpg',
    type: 'college_hub',
    categoryLabel: 'College Hub — Raisen Road',
    description: 'High concentration of student hostels and PGs surrounding the LNCT campus on Raisen Road.',
    featured: false,
  },
  {
    id: 'near-tit',
    name: 'Near TIT',
    slug: 'near-tit',
    href: '/search?q=TIT',
    image: '/areas/near-tit.jpg',
    type: 'college_hub',
    categoryLabel: 'College Hub — Anand Nagar',
    description: 'Hostels and rental rooms dedicated to students attending Technocrats Institute of Technology.',
    featured: false,
  },
  {
    id: 'near-sage',
    name: 'Near SAGE',
    slug: 'near-sage',
    href: '/search?q=SAGE',
    image: '/areas/near-sage.jpg',
    type: 'college_hub',
    categoryLabel: 'College Hub — Ayodhya Bypass',
    description: 'Modern student accommodations located right near SAGE University campus.',
    featured: false,
  },
  {
    id: 'near-sagar',
    name: 'Near Sagar',
    slug: 'near-sagar',
    href: '/search?q=Sagar+College',
    image: '/areas/near-sagar.jpg',
    type: 'college_hub',
    categoryLabel: 'College Hub — SISTec',
    description: 'Verified student stays and private rooms in the vicinity of Sagar Group of Institutions.',
    featured: false,
  },
  {
    id: 'near-oriental',
    name: 'Near Oriental',
    slug: 'near-oriental',
    href: '/search?q=Oriental+College',
    image: '/areas/near-oriental.jpg',
    type: 'college_hub',
    categoryLabel: 'College Hub — OIST',
    description: 'Popular student PG clusters serving students of Oriental Institute of Science and Technology.',
    featured: false,
  },
  {
    id: 'near-nri',
    name: 'Near NRI',
    slug: 'near-nri',
    href: '/search?q=NRI+College',
    image: '/areas/near-nri.jpg',
    type: 'college_hub',
    categoryLabel: 'College Hub — Sajid Nagar',
    description: 'Affordable accommodations and mess facilities located near NRI Institute campus.',
    featured: false,
  },
  {
    id: 'near-manit',
    name: 'Near MANIT',
    slug: 'near-manit',
    href: '/search?q=MANIT',
    image: '/areas/near-manit.jpg',
    type: 'college_hub',
    categoryLabel: 'National Institute Hub',
    description: 'Prime student residences and sharing rooms situated close to MANIT Bhopal campus.',
    featured: false,
  },
];

/**
 * Curated top subset displayed on the compact homepage section.
 * Preserves 100% of the existing layout and reference image.
 */
export const HOMEPAGE_POPULAR_AREAS = POPULAR_AREAS.slice(0, 4);

export const MAJOR_LOCALITIES = POPULAR_AREAS.filter(
  (area) => area.type === 'locality'
);

export const COLLEGE_HUBS = POPULAR_AREAS.filter(
  (area) => area.type === 'college_hub'
);
