/**
 * Business and technical system boundary definitions.
 */
const GENDER_VALUES = ["MALE", "FEMALE", "UNISEX"] as const;

export const CONFIG = {
  MIN_IMAGE_COUNT: 5,
  MAX_IMAGE_COUNT: 10,
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024,

  GENDERS: [
    {
      value: GENDER_VALUES[0],
      label: "Boys"
    },
    {
      value: GENDER_VALUES[1],
      label: "Girls"
    },
    {
      value: GENDER_VALUES[2],
      label: "Unisex"
    }
  ] as const,

  PAGINATION_DEFAULT_SIZE: 10,

  PAGINATION_MAX_SIZE: 50,

} as const;

export const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const SERVER_BACKEND_API_URL =
  process.env.BACKEND_INTERNAL_URL || BACKEND_API_URL;