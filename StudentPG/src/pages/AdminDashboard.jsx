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
  MdHourglassEmpty,
  MdTrendingUp,
  MdAttachMoney
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
      const res = await api.get(`/admin/pgs?status=${activeTab}`);
      const dataPayload = res.data || [];
      
      setMasterList(dataPayload);
      setFilteredList(dataPayload);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Could not retrieve property listings. Please try again.");
      setMasterList([]);
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPGData();
    setSearchQuery(""); 
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
   * 3. DEEP GLOBAL SEARCH FILTER
   */
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredList(masterList);
      setSuggestions([]);
      return;
    }

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
    setSuggestions(matchedResults.slice(0, 5));
  }, [searchQuery, masterList]);

  /**
   * 4. DIRECT ADMINISTRATIVE OPERATIONS
   */
  const handleStatusAction = async (pgId, actionType) => {
    if (!pgId) return;
    try {
      setActionLoading(pgId);

      if (actionType === "APPROVED") {
        await api.put(`/admin/pgs/${pgId}/approve`);
        alert("Property approved successfully! It is now visible to all students.");
      } else if (actionType === "REJECTED") {
        if (!window.confirm("Are you sure you want to reject/remove this PG listing?")) return;
        await api.delete(`/admin/pgs/${pgId}`);
        alert("The property listing has been permanently removed.");
      }

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
    <main className="min-h-screen bg-[#f8fafc] px-6 py-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER PANEL */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200">
                <MdSecurity className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, Admin!</h1>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  Here's what's happening on your platform today.
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVE COUNTER STATUS CHIP */}
          <div className="self-start md:self-auto bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">
              Active Context: <span className="text-slate-900 font-bold">{activeTab} View</span>
            </span>
          </div>
        </div>

        {/* METRICS & METERS HUB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TOTAL CARD */}
          <div 
            onClick={() => setActiveTab("ALL")}
            className={`group relative p-6 rounded-2xl bg-white border transition-all duration-300 cursor-pointer ${
              activeTab === "ALL" 
                ? "border-indigo-600 ring-2 ring-indigo-600/10 shadow-lg shadow-indigo-100" 
                : "border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Properties</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 tracking-tight">{stats.total}</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <MdTrendingUp /> Syncing
                  </span>
                </div>
              </div>
              <div className={`p-3.5 rounded-xl transition-all ${
                activeTab === "ALL" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
              }`}>
                <MdHome className="text-2xl" />
              </div>
            </div>
          </div>

          {/* APPROVED CARD */}
          <div 
            onClick={() => setActiveTab("APPROVED")}
            className={`group relative p-6 rounded-2xl bg-white border transition-all duration-300 cursor-pointer ${
              activeTab === "APPROVED" 
                ? "border-emerald-600 ring-2 ring-emerald-600/10 shadow-lg shadow-emerald-100" 
                : "border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Approved</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 tracking-tight">{stats.approved}</span>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Verified</span>
                </div>
              </div>
              <div className={`p-3.5 rounded-xl transition-all ${
                activeTab === "APPROVED" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
              }`}>
                <MdVerifiedUser className="text-2xl" />
              </div>
            </div>
          </div>

          {/* PENDING CARD */}
          <div 
            onClick={() => setActiveTab("PENDING")}
            className={`group relative p-6 rounded-2xl bg-white border transition-all duration-300 cursor-pointer ${
              activeTab === "PENDING" 
                ? "border-amber-500 ring-2 ring-amber-500/10 shadow-lg shadow-amber-100" 
                : "border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Awaiting Audit</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 tracking-tight">{stats.pending}</span>
                  {stats.pending > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block self-center ml-1" />
                  )}
                </div>
              </div>
              <div className={`p-3.5 rounded-xl transition-all ${
                activeTab === "PENDING" ? "bg-amber-500 text-slate-950" : "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
              }`}>
                <MdHourglassEmpty className="text-2xl" />
              </div>
            </div>
          </div>

        </div>

        {/* SEARCH AND CONTROLS LAYOUT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs" ref={suggestionRef}>
          <div className="relative w-full max-w-lg">
            <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white rounded-xl transition-all px-3.5 py-2">
              <MdSearch className="text-slate-400 text-xl flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by PG name, location, nearby area..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-2.5 bg-transparent outline-none text-slate-800 text-sm font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(""); setSuggestions([]); }} 
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* SUGGESTIONS OVERLAY */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-2 overflow-hidden shadow-xl z-50 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {suggestions.map((item) => {
                  const currentId = item._id || item.id;
                  return (
                    <li
                      key={currentId}
                      onClick={() => {
                        setSearchQuery(item.pgName || "");
                        setShowSuggestions(false);
                        setFilteredList([item]);
                      }}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.pgName || "Untitled PG"}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
                          <MdLocationOn className="text-slate-400" /> {item.address || "Local Address"}, {item.city || "Bhopal"}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        ₹{item.rent}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          
          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredList.length}</span> individual results
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* FEED LAYOUT / LISTINGS MAP GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-400">Fetching live updates from server...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 space-y-2">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-full text-xl"><MdHome /></div>
            <p className="text-sm font-bold text-slate-700">No properties align with filters</p>
            <p className="text-xs text-slate-400 max-w-xs">There are no records in database mapped under {activeTab} profile.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => {
              const resolvedId = item._id || item.id;
              const isProcessing = actionLoading === resolvedId;

              let computedImageUrl = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500";
              if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                computedImageUrl = item.images[0].url || item.images[0];
              }

              return (
                <div key={resolvedId} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group/card">
                  
                  {/* CARD COVER IMAGE */}
                  <div 
                    onClick={() => setActiveLightboxImage(computedImageUrl)}
                    className="relative h-48 bg-slate-100 overflow-hidden cursor-zoom-in"
                  >
                    <img 
                      src={getOptimizedUrl ? getOptimizedUrl(computedImageUrl, 500, 350) : computedImageUrl} 
                      alt={item.pgName || "PG Space"} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <MdZoomIn className="text-base" /> Inspect Asset
                      </span>
                    </div>

                    {/* DYNAMIC GENDER BADGES */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-lg text-white shadow-xs backdrop-blur-xs ${
                        String(item.gender).toLowerCase().includes("girl") ? "bg-pink-600/90" : "bg-blue-600/90"
                      }`}>
                        {item.gender || "Boys"}
                      </span>
                    </div>
                  </div>

                  {/* DATA METADATA MATRIX */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                        <MdLocationOn className="text-slate-400 text-sm flex-shrink-0" />
                        <span className="truncate">{item.address || "Kolar Road"}, {item.city || "Bhopal"}</span>
                      </div>

                      <h3 className="text-slate-900 font-bold text-base tracking-tight truncate">
                        {item.pgName || "Real-time Property Unit"}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {item.description || "No customized descriptor provided."}
                      </p>

                      {/* UTILITY CHIPS */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {item.roomType || "Single Sharing"}
                        </span>
                        {item.wifiAvailable && <span className="text-xs bg-slate-50 p-1 rounded-md border border-slate-100" title="Free High Speed Wifi">🌐 Wi-Fi</span>}
                        {item.foodAvailable && <span className="text-xs bg-slate-50 p-1 rounded-md border border-slate-100" title="Food Included">🍱 Mess</span>}
                        {item.parkingAvailable && <span className="text-xs bg-slate-50 p-1 rounded-md border border-slate-100" title="Secured Parking">🚗 Parking</span>}
                      </div>
                    </div>

                    {/* PRICING FOOTER */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">Monthly Rent</span>
                      <span className="text-slate-900 font-bold text-base">
                        {formatINR ? formatINR(item.rent || 0) : `₹${item.rent || 0}`}
                        <span className="text-slate-400 font-medium text-xs">/mo</span>
                      </span>
                    </div>
                  </div>

                  {/* MODERATION HUD ACTION GROUP */}
                  <div className="px-5 pb-5 bg-white grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      disabled={actionLoading !== null}
                      onClick={() => handleStatusAction(resolvedId, "APPROVED")}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-xs disabled:opacity-40"
                    >
                      <MdCheck className="text-base" />
                      <span>{isProcessing ? "Wait..." : "Approve"}</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading !== null}
                      onClick={() => handleStatusAction(resolvedId, "REJECTED")}
                      className="w-full bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-600 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-40"
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300"
            onClick={() => setActiveLightboxImage(null)}
          >
            <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden p-1.5 shadow-2xl">
              <button 
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 bg-slate-950/80 text-white w-8 h-8 rounded-full font-bold text-sm hover:bg-slate-950 flex items-center justify-center transition-colors z-10"
              >
                ✕
              </button>
              <img src={activeLightboxImage} alt="Preview Display" className="w-full h-auto max-h-[80vh] object-contain rounded-xl mx-auto" />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}