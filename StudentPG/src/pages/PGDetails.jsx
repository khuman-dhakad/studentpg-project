import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { ENDPOINTS } from "../services/api/axios"; // Centralized custom axios helper instance
import AmenityBadge from '../components/AmenityBadge';
import { formatINR } from "../utils/helpers";
import { getOptimizedUrl } from "../utils/cloudinaryUpload"; 
import { MdVerified, MdInfo, MdPhone, MdMail, MdLocationOn, MdChat } from 'react-icons/md';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function PGDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Core Property States
  const [pg, setPg] = useState(null);
  const [activeImage, setActiveImage] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * FETCH LIVE PG DATA FROM BACKEND BY ID
   */
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    api.get(`${ENDPOINTS.pgs.base}/${id}`)
      .then((res) => {
        if (isMounted && res.data) {
          console.log("=== API RESPONSE RECEIVED IN PG-DETAILS ===", res.data); // Debug tracking logger
          setPg(res.data);
          if (res.data.images && res.data.images.length > 0) {
            setActiveImage(res.data.images[0].url || res.data.images[0]);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("API Fetch Error on Details Node:", err);
          setError(err?.response?.data?.message || err?.message || "Property information could not be found.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-32 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-xs font-semibold text-slate-400 tracking-wide">Loading property details...</p>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <MdInfo className="text-red-500 text-3xl mx-auto mb-2" />
        <h3 className="text-sm font-bold text-red-900">Property Search Failed</h3>
        <p className="text-xs text-red-700 mt-1">{error || "The requested property listing does not exist."}</p>
      </div>
    );
  }

  const pgImagesList = pg?.images && pg.images.length > 0 ? pg.images.map(img => img.url || img) : [];
  const heroDisplayImage = activeImage || pgImagesList[0] || pg?.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000";

  // =========================================================================
  // 🟢 CRITICAL RESOLUTION LAYER: Deep scanning nested objects or fallback keys
  // =========================================================================
  const targetOwnerName = pg?.owner?.name || pg?.ownerName || pg?.owner?.ownerName || pg?.owner?.username || "Authorized Verified Owner";
  
  const targetPhoneCall = pg?.owner?.phone || pg?.ownerPhone || pg?.phone || pg?.owner?.mobile || pg?.mobile || "9";
  
  const targetWhatsappNumber = pg?.owner?.whatsappNumber || pg?.owner?.whatsappnumber || pg?.whatsappNumber || pg?.ownerWhatsapp || pg?.owner?.whatsapp || targetPhoneCall;
  
  const targetEmailAddress = pg?.owner?.email || pg?.ownerEmail || pg?.email || pg?.owner?.ownerEmail || "care@studentpg.com";

  const whatsappTemplateMsg = encodeURIComponent(`Hello, I am interested in booking a slot at your property "${pg.pgName || pg.title || 'Premium Co-living Space'}" listed on StudentPG.`);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex-grow">
      <article className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: SPECS */}
        <div className="md:col-span-2 space-y-6">
          
          {/* MULTI-IMAGE CAROUSEL DISPLAY */}
          <div className="space-y-3">
            <div className="bg-slate-100 rounded-xl overflow-hidden h-72 sm:h-96 border border-slate-200 shadow-xs">
              <img 
                src={getOptimizedUrl(heroDisplayImage, 1000, 600)} 
                alt={pg.pgName || pg.title || "Premium Student PG"}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            
            {pgImagesList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {pgImagesList.map((imgUrl, index) => (
                  <button 
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === imgUrl ? "border-emerald-500 scale-95 shadow-xs" : "border-slate-200 opacity-70 hover:opacity-100"}`}
                  >
                    <img src={getOptimizedUrl(imgUrl, 150, 120)} alt="Preview asset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BASIC METRICS BLOCK */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <MdVerified className="text-sm" /> Verified Listing
              </span>
              <span className="bg-slate-900 text-white text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full">
                {pg.gender || "Unisex"} Only
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">{pg.pgName || pg.title || "Premium Co-living Space"}</h1>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <MdLocationOn className="text-base flex-shrink-0" />
              <span>{pg.address || pg.area || "Local Hub"}, {pg.city || "Bhopal"} {pg.pincode ? `(${pg.pincode})` : ""}</span>
            </p>
            
            <hr className="border-slate-200 my-5" />
            
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 mb-2">About the Property</h2>
            <p className="text-slate-600 text-xs leading-relaxed font-medium bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {pg.description || "Premium accommodation options tailored for student needs."}
            </p>
          </div>

          {/* UTILITIES PERKS */}
          <div>
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 mb-3">Included Utilities & Perks</h2>
            <div className="flex flex-wrap gap-1.5">
              {pg.wifiAvailable && <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-md border border-slate-100">🌐 Free High-Speed Wifi</span>}
              {pg.foodAvailable && <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-md border border-slate-100">🍱 Quality Food Included</span>}
              {pg.parkingAvailable && <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-md border border-slate-100">🚗 Secured Parking</span>}
              {pg.laundryAvailable && <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-md border border-slate-100">🧺 Laundry Access</span>}
              {!pg.wifiAvailable && !pg.foodAvailable && !pg.parkingAvailable && !pg.laundryAvailable && (
                <span className="text-xs font-semibold text-slate-400">Standard essential baseline utilities.</span>
              )}
            </div>
          </div>

          {/* HOST DATA SECTION */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs uppercase font-black tracking-wider text-slate-400">Host Details</h3>
            <div className="text-xs font-bold text-slate-800 space-y-1">
              <p className="flex items-center gap-1.5"><MdInfo className="text-emerald-500 text-sm" /> Host Profile: <span className="font-semibold text-slate-600">{targetOwnerName}</span></p>
              <p className="flex items-center gap-1.5"><MdMail className="text-emerald-500 text-sm" /> Business Email: <span className="font-mono font-medium text-slate-500">{targetEmailAddress}</span></p>
              <p className="flex items-center gap-1.5"><MdPhone className="text-emerald-500 text-sm" /> Direct Phone Line: <span className="font-semibold text-slate-600">{targetPhoneCall}</span></p>
              <p className="flex items-center gap-1.5"><MdChat className="text-emerald-500 text-sm" /> WhatsApp: <span className="font-semibold text-slate-600">{targetWhatsappNumber}</span></p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION PANEL */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Monthly Rent</p>
              <p className="text-3xl font-black text-slate-900">{formatINR(pg.rent || pg.price || 0)}<span className="text-xs font-bold text-slate-400 tracking-normal"> / month</span></p>
            </div>
            
            <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-lg flex justify-between text-xs font-bold text-slate-600">
              <span>Security Deposit Amount:</span>
              <span className="text-slate-950 font-black">{formatINR(pg.deposit || 0)}</span>
            </div>

            <hr className="border-slate-100" />

            {/* DIRECT CONTACT OPTIONS */}
            <div className="space-y-1.5">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider text-slate-400">Connect with the Owner</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                No middleman required. Click below to reach out to the property owner directly:
              </p>
            </div>

            {/* CONTACT BUTTONS */}
            <div className="flex flex-col gap-2.5 pt-1">
              
              {/* WHATSAPP */}
              <a 
                href={`https://wa.me/91${targetWhatsappNumber.replace(/[^0-9]/g, "")}?text=${whatsappTemplateMsg}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-lg text-xs tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-sm h-11"
              >
                <FaWhatsapp className="text-base" />
                <span>Chat On WhatsApp</span>
              </a>

              {/* DIRECT CALL */}
              <a 
                href={`tel:${targetPhoneCall}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-lg text-xs tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-sm h-11"
              >
                <FaPhoneAlt className="text-xs" />
                <span>Call Owner Directly</span>
              </a>

              {/* EMAIL */}
              <a 
                href={`mailto:${targetEmailAddress}?subject=Inquiry%20Regarding%20${encodeURIComponent(pg.pgName || pg.title || 'PG Space')}`}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-black py-2.5 rounded-lg text-xs tracking-wide uppercase flex items-center justify-center gap-2 border border-slate-200 transition-all shadow-xs h-11"
              >
                <FaEnvelope className="text-sm text-slate-500" />
                <span>Send Email Inquiry</span>
              </a>

            </div>

            {/* QUICK CONTACT HIGHLIGHT LIST */}
            <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 p-3 rounded-lg text-[11px] font-semibold text-slate-700 space-y-1.5">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Owner Contact Details</p>
              <div className="flex justify-between items-center">
                <span>Phone Number:</span>
                <span className="font-mono text-slate-900 font-bold select-all">{targetPhoneCall}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>WhatsApp Number:</span>
                <span className="font-mono text-slate-900 font-bold select-all">{targetWhatsappNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Email Address:</span>
                <span className="font-mono text-slate-600 select-all truncate max-w-[140px] text-right">{targetEmailAddress}</span>
              </div>
            </div>

          </div>
        </aside>

      </article>
    </main>
  );
}