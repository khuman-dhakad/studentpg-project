'use client';

import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';

const MIN_IMAGES = 5;

const STEPS = [
  {
    id: 1,
    label: 'Basic Details',
    desc: 'Update core information about your PG.',
  },
  {
    id: 2,
    label: 'Amenities',
    desc: 'Update the facilities provided.',
  },
  {
    id: 3,
    label: 'Location',
    desc: 'Update address and location details.',
  },
  {
    id: 4,
    label: 'Photos',
    desc: 'Manage existing and new photos.',
  },
  {
    id: 5,
    label: 'Pricing',
    desc: 'Update rent and security structure.',
  },
  {
    id: 6,
    label: 'Review & Update',
    desc: 'Review all changes before saving.',
  },
];

interface PGImage {
  publicId: string;
  url: string;
}

interface PG {
  id: string;

  pgName?: string;
  description?: string;
  gender?: string;
  roomType?: string;
  category?: string;

  foodAvailable?: boolean;
  wifiAvailable?: boolean;
  parkingAvailable?: boolean;
  laundryAvailable?: boolean;
  acAvailable?: boolean;
  powerBackup?: boolean;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;

  rent?: number;
  securityDeposit?: number;
  noticePeriod?: string;

  images?: PGImage[];
}

interface FormState {
  pgName: string;
  description: string;
  gender: string;
  roomType: string;
  category: string;

  foodAvailable: boolean;
  wifiAvailable: boolean;
  parkingAvailable: boolean;
  laundryAvailable: boolean;
  acAvailable: boolean;
  powerBackup: boolean;

  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;

  rent: string;
  securityDeposit: string;
  noticePeriod: string;
}

const initialForm: FormState = {
  pgName: '',
  description: '',
  gender: 'MALE',
  roomType: 'Single Sharing',
  category: '',

  foodAvailable: false,
  wifiAvailable: false,
  parkingAvailable: false,
  laundryAvailable: false,
  acAvailable: false,
  powerBackup: false,

  address: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',

  rent: '',
  securityDeposit: '',
  noticePeriod: '1 Month',
};

export default function EditPgPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [form, setForm] = useState<FormState>(initialForm);

  const [currentStep, setCurrentStep] = useState(1);

  const [existingImages, setExistingImages] = useState<PGImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');

  /*
   * ============================================================
   * LOAD EXISTING PG
   * ============================================================
   */

  useEffect(() => {
    if (!id) return;

    const loadPG = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          BACKEND_ENDPOINTS.PGS.BY_ID(id)
        );

        if (!response.ok) {
          let errorMessage =
            'Failed to load PG details.';

          try {
            const errorData = await response.json();

            errorMessage =
              errorData.message || errorMessage;
          } catch {
            // Response may not contain JSON.
          }

          throw new Error(errorMessage);
        }

        const pg: PG = await response.json();

        setForm({
          pgName: pg.pgName || '',
          description: pg.description || '',
          gender: pg.gender || 'MALE',
          roomType: pg.roomType || 'Single Sharing',
          category: pg.category || '',

          foodAvailable: pg.foodAvailable ?? false,
          wifiAvailable: pg.wifiAvailable ?? false,
          parkingAvailable: pg.parkingAvailable ?? false,
          laundryAvailable: pg.laundryAvailable ?? false,
          acAvailable: pg.acAvailable ?? false,
          powerBackup: pg.powerBackup ?? false,

          address: pg.address || '',
          city: pg.city || '',
          state: pg.state || '',
          pincode: pg.pincode || '',
          landmark: pg.landmark || '',

          rent:
            pg.rent !== undefined &&
            pg.rent !== null
              ? String(pg.rent)
              : '',

          securityDeposit:
            pg.securityDeposit !== undefined &&
            pg.securityDeposit !== null
              ? String(pg.securityDeposit)
              : '',

          noticePeriod:
            pg.noticePeriod || '1 Month',
        });

        setExistingImages(pg.images || []);
      } catch (error) {
        console.error(
          'Failed to load PG:',
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : 'Failed to load PG details.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPG();
  }, [id]);

  /*
   * ============================================================
   * INPUT HANDLERS
   * ============================================================
   */

  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (
    name: keyof FormState,
    checked: boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  /*
   * ============================================================
   * IMAGE HANDLING
   * ============================================================
   */

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setNewFiles((previous) => [
      ...previous,
      ...files,
    ]);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setNewPreviews((previous) => [
      ...previous,
      ...previews,
    ]);

    e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    const preview = newPreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setNewFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setNewPreviews((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  /*
   * ============================================================
   * DELETE EXISTING IMAGE
   *
   * IMPORTANT:
   * We do NOT call DELETE API here.
   *
   * We only remove the image from local state.
   * Final image list is sent in PUT request.
   *
   * This fixes the 405 error from DELETE endpoint.
   * ============================================================
   */

  const deleteExistingImage = (
    image: PGImage
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this image?'
    );

    if (!confirmed) return;

    setExistingImages((previous) =>
      previous.filter(
        (item) =>
          item.publicId !== image.publicId
      )
    );

    setMessage(
      'Image removed. Save changes to confirm the update.'
    );
  };

  /*
   * ============================================================
   * NAVIGATION
   * ============================================================
   */

  const nextStep = () => {
    setMessage('');

    setCurrentStep((previous) =>
      Math.min(previous + 1, 6)
    );
  };

  const previousStep = () => {
    setMessage('');

    setCurrentStep((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  /*
   * ============================================================
   * UPDATE PG
   * ============================================================
   */

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setSaving(true);
    setMessage('');

    try {
      /*
       * ========================================================
       * STEP 1
       * Upload new images
       * ========================================================
       */

      let uploadedImages: PGImage[] = [];

      if (newFiles.length > 0) {
        uploadedImages = await Promise.all(
          newFiles.map(async (file) => {
            const result =
              await uploadImageToCloudinary(file);

            return {
              publicId: result.publicId,
              url: result.url,
            };
          })
        );
      }

      /*
       * ========================================================
       * STEP 2
       * Build final image list
       * ========================================================
       */

      const finalImages = [
        ...existingImages,
        ...uploadedImages,
      ];

      /*
       * ========================================================
       * STEP 3
       * Minimum 5 image validation
       * ========================================================
       */

      if (finalImages.length < MIN_IMAGES) {
        throw new Error(
          `At least ${MIN_IMAGES} images are required. Currently you have ${finalImages.length} images.`
        );
      }

      /*
       * ========================================================
       * STEP 4
       * Build final payload
       *
       * All 6 amenities are sent:
       *
       * foodAvailable
       * wifiAvailable
       * parkingAvailable
       * laundryAvailable
       * acAvailable
       * powerBackup
       * ========================================================
       */

      const payload = {
        ...form,

        rent: Number(form.rent),

        securityDeposit:
          Number(form.securityDeposit),

        images: finalImages,
      };

      /*
       * ========================================================
       * STEP 5
       * Send update to backend
       * ========================================================
       */

      const response = await fetch(
        BACKEND_ENDPOINTS.PGS.BY_ID(id),
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(payload),
        }
      );

      /*
       * Safely parse response.
       *
       * This prevents:
       * Unexpected end of JSON input
       *
       * when backend returns empty response.
       */

      if (!response.ok) {
        let errorMessage =
          'Failed to update PG.';

        try {
          const errorData =
            await response.json();

          errorMessage =
            errorData.message ||
            errorMessage;
        } catch {
          // Backend response was not JSON.
        }

        throw new Error(errorMessage);
      }

      setMessage(
        'PG updated successfully! Redirecting...'
      );

      setTimeout(() => {
        router.push(
          ROUTES.OWNER.DASHBOARD
        );
      }, 1500);
    } catch (error: unknown) {
      console.error(
        'Update PG failed:',
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update PG.';

      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-10 w-72 rounded-xl bg-slate-200" />

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="h-[600px] rounded-3xl bg-white" />

            <div className="h-[600px] rounded-3xl bg-white lg:col-span-2" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-16 pt-6 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              OWNER DASHBOARD
            </span>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Edit Your PG
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Update your PG details, amenities, location, photos and pricing.
            </p>
          </div>

          <Link
            href={ROUTES.OWNER.DASHBOARD}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* PROGRESS TRACKER */}

        <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="hidden items-center justify-between md:flex">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-3"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-black ${
                    step.id === currentStep
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : step.id < currentStep
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {step.id < currentStep
                    ? '✓'
                    : step.id}
                </div>

                <span
                  className={`text-xs font-black ${
                    step.id === currentStep
                      ? 'text-indigo-600'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between md:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                {currentStep}
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">
                  {STEPS[currentStep - 1].label}
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Step {currentStep} of 6
                </p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* MAIN FORM */}

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">

            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {currentStep}. {STEPS[currentStep - 1].label}
                </h2>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {STEPS[currentStep - 1].desc}
                </p>
              </div>

              <Save className="h-5 w-5 text-indigo-500" />
            </div>

            {message && (
              <div
                className={`mb-6 rounded-xl border p-4 text-sm font-semibold ${
                  message.includes('successfully')
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border-rose-100 bg-rose-50 text-rose-700'
                }`}
              >
                {message}
              </div>
            )}

            <form
              onSubmit={
                currentStep === 6
                  ? handleSubmit
                  : (event) =>
                      event.preventDefault()
              }
            >

              {/* STEP 1 */}

              {currentStep === 1 && (
                <div className="space-y-5">

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <label className="text-xs font-black text-slate-800">
                        PG Name
                      </label>

                      <input
                        required
                        name="pgName"
                        value={form.pgName}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-800">
                        Category
                      </label>

                      <select
                        required
                        name="category"
                        value={form.category}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold outline-none focus:border-indigo-600 focus:bg-white"
                      >
                        <option value="">
                          Select Category
                        </option>

                        <option value="Standard">
                          Standard Budget
                        </option>

                        <option value="Premium">
                          Premium
                        </option>

                        <option value="Luxury">
                          Luxury Elite
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <label className="text-xs font-black text-slate-800">
                        Suitable For
                      </label>

                      <div className="mt-3 flex flex-wrap gap-4">
                        {[
                          {
                            value: 'MALE',
                            label: 'Boys',
                          },
                          {
                            value: 'FEMALE',
                            label: 'Girls',
                          },
                          {
                            value: 'UNISEX',
                            label: 'Unisex',
                          },
                        ].map((item) => (
                          <label
                            key={item.value}
                            className="flex items-center gap-2 text-xs font-bold text-slate-700"
                          >
                            <input
                              type="radio"
                              name="gender"
                              checked={
                                form.gender === item.value
                              }
                              onChange={() =>
                                setForm((previous) => ({
                                  ...previous,
                                  gender: item.value,
                                }))
                              }
                            />

                            {item.label}
                          </label>

                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-800">
                        Room Type
                      </label>

                      <select
                        name="roomType"
                        value={form.roomType}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                      >
                        <option value="Single Sharing">
                          Single Sharing
                        </option>

                        <option value="Double Sharing">
                          Double Sharing
                        </option>

                        <option value="Triple Sharing">
                          Triple Sharing
                        </option>

                        <option value="Four Sharing">
                          Four Sharing
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-800">
                      Description
                    </label>

                    <textarea
                      required
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold outline-none focus:border-indigo-600 focus:bg-white"
                    />
                  </div>

                </div>
              )}

              {/* STEP 2 */}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {[
                    {
                      id: 'foodAvailable',
                      label: 'Catering / Meals',
                    },
                    {
                      id: 'wifiAvailable',
                      label: 'High-speed Wi-Fi',
                    },
                    {
                      id: 'parkingAvailable',
                      label: 'Reserved Parking',
                    },
                    {
                      id: 'laundryAvailable',
                      label: 'Laundry',
                    },
                    {
                      id: 'acAvailable',
                      label: 'Air Conditioner (AC)',
                    },
                    {
                      id: 'powerBackup',
                      label: '24x7 Power Backup',
                    },
                  ].map((amenity) => (
                    <label
                      key={amenity.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${
                        form[
                          amenity.id as keyof FormState
                        ]
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-100 bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(
                          form[
                            amenity.id as keyof FormState
                          ]
                        )}
                        onChange={(event) =>
                          handleCheckboxChange(
                            amenity.id as keyof FormState,
                            event.target.checked
                          )
                        }
                      />

                      <span className="text-xs font-bold text-slate-800">
                        {amenity.label}
                      </span>
                    </label>
                  ))}

                </div>
              )}

              {/* STEP 3 */}

              {currentStep === 3 && (
                <div className="space-y-4">

                  <input
                    required
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder="House No, Building name, Street name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                  />

                  <div className="grid gap-3 sm:grid-cols-3">

                    <input
                      required
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                    />

                    <input
                      required
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                    />

                    <input
                      required
                      name="pincode"
                      value={form.pincode}
                      onChange={handleInputChange}
                      placeholder="Pincode"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                    />
                  </div>

                  <input
                    required
                    name="landmark"
                    value={form.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby Landmark"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                  />

                </div>
              )}

              {/* STEP 4 */}

              {currentStep === 4 && (
                <div className="space-y-6">

                  {/* EXISTING IMAGES */}

                  <div>

                    <div className="mb-3 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-indigo-600" />

                      <h3 className="text-sm font-black text-slate-900">
                        Existing Images
                      </h3>
                    </div>

                    <div
                      className={`mb-4 rounded-xl p-3 text-xs font-bold ${
                        existingImages.length +
                          newFiles.length <
                        MIN_IMAGES
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      Total images after update:{' '}
                      {existingImages.length +
                        newFiles.length}{' '}
                      / minimum {MIN_IMAGES}
                    </div>

                    {existingImages.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-4 text-xs font-semibold text-slate-500">
                        No existing images found.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                        {existingImages.map((image) => (
                          <div
                            key={image.publicId}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                          >
                            <Image
                              src={image.url}
                              alt="PG image"
                              fill
                              className="object-cover"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                deleteExistingImage(
                                  image
                                )
                              }
                              className="absolute right-2 top-2 rounded-lg bg-rose-600 p-2 text-white opacity-0 transition group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                      </div>
                    )}

                  </div>

                  {/* UPLOAD NEW IMAGES */}

                  <div>

                    <div className="mb-3 flex items-center gap-2">
                      <Upload className="h-5 w-5 text-indigo-600" />

                      <h3 className="text-sm font-black text-slate-900">
                        Add New Images
                      </h3>
                    </div>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:bg-slate-100">

                      <Upload className="mb-3 h-8 w-8 text-indigo-500" />

                      <p className="text-xs font-black text-slate-700">
                        Click to upload new images
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-slate-400">
                        You can select multiple images
                      </p>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* NEW IMAGE PREVIEWS */}

                  {newPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                      {newPreviews.map(
                        (preview, index) => (
                          <div
                            key={preview}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                          >
                            <Image
                              src={preview}
                              alt={`New image ${
                                index + 1
                              }`}
                              fill
                              className="object-cover"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeNewImage(
                                  index
                                )
                              }
                              className="absolute right-2 top-2 rounded-lg bg-rose-600 p-2 text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* STEP 5 */}

              {currentStep === 5 && (
                <div className="space-y-5">

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <label className="text-xs font-black text-slate-800">
                        Monthly Rent
                      </label>

                      <input
                        required
                        type="number"
                        name="rent"
                        value={form.rent}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-800">
                        Security Deposit
                      </label>

                      <input
                        required
                        type="number"
                        name="securityDeposit"
                        value={
                          form.securityDeposit
                        }
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-800">
                      Notice Period
                    </label>

                    <select
                      name="noticePeriod"
                      value={form.noticePeriod}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold"
                    >
                      <option value="None">
                        No Notice Period
                      </option>

                      <option value="1 Month">
                        1 Month Notice
                      </option>

                      <option value="2 Months">
                        2 Months Notice
                      </option>
                    </select>
                  </div>

                </div>
              )}

              {/* STEP 6 */}

              {currentStep === 6 && (
                <div className="space-y-5">

                  <div className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">

                    <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-600" />

                    <div>
                      <p className="text-sm font-black text-indigo-950">
                        Ready to update your PG
                      </p>

                      <p className="mt-1 text-xs font-medium text-indigo-700">
                        Please verify all information before saving changes.
                      </p>
                    </div>

                  </div>

                  <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-xs font-semibold text-slate-600">

                    <p>
                      <b className="text-slate-400">
                        PG Name:
                      </b>{' '}
                      {form.pgName}
                    </p>

                    <p>
                      <b className="text-slate-400">
                        Category:
                      </b>{' '}
                      {form.category}
                    </p>

                    <p>
                      <b className="text-slate-400">
                        Gender:
                      </b>{' '}
                      {form.gender}
                    </p>

                    <p>
                      <b className="text-slate-400">
                        Room Type:
                      </b>{' '}
                      {form.roomType}
                    </p>

                    <p>
                      <b className="text-slate-400">
                        Location:
                      </b>{' '}
                      {form.city},{' '}
                      {form.state}
                    </p>

                    <p>
                      <b className="text-slate-400">
                        Rent:
                      </b>{' '}
                      ${form.rent}
                    </p>

                    <p>
                      <b className="text-slate-400">
                        Final Images:
                      </b>{' '}
                      {existingImages.length +
                        newFiles.length}
                    </p>

                  </div>

                </div>
              )}

              {/* FOOTER BUTTONS */}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={previousStep}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-5 py-3 text-xs font-black text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <Link
                    href={ROUTES.OWNER.DASHBOARD}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-5 py-3 text-xs font-black text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Link>
                )}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-black text-white hover:bg-indigo-700"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-xs font-black text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating PG...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                )}

              </div>

            </form>
          </div>

          {/* SIDEBAR */}

          <div className="space-y-6">

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

              <h3 className="text-sm font-black text-slate-950">
                Editing Your Listing
              </h3>

              <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
                Keep your PG information accurate and updated. Students depend on current pricing, amenities and photos.
              </p>

              <div className="mt-5 space-y-3">

                <div className="flex gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

                  <p className="text-xs font-semibold text-slate-600">
                    Update rent and availability information.
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

                  <p className="text-xs font-semibold text-slate-600">
                    Keep your amenities accurate.
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

                  <p className="text-xs font-semibold text-slate-600">
                    Add new images whenever necessary.
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <HelpCircle className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Need Help?
                  </h3>

                  <p className="text-xs font-medium text-slate-500">
                    Contact support for assistance.
                  </p>
                </div>

              </div>

              <Link
                href={ROUTES.SUPPORT}
                className="mt-5 block rounded-xl border-2 border-indigo-600 px-4 py-3 text-center text-xs font-black text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
              >
                Contact Support
              </Link>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}