'use client';

import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { useSessionQuery } from '@/features/auth/api/authApi';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { 
  Tv, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle, 
  MessageSquare,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Trash2,
  Save
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Basic Details', desc: 'Provide core information about your PG.' },
  { id: 2, label: 'Amenities', desc: 'Select the facilities provided.' },
  { id: 3, label: 'Location', desc: 'Specify exact address & destination.' },
  { id: 4, label: 'Photos', desc: 'Upload high-quality images (Min 5).' },
  { id: 5, label: 'Pricing', desc: 'Set up rent and structure.' },
  { id: 6, label: 'Preview & Submit', desc: 'Review all data before submitting.' }
];

interface ImageObject {
  publicId: string;
  url: string;
}

export default function AddPgPage() {
  const router = useRouter();
  const { data: session, isLoading: isSessionLoading } = useSessionQuery();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  
  // Dynamic Form State
  const [form, setForm] = useState({
    pgName: '',
    description: '',
    gender: 'MALE',
    roomType: 'Single Sharing',
    category: '', 
    // Amenities
    foodAvailable: false,
    wifiAvailable: false,
    parkingAvailable: false,
    laundryAvailable: false,
    acAvailable: false,
    powerBackup: false,
    // Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    // Pricing
    rent: '',
    securityDeposit: '',
    noticePeriod: '1 Month',
  });

  // State for handling up to 5+ images locally for preview before upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const verificationStatus = session?.profile?.verificationStatus ?? 'NOT_VERIFIED';

  // EFFECT: Load draft data if exists on page mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('pg_form_draft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setForm(parsedDraft.form);
        setCurrentStep(parsedDraft.currentStep || 1);
        setMessage('Loaded your previously saved draft!');
      } catch (e) {
        console.error("Error parsing draft data", e);
      }
    }
  }, []);

  // Function to Handle Saving Draft Localized
  const handleSaveDraft = () => {
    try {
      const draftData = {
        form,
        currentStep
      };
      localStorage.setItem('pg_form_draft', JSON.stringify(draftData));
      setMessage('Draft saved successfully! Redirecting...');
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push(ROUTES.OWNER.DASHBOARD);
      }, 1500);
    } catch {
      setMessage('Failed to save draft locally.');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  // Image Selection & Validation
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);

      const filePreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...filePreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Step Navigation Controllers
  const nextStep = () => {
    if (currentStep === 4 && selectedFiles.length < 5) {
      setMessage('Please upload at least 5 images to proceed.');
      return;
    }
    setMessage('');
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setMessage('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Final Form Submission Pipeline
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (verificationStatus !== 'VERIFIED') {
      setMessage('Please verify yourself, then list your PG.');
      return;
    }
    if (selectedFiles.length < 5) {
      setMessage('Error: A minimum of 5 images are required before final submission.');
      setCurrentStep(4);
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const uploadedImages: ImageObject[] = await Promise.all(
        selectedFiles.map(async (file) => {
          const res = await uploadImageToCloudinary(file);
          return { publicId: res.publicId, url: res.url };
        })
      );
      
      const payload = {
        ...form,
        rent: Number(form.rent),
        securityDeposit: Number(form.securityDeposit),
        images: uploadedImages,
      };
      
      const response = await fetch(BACKEND_ENDPOINTS.PGS.OWNER_LISTINGS, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include',
        body: JSON.stringify(payload) 
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create PG listing.');
      
      // Clear draft upon successful live submission
      localStorage.removeItem('pg_form_draft');
      
      setMessage('Listing submitted successfully! Redirecting to Dashboard...');
      setTimeout(() => {
        router.push(ROUTES.OWNER.DASHBOARD);
      }, 2000);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not create listing. Please try again.';
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  if (isSessionLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">Checking owner verification...</div>;
  }

  if (verificationStatus !== 'VERIFIED') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
          <ShieldCheck className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="mt-5 text-2xl font-black text-slate-950">Please verify yourself first</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Complete owner verification, then list your PG. Your documents will be reviewed securely by our team.</p>
          <Link href="/owner/settings" className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 cursor-pointer">Go to verification</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-6 sm:py-12 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ============ HERO BANNER SECTION ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 md:p-12 border border-slate-200/80 shadow-xs mb-12">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-3">HOST ONBOARDING</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              List Your PG, <br />
              <span className="text-emerald-600">Reach Thousands of Students</span>
            </h1>
            <p className="mt-3 text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
              Complete our structured 6-stage verification wizard to showcase your property directly to authenticated student leads in Bhopal.
            </p>
          </div>
          <div className="relative w-full h-48 sm:h-56 flex justify-center items-center">
            <Image src="/list your pg.png" alt="List your PG illustration" fill className="object-contain" priority />
          </div>
        </div>

        {/* ============ DYNAMIC PROGRESS TRACKER BLOCK ============ */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 mb-8">
          <div className="hidden md:flex justify-between items-center relative px-6 py-2">
            <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-slate-100 -translate-y-1/2 -z-10" />
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-4 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  step.id === currentStep ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' :
                  step.id < currentStep ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                <span className={`text-xs font-extrabold tracking-tight ${step.id === currentStep ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Linear Steps */}
          <div className="md:hidden flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-emerald-600 rounded-full text-white font-bold text-xs flex items-center justify-center">{currentStep}</span>
              <div>
                <p className="text-xs font-black text-slate-900">{STEPS[currentStep - 1].label}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stage {currentStep} of 6</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* ============ MAIN INTERACTIVE WORKSPACE ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <div className="border-b border-slate-100 pb-5 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">{currentStep}. {STEPS[currentStep - 1].label}</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{STEPS[currentStep - 1].desc}</p>
              </div>
              {/* Contextual Draft Saving Trigger for quick desktop use */}
              {currentStep > 1 && (
                <button type="button" onClick={handleSaveDraft} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer" title="Save current progress as draft">
                  <Save className="w-3.5 h-3.5" /> Save Draft
                </button>
              )}
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-semibold border ${
                message.includes('successfully') || message.includes('Loaded') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={currentStep === 6 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
              
              {/* STAGE 1: BASIC DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-800 tracking-wide">PG Name <span className="text-rose-500">*</span></label>
                      <input required type="text" name="pgName" value={form.pgName} onChange={handleInputChange} placeholder="e.g. Stanza Living Boston House" className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-800 tracking-wide">PG Category <span className="text-rose-500">*</span></label>
                      <select required name="category" value={form.category} onChange={handleInputChange} className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all cursor-pointer">
                        <option value="">Select Category</option>
                        <option value="Standard">Standard Budget</option>
                        <option value="Premium">Premium</option>
                        <option value="Luxury">Luxury Elite</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-800 tracking-wide">Suitable For <span className="text-rose-500">*</span></label>
                      <div className="flex items-center gap-4 mt-2 text-xs font-bold text-slate-700">
                        {[
                            { value: "MALE", label: "Boys" },
                            { value: "FEMALE", label: "Girls" },
                            { value: "UNISEX", label: "Unisex" }
                          ].map((item) => (
                            <label
                              key={item.value}
                              className="flex items-center gap-1.5 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="gender"
                                checked={form.gender === item.value}
                                onChange={() =>
                                  setForm({
                                    ...form,
                                    gender: item.value
                                  })
                                }
                                className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              {item.label}
                            </label>
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-800 tracking-wide">Room Type Configuration <span className="text-rose-500">*</span></label>
                      <select name="roomType" value={form.roomType} onChange={handleInputChange} className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none transition-all">
                        <option value="Single Sharing">Single Sharing</option>
                        <option value="Double Sharing">Double Sharing</option>
                        <option value="Triple Sharing">Triple Sharing</option>
                        <option value="Four Sharing">Four Sharing</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-800 tracking-wide">PG Description <span className="text-rose-500">*</span></label>
                    <textarea required name="description" maxLength={500} value={form.description} onChange={handleInputChange} placeholder="Give distinct highlights of your PG (rules, landmarks, timings, restriction if any)..." rows={4} className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none resize-none transition-all" />
                  </div>
                </div>
              )}

              {/* STAGE 2: AMENITIES MATRIX */}
              {currentStep === 2 && (
                <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                  {[
                    { id: 'foodAvailable', label: 'Catering / Meals' },
                    { id: 'wifiAvailable', label: 'High-speed Wi-Fi' },
                    { id: 'parkingAvailable', label: 'Reserved Parking' },
                    { id: 'laundryAvailable', label: 'Washing Machine / Laundry' },
                    { id: 'acAvailable', label: 'Air Conditioner (AC)' },
                    { id: 'powerBackup', label: '24x7 Power Backup' },
                  ].map((amenity) => (
                    <label key={amenity.id} className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                      form[amenity.id as keyof typeof form] ? 'border-emerald-600 bg-emerald-50/40 text-emerald-800' : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50'
                    }`}>
                      <input type="checkbox" checked={!!form[amenity.id as keyof typeof form]} onChange={(e) => handleCheckboxChange(amenity.id, e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
                      <span className="text-xs font-bold text-slate-800">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* STAGE 3: LOCATION ENGINE */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-800 tracking-wide">Street Address <span className="text-rose-500">*</span></label>
                    <input required type="text" name="address" value={form.address} onChange={handleInputChange} placeholder="House No, Building name, Street name" className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input required type="text" name="city" value={form.city} onChange={handleInputChange} placeholder="City" className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                    <input required type="text" name="state" value={form.state} onChange={handleInputChange} placeholder="State" className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                    <input required type="text" name="pincode" value={form.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-800 tracking-wide">Nearby Landmark <span className="text-rose-500">*</span></label>
                    <input required type="text" name="landmark" value={form.landmark} onChange={handleInputChange} placeholder="e.g. Near Metro Station Gate No. 2" className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                  </div>
                </div>
              )}

              {/* STAGE 4: PHOTOS DISPATCHER */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/30 hover:bg-slate-50/70 transition-all flex flex-col items-center justify-center relative cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                    <p className="text-xs font-bold text-slate-700">Click or Drag images here to upload</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Mandatory: Please upload at least 5 high-resolution images</p>
                  </div>

                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                      {previews.map((src, index) => (
                        <div key={index} className="relative aspect-square border border-slate-100 rounded-xl overflow-hidden group shadow-sm">
                          <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1.5 bg-rose-600 rounded-lg text-white opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-slate-950/70 px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                            Img {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${previews.length >= 5 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                      {previews.length >= 5 ? '✓' : '!'}
                    </div>
                    <p className="text-[11px] font-bold text-slate-600">
                      Current Count: <span className="text-emerald-700 font-extrabold">{previews.length}</span> images loaded.
                      {previews.length < 5 && ` (Need ${5 - previews.length} more)`}
                    </p>
                  </div>
                </div>
              )}

              {/* STAGE 5: PRICING */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-800 tracking-wide">Monthly Rent Amount (₹) <span className="text-rose-500">*</span></label>
                      <input required type="number" name="rent" value={form.rent} onChange={handleInputChange} placeholder="e.g. 8500" className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-800 tracking-wide">Security Deposit (₹) <span className="text-rose-500">*</span></label>
                      <input required type="number" name="securityDeposit" value={form.securityDeposit} onChange={handleInputChange} placeholder="e.g. 15000" className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-800 tracking-wide">Notice Period Requirement <span className="text-rose-500">*</span></label>
                    <select name="noticePeriod" value={form.noticePeriod} onChange={handleInputChange} className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-emerald-600 cursor-pointer">
                      <option value="None">No Notice Period</option>
                      <option value="1 Month">1 Month Notice</option>
                      <option value="2 Months">2 Months Notice</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STAGE 6: PREVIEW */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 text-xs font-bold text-emerald-950 flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p>Data Verification Auditing Mode Active</p>
                      <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Please scan through your compiled dataset below before publishing onto the production network.</p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                    <div className="bg-slate-50 px-4 py-2.5 font-black text-slate-900 border-b border-slate-100">Compiled Core Architecture Matrix</div>
                    <div className="p-4 space-y-3 font-semibold text-slate-600">
                      <p><span className="text-slate-400">PG Identity Name:</span> {form.pgName || 'N/A'}</p>
                      <p><span className="text-slate-400">Audience Strategy / Room:</span> {form.gender} • {form.roomType} ({form.category || 'Standard'})</p>
                      <p><span className="text-slate-400">Financial Framework:</span> Monthly Rent: ₹{form.rent} | Deposit: ₹{form.securityDeposit}</p>
                      <p><span className="text-slate-400">Deployment Target Node:</span> {form.address}, {form.city}, {form.state} - {form.pincode}</p>
                      <p><span className="text-slate-400">Active Amenities Checksums:</span> {[
                        form.wifiAvailable && 'Wi-Fi',
                        form.foodAvailable && 'Meals',
                        form.parkingAvailable && 'Parking',
                        form.laundryAvailable && 'Laundry',
                        form.acAvailable && 'AC',
                        form.powerBackup && 'Power Backup'
                      ].filter(Boolean).join(', ') || 'None selected'}</p>
                      <p><span className="text-slate-400">Total Image Asset Batches:</span> {selectedFiles.length} files staged for Cloudinary transit pipelines.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions Footer Dynamic Framework */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
                {currentStep > 1 ? (
                  <div className="flex w-full sm:w-auto gap-2">
                    <button type="button" onClick={prevStep} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border-2 border-slate-200 text-slate-600 font-extrabold px-5 py-3 rounded-xl hover:bg-slate-50 text-xs tracking-wide shadow-xs cursor-pointer" >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={handleSaveDraft} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border border-dashed border-emerald-200 bg-emerald-50/40 text-emerald-700 font-bold px-4 py-3 rounded-xl hover:bg-emerald-100 text-xs cursor-pointer" >
                      Save Draft
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={handleSaveDraft} className="w-full sm:w-auto text-center border-2 border-slate-200 text-slate-600 font-extrabold px-5 py-3 rounded-xl hover:bg-slate-50 text-xs tracking-wide shadow-xs cursor-pointer" >
                    Cancel &amp; Save Draft
                  </button>
                )}

                {currentStep < 6 ? (
                  <button type="button" onClick={nextStep} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl hover:bg-emerald-700 text-xs tracking-wide shadow-xs cursor-pointer" >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-extrabold px-8 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-60 text-xs tracking-wide shadow-md active:scale-97 cursor-pointer" >
                    {loading ? 'Processing Uploads & Finalizing...' : 'Commit Submission & Go Live'}
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Right Side Sidebar Widget Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
              <h3 className="text-sm font-black text-slate-950 tracking-tight mb-4">Why List on StudentPG?</h3>
              <div className="space-y-4">
                {[
                  { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'High Visibility', desc: 'Your PG will be visible to thousands of students actively searching.' },
                  { icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'Trusted Platform', desc: 'We verify every listing to maintain quality and trust.' },
                  { icon: <MessageSquare className="w-4 h-4" />, color: 'bg-slate-50 text-slate-700 border-slate-200', title: 'Direct Contact', desc: 'Students can contact you directly via call or WhatsApp.' },
                  { icon: <Tv className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'Grow Your Business', desc: 'Get more inquiries and increase your bookings.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>{item.icon}</div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
              <h3 className="text-sm font-black text-slate-950 tracking-tight">Need Help?</h3>
              <p className="text-[11px] font-medium text-slate-500 mt-1 mb-4">Our support team is here to help you at every step.</p>
              <Link href={ROUTES.SUPPORT} className="w-full inline-flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-700 font-extrabold px-4 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-200 text-xs shadow-xs cursor-pointer" >
                <HelpCircle className="w-4 h-4" /> Contact Support
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}