import React, { useState, useEffect } from "react";
import { createPG } from "../services/api/pg.api";
import { getAllAmenities } from "../services/api/amenity.api";
import { 
  MdBusiness, MdPerson, MdContactPhone, MdFingerprint, 
  MdCloudUpload, MdCheckCircle, MdPhotoLibrary 
} from "react-icons/md";

export default function AddPG() {
  // 1. Expanded Real-World Core Form State
  const [formData, setFormData] = useState({
    // Owner Personal Details
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAddress: "",
    
    // Identity Verification (Redacted Storage Format Tokens)
    identityRefNumber: "", // Identity verification number placeholder
    identityFrontUrl: "",
    identityBackUrl: "",
    ownerPhotoUrl: "",

    // PG Core Specifications
    title: "",
    area: "",
    price: "",
    deposit: "",
    gender: "Boys",
    amenities: [],
    
    // Property Images Array Layout
    propertyImages: [],
  });

  // 2. Active Lifecycle Tracking Nodes
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState(""); // Tracks which image is processing
  const [fetchingAmenities, setFetchingAmenities] = useState(true);

  // Fetch verified system amenities dataset on load
  useEffect(() => {
    let isMounted = true;
    getAllAmenities()
      .then((data) => {
        if (isMounted) setAvailableAmenities(data || []);
      })
      .catch((err) => console.error("Failed loading system options database:", err))
      .finally(() => {
        if (isMounted) setFetchingAmenities(false);
      });

    return () => { isMounted = false; };
  }, []);

  /**
   * DIRECT CLOUDINARY UPLOAD PIPELINE
   */
  const uploadImageToCloudinary = async (file, fieldName) => {
    if (!file) return;
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setStatus({
        type: "error",
        message: "Cloudinary configuration variables are missing inside environment settings.",
      });
      return;
    }

    setUploadingField(fieldName);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data }
      );
      const fileData = await response.json();
      
      if (fileData.secure_url) {
        if (fieldName === "propertyImages") {
          setFormData((prev) => ({
            ...prev,
            propertyImages: [...prev.propertyImages, fileData.secure_url],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [fieldName]: fileData.secure_url,
          }));
        }
      }
    } catch (err) {
      console.error("Cloudinary upload asset rejection:", err);
      alert("Failed to host image assets onto storage cloud. Try again.");
    } finally {
      setUploadingField("");
    }
  };

  const toggleAmenity = (name) => {
    const updated = formData.amenities.includes(name)
      ? formData.amenities.filter((a) => a !== name)
      : [...formData.amenities, name];
    setFormData({ ...formData, amenities: updated });
  };

  /**
   * DISPATCH CONTROL FORM PAYLOAD
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mandatory Validations Safeguard
    if (!formData.identityFrontUrl || !formData.identityBackUrl || !formData.ownerPhotoUrl) {
      setStatus({ type: "error", message: "Verification failed. Please upload all missing identity verification media components." });
      return;
    }
    if (formData.propertyImages.length === 0) {
      setStatus({ type: "error", message: "Validation context rejected. Upload at least one property image node." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await createPG({
        ...formData,
        price: Number(formData.price),
        deposit: Number(formData.deposit),
      });

      setStatus({
        type: "success",
        message: "Success! Secure onboarding complete. Property queued for review.",
      });

      // Clear layout buffers seamlessly
      setFormData({
        ownerName: "", ownerEmail: "", ownerPhone: "", ownerAddress: "",
        identityRefNumber: "", identityFrontUrl: "", identityBackUrl: "", ownerPhotoUrl: "",
        title: "", area: "", price: "", deposit: "", gender: "Boys", amenities: [],
        propertyImages: [],
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Data transmission mapping error encountered inside production network.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto my-12 px-4 flex-grow w-full">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
        
        <h1 className="text-xl font-bold text-slate-900 mb-1">Verify Host & Upload PG</h1>
        <p className="text-xs text-slate-400 mb-6">Complete identity registration and property asset mapping protocols.</p>

        {status.message && (
          <div className={`p-3 rounded-lg text-xs font-bold mb-6 ${status.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: OWNER MANDATORY INFRASTRUCTURE */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <MdPerson className="text-base text-emerald-500" />
              <span>1. Host Personal Profile</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" required placeholder="Full Name" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              <input type="email" required placeholder="Contact Email Address" value={formData.ownerEmail} onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="tel" required placeholder="Mobile Phone Number" value={formData.ownerPhone} onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              <input type="text" placeholder="Permanent Home Address (Optional)" value={formData.ownerAddress} onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
            </div>
          </div>

          {/* SECTION 2: IDENTITY COMPLIANCE & MEDIA LOCKER */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <MdFingerprint className="text-base text-emerald-500" />
              <span>2. Identity & Profile Verification</span>
            </h2>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Aadhaar Verification Identification Number</label>
              <input type="text" required placeholder="12-Digit Identity Number" maxLength="12" value={formData.identityRefNumber} onChange={(e) => setFormData({ ...formData, identityRefNumber: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* OWNER PHOTO */}
              <div className="border border-dashed border-slate-200 p-3 rounded-lg text-center bg-slate-50/50 flex flex-col justify-between min-h-[110px]">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Owner Profile Photo</span>
                {formData.ownerPhotoUrl ? (
                  <span className="text-emerald-600 flex items-center justify-center gap-0.5 text-[11px] font-bold py-2"><MdCheckCircle /> Locked</span>
                ) : (
                  <label className="cursor-pointer bg-slate-900 text-white text-[10px] py-1.5 px-2 rounded font-bold block hover:bg-slate-800">
                    {uploadingField === "ownerPhotoUrl" ? "Uploading..." : "Choose Image"}
                    <input type="file" accept="image/*" disabled={uploadingField !== ""} onChange={(e) => uploadImageToCloudinary(e.target.files[0], "ownerPhotoUrl")} className="hidden" />
                  </label>
                )}
              </div>

              {/* AADHAAR FRONT */}
              <div className="border border-dashed border-slate-200 p-3 rounded-lg text-center bg-slate-50/50 flex flex-col justify-between min-h-[110px]">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Aadhaar Document (Front)</span>
                {formData.identityFrontUrl ? (
                  <span className="text-emerald-600 flex items-center justify-center gap-0.5 text-[11px] font-bold py-2"><MdCheckCircle /> Locked</span>
                ) : (
                  <label className="cursor-pointer bg-slate-900 text-white text-[10px] py-1.5 px-2 rounded font-bold block hover:bg-slate-800">
                    {uploadingField === "identityFrontUrl" ? "Uploading..." : "Upload File"}
                    <input type="file" accept="image/*" disabled={uploadingField !== ""} onChange={(e) => uploadImageToCloudinary(e.target.files[0], "identityFrontUrl")} className="hidden" />
                  </label>
                )}
              </div>

              {/* AADHAAR BACK */}
              <div className="border border-dashed border-slate-200 p-3 rounded-lg text-center bg-slate-50/50 flex flex-col justify-between min-h-[110px]">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Aadhaar Document (Back)</span>
                {formData.identityBackUrl ? (
                  <span className="text-emerald-600 flex items-center justify-center gap-0.5 text-[11px] font-bold py-2"><MdCheckCircle /> Locked</span>
                ) : (
                  <label className="cursor-pointer bg-slate-900 text-white text-[10px] py-1.5 px-2 rounded font-bold block hover:bg-slate-800">
                    {uploadingField === "identityBackUrl" ? "Uploading..." : "Upload File"}
                    <input type="file" accept="image/*" disabled={uploadingField !== ""} onChange={(e) => uploadImageToCloudinary(e.target.files[0], "identityBackUrl")} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: PG OPERATIONAL PARAMETERS */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <MdBusiness className="text-base text-emerald-500" />
              <span>3. Property Logistics & Rent Matrix</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">PG Title</label>
              <input type="text" required placeholder="e.g., Luxury Sharing Lounge at Zone 2" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 font-medium" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Bhopal Territory</label>
                <select value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-semibold" required>
                  <option value="">Choose Area</option>
                  <option value="MP Nagar">MP Nagar</option>
                  <option value="Indrapuri">Indrapuri</option>
                  <option value="Ayodhya Bypass">Ayodhya Bypass</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Demographic</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-semibold" required>
                  <option value="Boys">Boys Only</option>
                  <option value="Girls">Girls Only</option>
                  <option value="Unisex">Co-living (Unisex)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Rent (₹ / Month)</label>
                <input type="number" required min="0" placeholder="Rent" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Security Deposit (₹)</label>
                <input type="number" required min="0" placeholder="Deposit" value={formData.deposit} onChange={(e) => setFormData({ ...formData, deposit: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              </div>
            </div>
          </div>

          {/* SECTION 4: PROPERTY IMAGES (CLOUDINARY STACK MULTI UPLOAD) */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <MdPhotoLibrary className="text-base text-emerald-500" />
              <span>4. Property Image Portfolio</span>
            </h2>
            
            <div className="border-2 border-dashed border-slate-200 p-4 rounded-xl text-center bg-slate-50/50">
              <MdCloudUpload className="mx-auto text-3xl text-slate-400 mb-1.5" />
              <p className="text-[11px] font-bold text-slate-600 mb-2">Upload Room Galleries, Washroom and Front Views</p>
              
              <label className="inline-block cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider py-2 px-4 rounded-lg">
                {uploadingField === "propertyImages" ? "Processing File Upload..." : "Select Images"}
                <input type="file" accept="image/*" disabled={uploadingField !== ""} onChange={(e) => uploadImageToCloudinary(e.target.files[0], "propertyImages")} className="hidden" />
              </label>

              {formData.propertyImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-200">
                  {formData.propertyImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg border bg-white overflow-hidden shadow-xs">
                      <img src={url} alt="Uploaded Room Asset" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-emerald-500 text-black font-black text-[8px] px-1 rounded">✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: AMENITIES SYSTEM */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700">5. Select Provided Amenities</label>
            {fetchingAmenities ? (
              <div className="text-[11px] font-medium text-slate-400 py-2">Syncing database parameters...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableAmenities.map((amt) => {
                  const targetIdentifier = amt.name || amt;
                  const isChecked = formData.amenities.includes(targetIdentifier);
                  return (
                    <button type="button" key={amt.id || amt._id || targetIdentifier} onClick={() => toggleAmenity(targetIdentifier)} className={`p-2.5 text-xs font-semibold rounded-lg border transition-all text-left flex items-center justify-between ${isChecked ? "bg-emerald-500 border-emerald-600 text-slate-950 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                      <span>{targetIdentifier}</span>
                      {isChecked && <span className="text-[10px] bg-slate-950 text-white px-1 rounded">&bull;</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* TRANSMIT TRIGGER ACTION BUTTON */}
          <button type="submit" disabled={loading || uploadingField !== "" || fetchingAmenities} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-xs tracking-wider transition-all shadow-md disabled:opacity-40">
            {loading ? "Transmitting payload matrices to core database..." : "Submit Host Profile & Listing Data"}
          </button>
        </form>
      </div>
    </main>
  );
}