import React, { useState, useEffect } from "react";
import { createPG } from "../services/api/pg.api";
import { getAllAmenities } from "../services/api/amenity.api";
import { uploadToCloudinary } from "../utils/cloudinaryUpload"; // Path check kar lena apne folder structure ke hisab se
import { 
  MdBusiness, MdPerson, MdContactPhone, MdFingerprint, 
  MdCloudUpload, MdCheckCircle, MdPhotoLibrary 
} from "react-icons/md";

export default function AddPG() {
  // 1. Core Form State Linked to Java Model Fields
  const [formData, setFormData] = useState({
    pgName: "",
    description: "",
    address: "",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "",
    rent: "",
    gender: "Boys",
    roomType: "Single",
    
    // Feature Toggles mapped from amenities
    foodAvailable: false,
    wifiAvailable: false,
    parkingAvailable: false,
    laundryAvailable: false,

    // Identity Verification (Redacted Local Mock Fields)
    identityRefNumber: "", 
    identityFrontUrl: "",
    identityBackUrl: "",
    ownerPhotoUrl: "",

    // UI Local state for mapped asset schemas
    uploadedImageUrls: []
  });

  // 2. Active Lifecycle Tracking Nodes
  const [availableAmenities, setAvailableAmenities] = useState([
    "WiFi", "Food", "Parking", "Laundry"
  ]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState(""); 
  const [fetchingAmenities, setFetchingAmenities] = useState(false);

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

    try {
      // Direct ingestion pipeline call utilizing modular utils implementation safely
      const secureUrl = await uploadToCloudinary(file);
      
      if (secureUrl) {
        if (fieldName === "propertyImages") {
          setFormData((prev) => ({
            ...prev,
            uploadedImageUrls: [...prev.uploadedImageUrls, secureUrl],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [fieldName]: secureUrl,
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

  const handleAmenityChange = (amenityKey) => {
    const fieldMap = {
      "WiFi": "wifiAvailable",
      "Food": "foodAvailable",
      "Parking": "parkingAvailable",
      "Laundry": "laundryAvailable"
    };

    const stateField = fieldMap[amenityKey];
    if (stateField) {
      setFormData((prev) => ({
        ...prev,
        [stateField]: !prev[stateField]
      }));
    }
  };

  /**
   * DISPATCH CONTROL FORM PAYLOAD MAPPED TO JAVA PG.JAVA DTO
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.uploadedImageUrls.length === 0) {
     setStatus({ type: "error", message: "Please upload at least one PG photo!" });

      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    // Construct Backend payload to match exactly List<PGImage> structure or Flat reference
    const backendPayload = {
      pgName: formData.pgName,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      rent: Number(formData.rent),
      gender: formData.gender,
      roomType: formData.roomType,
      foodAvailable: formData.foodAvailable,
      wifiAvailable: formData.wifiAvailable,
      parkingAvailable: formData.parkingAvailable,
      laundryAvailable: formData.laundryAvailable,
      // Map array strings cleanly to whatever layout the DB adapter uses
      images: formData.uploadedImageUrls.map((url) => ({ url: url }))
    };

    try {
      await createPG(backendPayload);

      setStatus({
  type: "success",
  message: "Congratulations! Your PG has been registered. It will be visible to everyone after admin approval.",
});


      // Clear layout buffers seamlessly
      setFormData({
        pgName: "", description: "", address: "", city: "Bhopal", state: "Madhya Pradesh", pincode: "",
        rent: "", gender: "Boys", roomType: "Single",
        foodAvailable: false, wifiAvailable: false, parkingAvailable: false, laundryAvailable: false,
        identityRefNumber: "", identityFrontUrl: "", identityBackUrl: "", ownerPhotoUrl: "",
        uploadedImageUrls: [],
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
        
<h1 className="text-xl font-bold text-slate-900 mb-1">List Your PG</h1>
<p className="text-xs text-slate-400 mb-6">Please enter correct details so students can find your PG.</p>


        {status.message && (
          <div className={`p-3 rounded-lg text-xs font-bold mb-6 ${status.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: CORE PROPERTY INFRASTRUCTURE */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <MdPerson className="text-base text-emerald-500" />
              <span>1. Basic Details of PG</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">PG Name</label>
                <input type="text" required placeholder="e.g., Luxury Sharing Lounge" value={formData.pgName} onChange={(e) => setFormData({ ...formData, pgName: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                <input type="text" required placeholder="Brief description about rooms" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Address</label>
                <input type="text" required placeholder="Street No, Area Layout" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                <input type="text" required placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Pincode</label>
                <input type="text" required placeholder="e.g., 462001" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              </div>
            </div>
          </div>

          {/* SECTION 2: IDENTITY DATA LOCKER */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <MdFingerprint className="text-base text-emerald-500" />
              <span>2. Owner Identity Verification </span>
            </h2>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Verification Identification Number</label>
              <input type="text" placeholder="12-Digit Identity Number" maxLength="12" value={formData.identityRefNumber} onChange={(e) => setFormData({ ...formData, identityRefNumber: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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

              <div className="border border-dashed border-slate-200 p-3 rounded-lg text-center bg-slate-50/50 flex flex-col justify-between min-h-[110px]">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">ID Card (Front)</span>
                {formData.identityFrontUrl ? (
                  <span className="text-emerald-600 flex items-center justify-center gap-0.5 text-[11px] font-bold py-2"><MdCheckCircle /> Locked</span>
                ) : (
                  <label className="cursor-pointer bg-slate-900 text-white text-[10px] py-1.5 px-2 rounded font-bold block hover:bg-slate-800">
                    {uploadingField === "identityFrontUrl" ? "Uploading..." : "Upload File"}
                    <input type="file" accept="image/*" disabled={uploadingField !== ""} onChange={(e) => uploadImageToCloudinary(e.target.files[0], "identityFrontUrl")} className="hidden" />
                  </label>
                )}
              </div>

              <div className="border border-dashed border-slate-200 p-3 rounded-lg text-center bg-slate-50/50 flex flex-col justify-between min-h-[110px]">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">ID Card (Back)</span>
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
              <span>3. Rent or Room Setting</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Demographic</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-semibold" required>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Room Type</label>
                <select value={formData.roomType} onChange={(e) => setFormData({ ...formData, roomType: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-semibold" required>
                  <option value="Single">Single Sharing</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Rent (₹ / Month)</label>
                <input type="number" required min="0" placeholder="Rent Value" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium" />
              </div>
            </div>
          </div>

          {/* SECTION 4: PROPERTY IMAGES */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
              <MdPhotoLibrary className="text-base text-emerald-500" />
              <span>4. Property Image Portfolio</span>
            </h2>
            
            <div className="border-2 border-dashed border-slate-200 p-4 rounded-xl text-center bg-slate-50/50">
              <MdCloudUpload className="mx-auto text-3xl text-slate-400 mb-1.5" />
              <p className="text-[11px] font-bold text-slate-600 mb-2">Upload Room Galleries and Front Views</p>
              
              <label className="inline-block cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider py-2 px-4 rounded-lg">
                {uploadingField === "propertyImages" ? "Processing File Upload..." : "Select Images"}
                <input type="file" accept="image/*" disabled={uploadingField !== ""} onChange={(e) => uploadImageToCloudinary(e.target.files[0], "propertyImages")} className="hidden" />
              </label>

              {formData.uploadedImageUrls.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-200">
                  {formData.uploadedImageUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg border bg-white overflow-hidden shadow-xs">
                      <img src={url} alt="Uploaded Room Asset" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-emerald-500 text-black font-black text-[8px] px-1 rounded">✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: AMENITIES SYSTEM LINKED TO BOOLEANS */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700">5. Select Provided Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableAmenities.map((amt) => {
                const fieldMap = { "WiFi": "wifiAvailable", "Food": "foodAvailable", "Parking": "parkingAvailable", "Laundry": "laundryAvailable" };
                const isChecked = formData[fieldMap[amt]];
                
                return (
                  <button type="button" key={amt} onClick={() => handleAmenityChange(amt)} className={`p-2.5 text-xs font-semibold rounded-lg border transition-all text-left flex items-center justify-between ${isChecked ? "bg-emerald-500 border-emerald-600 text-slate-950 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                    <span>{amt}</span>
                    {isChecked && <span className="text-[10px] bg-slate-950 text-white px-1 rounded">&bull;</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading || uploadingField !== ""} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-xs tracking-wider transition-all shadow-md disabled:opacity-40">
          {loading ? "Saving..." : "Go Live Now"}

          </button>
        </form>
      </div>
    </main>
  );
}