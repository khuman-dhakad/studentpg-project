import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdLocationOn, MdVerified, MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from "../services/api/axios"; 
import { formatINR } from "../utils/helpers";
import { getOptimizedUrl } from "../utils/cloudinaryUpload";

export default function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    area: '',
    budget: '15000',
    gender: '',
    roomType: ''
  });

  const [featuredPgs, setFeaturedPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Image Lightbox/Modal Viewer with Slider
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Fetch live properties via Student Public Route
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    api.get("/student/pgs")
      .then((res) => {
        if (isMounted && res.data) {
          const items = Array.isArray(res.data) ? res.data : (res.data.pgs || res.data.data || []);
          
          const baselineItems = items.filter(pg => {
            if (!pg.approvalStatus) return true; 
            return pg.approvalStatus === "APPROVED" || pg.approvalStatus === "PENDING" || pg.approvalStatus === "";
          });
          
          setFeaturedPgs(baselineItems);
        }
      })
      .catch((err) => {
        console.error("Error loading home grid pgs from public endpoint:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
      
    return () => { isMounted = false; };
  }, []);

  // Open Image Popup Modal Logic
  const openImageModal = (e, imagesList) => {
    e.stopPropagation(); // Card click event stop karne ke liye taaki navigation trigger na ho
    if (!imagesList || imagesList.length === 0) return;
    
    setModalImages(imagesList);
    setCurrentImgIndex(0);
    setIsModalOpen(true);
  };

  // Modal Slider Navigation
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const queryParams = new URLSearchParams();
    if (filters.area) queryParams.append("area", filters.area);
    if (filters.budget) queryParams.append("maxPrice", filters.budget);
    if (filters.gender) queryParams.append("gender", filters.gender);
    if (filters.roomType) queryParams.append("roomType", filters.roomType);
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <main className="flex-grow bg-slate-50/60 selection:bg-indigo-500 selection:text-white">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-tr from-indigo-950 via-slate-900 to-violet-950 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80" 
            alt="Students Community"
            className="w-full h-full object-cover transform scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950"></div>
        
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-6">
          <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm backdrop-blur-xs">
            🎓 Premium Student Living, Simplified
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
            Find Your Perfect <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Student PG</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed opacity-90">
            Connect with curated student living spaces, verified premium PGs, and premium flatmate ecosystems tailored directly for your academic tier.
          </p>

          {/* Search Filters */}
          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl shadow-indigo-950/20 text-slate-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end border border-white/20 max-w-4xl mx-auto mt-12 transition-all duration-300 focus-within:border-indigo-500/30">
            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Location</label>
              <select 
                value={filters.area} 
                onChange={(e) => setFilters({...filters, area: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none h-11 appearance-none cursor-pointer"
              >
                <option value="">Bhopal, MP</option>
                <option value="MP Nagar">MP Nagar</option>
                <option value="Indrapuri">Indrapuri</option>
                <option value="Ayodhya Bypass">Ayodhya Bypass</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Budget (Max ₹{filters.budget})</label>
              <select 
                value={filters.budget} 
                onChange={(e) => setFilters({...filters, budget: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none h-11 appearance-none cursor-pointer"
              >
                <option value="5000">₹5,000</option>
                <option value="8500">₹8,500</option>
                <option value="12000">₹12,000</option>
                <option value="15000">₹15,000 - ₹20,000</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">College</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none h-11 appearance-none cursor-pointer"
              >
                <option value="">MANIT Bhopal</option>
                <option value="lnct">LNCT Campus</option>
                <option value="aiims">AIIMS Bhopal</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Gender Policy</label>
              <select 
                value={filters.gender} 
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none h-11 appearance-none cursor-pointer"
              >
                <option value="">Boys, Girls, Co-ed</option>
                <option value="Boys">Boys Only</option>
                <option value="Girls">Girls Only</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black h-11 rounded-xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 active:scale-98">
              <MdSearch className="text-xl" /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Dynamic Properties Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-slate-200/60 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Featured Verified Properties</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Handpicked spaces verified by our operations team manually.</p>
          </div>
          <button 
            type="button"
            onClick={() => navigate('/search')}
            className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-1 mt-4 sm:mt-0 group bg-indigo-50 px-4 py-2 rounded-xl transition-all"
          >
            Explore More <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-slate-200/60 rounded-2xl p-3 space-y-4 animate-pulse shadow-xs">
                <div className="bg-slate-200 h-48 rounded-xl w-full"></div>
                <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredPgs.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-white max-w-xl mx-auto px-4">
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="font-bold text-slate-800 text-sm">No Accommodations Active</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Currently there are no properties synced inside the database container.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPgs.slice(0, 4).map((item) => {
              const id = item._id || item.id;
              
              // Safe creation of raw image arrays for the popup handler
              const itemImagesList = item.images && item.images.length > 0 
                ? item.images.map(img => img.url || img) 
                : (item.image ? [item.image] : ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500"]);

              const displayImg = itemImagesList[0];

              return (
                <div 
                  key={id} 
                  onClick={() => navigate(`/pg/${id}`)}
                  className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-transparent transition-all duration-300 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
                >
                  {/* Image container with custom on-click handler popup trigger */}
                  <div 
                    className="relative h-48 bg-slate-100 overflow-hidden cursor-zoom-in"
                    onClick={(e) => openImageModal(e, itemImagesList)}
                  >
                    <img 
                      src={getOptimizedUrl(displayImg, 500, 400)} 
                      alt={item.pgName || item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* MODIFIED: Review Star Removed -> Verified Badge Mounted directly on image container top right */}
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md border border-emerald-400/20">
                      <MdVerified className="text-sm" /> Verified
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {item.pgName || item.title || "Premium Co-living Space"}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-bold flex items-center gap-0.5">
                        <MdLocationOn className="text-slate-400 text-xs shrink-0" /> {item.area || item.city || "Bhopal Hub"}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-3">
                        <span className="bg-slate-900 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {item.gender || "Unisex"} Only
                        </span>
                        {item.wifiAvailable && <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[9px] font-bold px-2 py-0.5 rounded-md">Wifi</span>}
                        {item.foodAvailable && <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[9px] font-bold px-2 py-0.5 rounded-md">Food</span>}
                        {item.laundryAvailable && <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[9px] font-bold px-2 py-0.5 rounded-md">Laundry</span>}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-slate-900 font-black text-base tracking-tight">
                        {formatINR(item.rent || item.price || 0)}<span className="text-[10px] text-slate-400 font-bold tracking-normal">/mo</span>
                      </p>
                      <span className="text-[10px] text-indigo-600 font-extrabold group-hover:text-indigo-800 transition-colors uppercase tracking-wider">Details &rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* LIGHTBOX CAROUSEL MODAL (Images Zoom Popup Slider Hook) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Trigger Button */}
          <button 
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-slate-300 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all text-2xl"
          >
            <MdClose />
          </button>

          {/* Conditional Left Scroll Trigger — Executes strictly if images count is more than 1 */}
          {modalImages.length > 1 && (
            <button 
              type="button"
              onClick={handlePrevImage}
              className="absolute left-4 md:left-8 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all text-3xl focus:outline-none backdrop-blur-xs select-none"
            >
              <MdChevronLeft />
            </button>
          )}

          {/* Core Image Display Viewport Frame */}
          <div 
            className="max-w-4xl max-h-[80vh] bg-transparent overflow-hidden rounded-xl shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Stop propagation inside container
          >
            <img 
              src={modalImages[currentImgIndex]} 
              alt="Expanded Preview Frame" 
              className="w-full h-full max-h-[80vh] object-contain select-none"
            />
          </div>

          {/* Conditional Right Scroll Trigger — Executes strictly if images count is more than 1 */}
          {modalImages.length > 1 && (
            <button 
              type="button"
              onClick={handleNextImage}
              className="absolute right-4 md:right-8 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all text-3xl focus:outline-none backdrop-blur-xs select-none"
            >
              <MdChevronRight />
            </button>
          )}

          {/* Image index counter indicator at bottom */}
          {modalImages.length > 1 && (
            <div className="absolute bottom-6 bg-slate-900/60 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-800">
              {currentImgIndex + 1} / {modalImages.length}
            </div>
          )}
        </div>
      )}

      {/* Value Proposition Perks */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-white border-y border-slate-200/50">
        <h2 className="text-xs uppercase font-black text-center text-slate-400 mb-12 tracking-widest">Why Choose StudentPG</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4 space-y-2.5 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-lg group-hover:scale-110 transition-transform shadow-xs">🛡️</div>
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">Verified Listings</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">Cross-checked manually by our administrative operations panel.</p>
          </div>
          <div className="p-4 space-y-2.5 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-lg group-hover:scale-110 transition-transform shadow-xs">💎</div>
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">Zero Brokerage</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">Direct connection pipeline between real owners and prospective students.</p>
          </div>
          <div className="p-4 space-y-2.5 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-lg group-hover:scale-110 transition-transform shadow-xs">🏷️</div>
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">Transparent Pricing</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">Exact descriptions of security deposits, electricity billing parameters.</p>
          </div>
          <div className="p-4 space-y-2.5 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-lg group-hover:scale-110 transition-transform shadow-xs">📞</div>
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">24/7 Support</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">Dedicated support desk ready to solve escalation tickets at any time.</p>
          </div>
        </div>
      </section>
    </main>
  );
}