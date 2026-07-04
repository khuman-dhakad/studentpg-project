/**
 * DISPLAY FORMATTING TOOLS
 */

// Converts numbers into readable Rupee currency strings (e.g., 5000 -> ₹5,000)
export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// Truncates long paragraphs with neat trailing ellipsis dots (...)
export const truncate = (str, maxLen = 120) =>
  str.length <= maxLen ? str : str.slice(0, maxLen).trimEnd() + '\u2026';

// Cleans text strings into readable web-browser URLs (e.g., "MP Nagar PG" -> "mp-nagar-pg")
export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Packages chosen sidebar fields into a clean URL parameter search string
export const buildSearchParams = ({ area, city, minPrice, maxPrice, gender, amenities, foodIncluded }) => {
  const p = new URLSearchParams();
  if (area) p.set('area', area);
  if (city) p.set('city', city);
  if (minPrice) p.set('minPrice', minPrice);
  if (maxPrice) p.set('maxPrice', maxPrice);
  if (gender) p.set('gender', gender);
  if (amenities?.length) p.set('amenities', amenities.join(','));
  if (foodIncluded) p.set('foodIncluded', 'true');
  return p.toString();
};

// Formats categories into user-friendly names with clean icons
export const genderLabel = (g) =>
  ({ Boys: '👦 Boys Only', Girls: '👧 Girls Only', Any: '🤝 Any Gender' }[g] || g);