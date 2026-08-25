/**
 * Business and technical system boundary definitions.
 */
const GENDER_VALUES = ["MALE", "FEMALE", "UNISEX"] as const;

export const CONFIG = {

  MAX_IMAGE_COUNT: 3,

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
  process.env.NEXT_PUBLIC_API_URL ?? '';
  // console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);

if (!BACKEND_API_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not configured.'
  );


  
}