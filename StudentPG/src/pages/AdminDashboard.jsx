import React, { useState, useEffect, useRef } from "react";
import api from "../services/api/axios"; // Centralized custom axios layer
import { formatINR } from "../utils/helpers";
import { getOptimizedUrl } from "../utils/cloudinaryUpload"; // Cloudinary optimization wrapper
import { 
  MdCheck, 
  MdClose, 
  MdSecurity, 
  MdLocationOn, 
  MdHome, 
  MdZoomIn, 
  MdSearch, 
  MdVerifiedUser, 
  MdHourglassEmpty 
} from "react-icons/md";

export default function AdminDashboard() {
  // === Core States ===
  const [masterList, setMasterList] = useState([]); // Database se aane wala real unmodified data
  const [filteredList, setFilteredList] = useState([]); // Filtered array jo screen par dikhega
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  const [error, setError] = useState("");
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  // === UI & Tab Status ===
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [activeTab, setActiveTab] = useState("PENDING"); // ALL, APPROVED, PENDING
  
  // === Advanced Search States ===
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  /**
   * 1. FETCH TOTAL STATS
   */
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/pgs/stats");
      if (res.data) {
        setStats({
          total: res.data.total || 0,
          approved: res.data.approved || 0,
          pending: res.data.pending || 0
        });
      }
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  };

  /**
   * 2. FETCH REAL DATA LISTINGS FROM DATABASE
   */
  const fetchPGData = async () => {
    setLoading(true);
    setError("");
    try {
      // Backend status query pipeline
      const res = await api.get(`/admin/pgs?status=${activeTab}`);
      const dataPayload = res.data || [];
      
      setMasterList(dataPayload);
      setFilteredList(dataPayload);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load database nodes.");
      setMasterList([]);
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPGData();
    setSearchQuery(""); // Tab change hote hi search aur suggestions reset karo
    setSuggestions([]);
  }, [activeTab]);

  // Click outside listener for suggestions menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * 3. DEEP GLOBAL SEARCH FILTER (Handles 'Kolar', 'LNCT', 'Sunrise' inputs instantly)
   */
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredList(masterList);
      setSuggestions([]);
      return;
    }

    // Pure parameters mapping directly over your schema keys
    const matchedResults = masterList.filter((item) => {
      const name = (item.pgName || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const addr = (item.address || "").toLowerCase();
      const city = (item.city || "").toLowerCase();
      const locPincode = (item.pincode || "").toLowerCase();

      return (
        name.includes(query) || 
        desc.includes(query) || 
        addr.includes(query) || 
        city.includes(query) ||
        locPincode.includes(query)
      );
    });

    setFilteredList(matchedResults);
    // Dynamic top 5 suggestions matching current pool
    setSuggestions(matchedResults.slice(0, 5));
  }, [searchQuery, masterList]);

  /**
   * 4. DIRECT ADMINISTRATIVE OPERATIONS (APPROVE / REJECT OPTIONS)
   */
  const handleStatusAction = async (pgId, actionType) => {
    if (!pgId) return;
    try {
      setActionLoading(pgId);

      if (actionType === "APPROVED") {
        await api.put(`/admin/pgs/${pgId}/approve`);
        alert("Property Listing approved and set to live index successfully!");
      } else if (actionType === "REJECTED") {
        if (!window.confirm("Are you sure you want to reject/remove this PG listing?")) return;
        await api.delete(`/admin/pgs/${pgId}`);
        alert("Listing successfully deleted from database registry.");
      }

      // Live lists ko update karo bina refresh kiye
      setMasterList((prev) => prev.filter((item) => (item._id || item.id) !== pgId));
      setFilteredList((prev) => prev.filter((item) => (item._id || item.id) !== pgId));
      fetchStats();
    } catch (err) {
      alert(err?.response?.data?.message || "Action request blocked.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 bg-slate-50 min-h-screen relative font-sans">
      
      {/* PANEL CONTROL HEADER */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2 tracking-tight">
            <MdSecurity className="text-amber-500 text-2xl" />
            <span>StudentPG Admin Workspace</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit property details, analyze host credentials, and inspect Cloudinary secure images pipelines.
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-xl text-center">
          <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500">Workspace Context</p>
          <p className="text-xs font-bold text-amber-400">{activeTab} LISTINGS</p>
        </div>
      </div>

      {/* ADMIN TABS / METRICS COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div 
          onClick={() => setActiveTab("ALL")}
          className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs ${
            activeTab === "ALL" ? "bg-indigo-600 border-indigo-400 text-white scale-[1.01]" : "bg-white border-slate-200 text-slate-800 hover:border-indigo-300"
          }`}
        >
          <div>
            <p className={`text-[10px] font-black uppercase tracking-wider ${activeTab === "ALL" ? "text-indigo-200" : "text-slate-400"}`}>All Listed Units</p>
            <p className="text-2xl font-black mt-0.5">{stats.total}</p>
          </div>
          <MdHome className={`text-2xl ${activeTab === "ALL" ? "text-indigo-200" : "text-slate-300"}`} />
        </div>

        <div 
          onClick={() => setActiveTab("APPROVED")}
          className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs ${
            activeTab === "APPROVED" ? "bg-emerald-600 border-emerald-400 text-white scale-[1.01]" : "bg-white border-slate-200 text-slate-800 hover:border-emerald-300"
          }`}
        >
          <div>
            <p className={`text-[10px] font-black uppercase tracking-wider ${activeTab === "APPROVED" ? "text-emerald-100" : "text-slate-400"}`}>Live Approved</p>
            <p className="text-2xl font-black mt-0.5">{stats.approved}</p>
          </div>
          <MdVerifiedUser className={`text-2xl ${activeTab === "APPROVED" ? "text-emerald-200" : "text-slate-300"}`} />
        </div>

        <div 
          onClick={() => setActiveTab("PENDING")}
          className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs ${
            activeTab === "PENDING" ? "bg-amber-500 border-amber-400 text-slate-950 scale-[1.01]" : "bg-white border-slate-200 text-slate-800 hover:border-amber-400"
          }`}
        >
          <div>
            <p className={`text-[10px] font-black uppercase tracking-wider ${activeTab === "PENDING" ? "text-amber-950/60" : "text-slate-400"}`}>Awaiting Audit</p>
            <p className="text-2xl font-black mt-0.5">{stats.pending}</p>
          </div>
          <MdHourglassEmpty className={`text-2xl ${activeTab === "PENDING" ? "text-amber-950/70" : "text-slate-300"}`} />
        </div>
      </div>

      {/* SEARCH ENGINE BAR & DROPDOWN SUGGESTIONS CONTAINER */}
      <div className="relative w-full max-w-xl mb-8" ref={suggestionRef}>
        <div className="flex items-center bg-white border-2 border-slate-200 focus-within:border-indigo-500 rounded-xl shadow-xs overflow-hidden transition-all px-4 py-1.5">
          <MdSearch className="text-slate-400 text-xl flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by PG name, location, nearby area (e.g. 'Kolar', 'LNCT')..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-2.5 py-1.5 bg-transparent outline-none text-slate-800 text-sm font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(""); setSuggestions([]); }} 
              className="text-xs text-slate-400 hover:text-slate-600 px-1 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dynamic Suggestions Overlay matching DB object values */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-2 overflow-hidden shadow-lg z-50 divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {suggestions.map((item) => {
              const currentId = item._id || item.id;
              return (
                <li
                  key={currentId}
                  onClick={() => {
                    setSearchQuery(item.pgName || "");
                    setShowSuggestions(false);
                    setFilteredList([item]); // Lock grid down to target item click
                  }}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.pgName || "Untitled PG"}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                      <MdLocationOn className="text-emerald-500" /> {item.address || "Local Address"}, {item.city || "Bhopal"}
                    </p>
                  </div>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    ₹{item.rent}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold mb-6">{error}</div>}

      {/* CORE CARDS MANAGEMENT GRID */}
      {loading ? (
        <div className="text-center py-20 text-xs font-bold text-slate-400">Syncing active production collections...</div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-20 text-xs font-bold text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
          No real matching data entries found in database indices.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => {
            const resolvedId = item._id || item.id;
            const isProcessing = actionLoading === resolvedId;

            // 🌟 CLOUDINARY REAL ARRAY PIXELS EXTRACTION LOGIC
            let computedImageUrl = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500";
            if (item.images && Array.isArray(item.images) && item.images.length > 0) {
              computedImageUrl = item.images[0].url || item.images[0];
            }

            return (
              <div key={resolvedId} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-md">
                
                {/* PHOTO CONTAINER (Using getOptimizedUrl like PGDetails) */}
                <div 
                  onClick={() => setActiveLightboxImage(computedImageUrl)}
                  className="relative h-48 bg-slate-100 overflow-hidden cursor-zoom-in group"
                >
                  <img 
                    src={getOptimizedUrl ? getOptimizedUrl(computedImageUrl, 500, 350) : computedImageUrl} 
                    alt={item.pgName || "PG Space"} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="bg-white/90 text-slate-900 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <MdZoomIn className="text-sm" /> View Original Asset
                    </span>
                  </div>

                  {/* Gender Tags Rendering Dynamically */}
                  <div className="absolute top-3 right-3">
                    <span className={`font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-xs ${
                      String(item.gender).toLowerCase().includes("girl") ? "bg-pink-600" : "bg-blue-600"
                    }`}>
                      {item.gender || "Boys"} Only
                    </span>
                  </div>
                </div>

                {/* CONTENT AREA DETAILED DIRECTLY TO DATABASE SCHEMATICS */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-0.5 text-slate-400 text-xs font-bold">
                      <MdLocationOn className="text-emerald-500 text-sm flex-shrink-0" />
                      <span className="truncate">{item.address || "Kolar Road"}, {item.city || "Bhopal"} ({item.pincode || "462042"})</span>
                    </div>

                    <h3 className="text-slate-900 font-black text-base tracking-tight truncate">
                      {item.pgName || "Real-time Property Unit"}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      💡 Description: <span className="text-slate-600 font-semibold">{item.description || "No localized details set."}</span>
                    </p>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="bg-slate-50 border border-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                        {item.roomType || "Single Sharing"}
                      </span>
                      {item.wifiAvailable && <span className="text-xs" title="Free High Speed Wifi">🌐</span>}
                      {item.foodAvailable && <span className="text-xs" title="Food Included">🍱</span>}
                      {item.parkingAvailable && <span className="text-xs" title="Secured Parking">🚗</span>}
                    </div>
                  </div>

                  {/* COST CONTEXT MATRIX */}
                  <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Starts From</span>
                    <span className="text-slate-900 font-black text-base">
                      {formatINR ? formatINR(item.rent || 0) : `₹${item.rent || 0}`}
                      <span className="text-slate-400 font-bold text-xs tracking-normal">/mo</span>
                    </span>
                  </div>
                </div>

                {/* APPROVAL / REJECT OPTIONS BUTTONS HUB */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={actionLoading !== null}
                    onClick={() => handleStatusAction(resolvedId, "APPROVED")}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-40 shadow-xs"
                  >
                    <MdCheck className="text-base" />
                    <span>{isProcessing ? "..." : "Approve"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading !== null}
                    onClick={() => handleStatusAction(resolvedId, "REJECTED")}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-40 shadow-xs"
                  >
                    <MdClose className="text-base" />
                    <span>Reject</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* SECURE LIGHTBOX VIEW */}
      {activeLightboxImage && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2">
            <button 
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full font-black text-xs hover:bg-black/90"
            >
              ✕
            </button>
            <img src={activeLightboxImage} alt="Preview Display" className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

    </main>
  );
}