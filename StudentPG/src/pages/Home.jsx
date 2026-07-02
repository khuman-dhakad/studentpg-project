import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';

export default function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    area: '',
    budget: '15000', // Yeh UI state control ke liye rahega
    gender: '',
    roomType: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    
    // 🔥 FIX: Backend validation parameters mapping pipeline
    const queryParams = new URLSearchParams();
    
    if (filters.area) queryParams.append("area", filters.area);
    if (filters.budget) queryParams.append("maxPrice", filters.budget); // Budget goes as 'maxPrice'
    if (filters.gender) queryParams.append("gender", filters.gender);
    if (filters.roomType) queryParams.append("roomType", filters.roomType);

    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <main className="flex-grow">
      {/* Hero Section with Bhopal Skyline Background Concept */}
      <section className="relative bg-slate-950 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80" 
            alt="Bhopal Upper Lake Scenic Backdrop"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Find the Best Verified <span className="text-emerald-400">Student PG</span> in Bhopal
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-medium">
            Simple pricing, clean hostels, and rooms near your college. Approved by real administrators.
          </p>

          {/* Unified High-Performance Filter Hub Bar */}
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-xl text-slate-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end border border-slate-100">
            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Select Area</label>
              <select 
                value={filters.area} 
                onChange={(e) => setFilters({...filters, area: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none h-10"
              >
                <option value="">Anywhere</option>
                <option value="MP Nagar">MP Nagar</option>
                <option value="Indrapuri">Indrapuri</option>
                <option value="Ayodhya Bypass">Ayodhya Bypass</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Max Rent (₹{filters.budget})</label>
              <div className="h-10 flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 w-full">
                <input 
                  type="range" min="2000" max="20000" step="500"
                  value={filters.budget}
                  onChange={(e) => setFilters({...filters, budget: e.target.value})}
                  className="w-full accent-slate-900 h-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Gender</label>
              <select 
                value={filters.gender} 
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none h-10"
              >
                <option value="">All</option>
                <option value="Boys">Boys Only</option>
                <option value="Girls">Girls Only</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Sharing Type</label>
              <select 
                value={filters.roomType} 
                onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none h-10"
              >
                <option value="">Any Mode</option>
                <option value="Single">Single Bed</option>
                <option value="Double">2 Sharing</option>
                <option value="Triple">3 Sharing</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-black h-10 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-800 transition-all text-xs uppercase tracking-wider shadow-xs">
              <MdSearch className="text-base" /> Explore
            </button>
          </form>
        </div>
      </section>

      {/* Trust Badges Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-xl font-black text-center text-slate-900 mb-10 uppercase tracking-wider">Why Choose StudentPG Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
            <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black">01</div>
            <h3 className="font-bold text-slate-900 text-sm">Admin Verified Listings</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Every single property is cross-checked manually by our team before listing publicly.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
            <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black">02</div>
            <h3 className="font-bold text-slate-900 text-sm">No Hidden Charges</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">See exact pricing details, structural deposits, and amenities directly with zero brokers.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
            <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black">03</div>
            <h3 className="font-bold text-slate-900 text-sm">Top Locations Embedded</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Find rooms within walking distances of institutes like LNCT, SIRT, MANIT or coaching hubs.</p>
          </div>
        </div>
      </section>
    </main>
  );
}