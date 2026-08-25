import { z } from 'zod';
import { CONFIG } from '@/constants/config';

export const pgFormSchema = z.object({
  pgName: z.string().min(3, 'Property name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  address: z.string().min(5, 'Address is mandatory'),
  city: z.string().min(2, 'City is mandatory'),
  state: z.string().min(2, 'State is mandatory'),
  pincode: z.string().length(6, 'Pincode must be exactly 6 digits'),
  rent: z.coerce.number().positive('Rent amount must be a positive number'),
  gender: z.enum(["MALE", "FEMALE", "UNISEX"], {
    errorMap: () => ({ message: 'Please select a valid target gender category' }),
  }),
  roomType: z.string().min(2, 'Room category breakdown description required'),
  foodAvailable: z.boolean().default(false),
  wifiAvailable: z.boolean().default(false),
  parkingAvailable: z.boolean().default(false),
  laundryAvailable: z.boolean().default(false),
  images: z.array(
    z.object({
      publicId: z.string(),
      url: z.string().url(),
    })
  ).max(CONFIG.MAX_IMAGE_COUNT, `You can upload up to ${CONFIG.MAX_IMAGE_COUNT} images maximum`),
});

export type PgFormInput = z.infer<typeof pgFormSchema>;