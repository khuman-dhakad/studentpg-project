import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api, { ENDPOINTS } from "../services/api/axios";// Centralized custom axios layer and endpoint constants matrix
import AmenityBadge from '../components/AmenityBadge';
import { formatINR } from "../utils/helpers";
import { getOptimizedUrl } from "../utils/cloudinaryUpload"; // Image optimization node
import { MdVerified, MdInfo, MdPhone, MdMail, MdLocationOn } from 'react-icons/md';

export default function PGDetails() {
  const { id } = useParams();
  
  // 1. Core Server States
  const [pg, setPg] = useState(null);
  const [activeImage, setActiveImage] = useState(""); // Image Gallery Focus Node
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Lead Form States
  const [inquiryData, setInquiryData] = useState({ studentName: "", studentPhone: "" });
  const [inquirySent, setInquirySent] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  /**
   * FETCH REAL PG FROM SPRING BOOT BACKEND VIA CENTRALIZED .ENV
   */
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    // 🔥 DYNAMIC URL MAPPER: Synchronized with .env through centralized configuration map
    api.get(`${ENDPOINTS.pgs.base}/${id}`)
      .then((res) => {
        if (isMounted && res.data) {
          setPg(res.data);
          // Set dynamic image collection focus node fallback
          if (res.data.propertyImages && res.data.propertyImages.length > 0) {
            setActiveImage(res.data.propertyImages[0]);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Listing data could not be indexed from production database.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  /**
   * SUBMIT DYNAMIC LEAD CAPTURE TO DATABASE VIA CENTRALIZED .ENV
   */
  const handleInquiry = async (e) => {
    e.preventDefault();
    if (honeypot) return; // Anti-bot mitigation protection trigger

    setSubmittingInquiry(true);
    try {
      // 🔥 DYNAMIC URL MAPPER: Maps dynamically to your actual .env target configuration
      await api.post(ENDPOINTS.inquiries.base, {
        pgId: id,
        ownerEmail: pg?.ownerEmail,
        ...inquiryData
      });

      setInquirySent(true);
    } catch (err) {
      alert(err?.message || "Failed to process security lead handshake.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // --- STATE BOUNDARY VISUAL RENDERS ---
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-32 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-xs font-semibold text-slate-400 tracking-wide">Syncing real-time property cluster registries...</p>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <MdInfo className="text-red-500 text-3xl mx-auto mb-2" />
        <h3 className="text-sm font-bold text-red-900">Database Search Rejected</h3>
        <p className="text-xs text-red-700 mt-1">{error || "The requested listing asset ID does not exist."}</p>
      </div>
    );
  }

  // Gallery main view rendering fallback calculation process node
  const heroDisplayImage = activeImage || pg?.propertyImages?.[0] || pg?.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000";

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex-grow">
      <article className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: MULTI-MEDIA GALLERY & SPECS */}
        <div className="md:col-span-2 space-y-6">
          
          {/* IMAGE PORTFOLIO CAROUSEL COMPONENT */}
          <div className="space-y-3">
            <div className="bg-slate-100 rounded-xl overflow-hidden h-72 sm:h-96 border border-slate-200 shadow-xs">
              <img 
                src={getOptimizedUrl(heroDisplayImage, 1000, 600)} 
                alt={pg.title || "Premium Student PG"}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            
            {/* Multi Images Array Handler (MongoDB List Streamer) */}
            {pg.propertyImages && pg.propertyImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {pg.propertyImages.map((imgUrl, index) => (
                  <button 
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === imgUrl ? "border-emerald-500 scale-95 shadow-xs" : "border-slate-200 opacity-70 hover:opacity-100"}`}
                  >
                    <img src={getOptimizedUrl(imgUrl, 150, 120)} alt="Preview asset node" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BASIC METRICS HEADER CARD */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <MdVerified className="text-sm" /> Verified Listing
              </span>
              <span className="bg-slate-900 text-white text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full">
                {pg.gender || "Unisex"} Only
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">{pg.title}</h1>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <MdLocationOn className="text-base flex-shrink-0" />
              <span>{pg.area || "Bhopal Hub"}, Bhopal {pg.distance && `(${pg.distance})`}</span>
            </p>
            
            <hr className="border-slate-200 my-5" />
            
            {/* CONTENT DESCRIPTION BLOCK */}
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 mb-2">About Property Specs</h2>
            <p className="text-slate-600 text-xs leading-relaxed font-medium bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {pg.description || "No formal parameters documented by the certified listing host node."}
            </p>
          </div>

          {/* SYSTEM AMENITIES STACK GENERATOR */}
          <div>
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 mb-3">Included Utilities & Perks</h2>
            <div className="flex flex-wrap gap-1.5">
              {pg.amenities && pg.amenities.length > 0 ? (
                pg.amenities.map((amt, idx) => (
                  <AmenityBadge key={idx} name={amt.name || amt} />
                ))
              ) : (
                <span className="text-xs font-semibold text-slate-400">Basic accommodation standard setup layout.</span>
              )}
            </div>
          </div>

          {/* COMPLIANCE VERIFIED HOST PROFILE DATA */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs uppercase font-black tracking-wider text-slate-400">Onboarded Host Details</h3>
            <div className="text-xs font-bold text-slate-800 space-y-1">
              <p className="flex items-center gap-1.5"><MdInfo className="text-emerald-500 text-sm" /> Host Profile: <span className="font-semibold text-slate-600">{pg.ownerName || "Authorized Verified Owner"}</span></p>
              <p className="flex items-center gap-1.5"><MdMail className="text-emerald-500 text-sm" /> Business Node: <span className="font-mono font-medium text-slate-500">{pg.ownerEmail}</span></p>
              {pg.ownerPhone && <p className="flex items-center gap-1.5"><MdPhone className="text-emerald-500 text-sm" /> Direct Line: <span className="font-semibold text-slate-600">{pg.ownerPhone}</span></p>}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION HUD PRICING MATRIX */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Operational Cost</p>
              <p className="text-3xl font-black text-slate-900">{formatPrice(pg.price || 0)}<span className="text-xs font-bold text-slate-400 tracking-normal"> / month</span></p>
            </div>
            
            <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-lg flex justify-between text-xs font-bold text-slate-600">
              <span>Security Deposit Protocol:</span>
              <span className="text-slate-950 font-black">{formatPrice(pg.deposit || 0)}</span>
            </div>

            <hr className="border-slate-100" />

            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider text-slate-400">Secure Gate Lead Request</h3>
            
            {inquirySent ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-bold leading-relaxed">
                Verification handshake complete! Access tokens and communications route enabled with the owner node.
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3">
                {/* Honeypot Security Check (Silent Interception Engine) */}
                <input 
                  type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)}
                  className="hidden" tabIndex="-1" autoComplete="off"
                />

                <div>
                  <input 
                    type="text" required placeholder="Your Legal Full Name"
                    value={inquiryData.studentName}
                    onChange={(e) => setInquiryData({ ...inquiryData, studentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
                <div>
                  <input 
                    type="text" required placeholder="Active Mobile Phone Number"
                    value={inquiryData.studentPhone}
                    onChange={(e) => setInquiryData({ ...inquiryData, studentPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submittingInquiry}
                  className="w-full bg-slate-900 text-white font-black py-2.5 rounded-lg text-xs tracking-wider uppercase hover:bg-slate-800 transition-all shadow-xs disabled:opacity-40 h-10"
                >
                  {submittingInquiry ? "Transmitting Lead Pipeline..." : "Transmit Verified Inquiry"}
                </button>
              </form>
            )}
          </div>
        </aside>

      </article>
    </main>
  );
}