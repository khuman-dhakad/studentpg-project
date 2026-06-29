import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPGs } from "../services/api/pg.api";
import PGCard from "../components/PGCard";
import { MdFilterList, MdRefresh, MdSearchOff } from "react-icons/md";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pgList, setPgList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Controlled UI Form local filter state storage map
  const [filters, setFilters] = useState({
    area: searchParams.get("area") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    gender: searchParams.get("gender") || "",
  });

  // Keep the localized input state synchronized if search query changes via navbar routing
  useEffect(() => {
    setFilters({
      area: searchParams.get("area") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      gender: searchParams.get("gender") || "",
    });
    loadPGs();
  }, [searchParams]);

  /**
   * PULL APPROVED DYNAMIC DATA STREAM FROM SERVER
   */
  const loadPGs = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (searchParams.get("area")) params.area = searchParams.get("area");
      if (searchParams.get("maxPrice")) params.maxPrice = searchParams.get("maxPrice");
      if (searchParams.get("gender")) params.gender = searchParams.get("gender");

      // Hits your Spring Boot routing endpoint layer implicitly
      const data = await searchPGs(params);

      // Filtering client layer node arrays safely for secure items
      const approved = (data || []).filter((pg) => pg.status === "APPROVED");
      setPgList(approved);
    } catch (err) {
      setError(err?.message || "Unable to index active system PG database listings.");
      setPgList([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * DISPATCH CURRENT LOCAL CONFIGURATION INTO URL STRINGS
   */
  const applyFilters = (e) => {
    e.preventDefault();
    const params = {};

    if (filters.area) params.area = filters.area;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.gender) params.gender = filters.gender;

    setSearchParams(params); // Pushes parameters to URL bar triggers re-fetch hook
  };

  /**
   * FLUSH ACTIVE QUERY CHAIN STORAGE MATRIX
   */
  const handleClearFilters = () => {
    setFilters({ area: "", maxPrice: "", gender: "" });
    setSearchParams({}); // Wipes query chain parameters completely clean
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
      
      <h1 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-900">
        <MdFilterList className="text-emerald-500 text-2xl" />
        <span>Explore Available PGs</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">

        {/* CONTROLS ASIDE CONFIGURATION INTERACTIVE SIDEBAR */}
        <aside className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Search Filters</h2>
            {(filters.area || filters.maxPrice || filters.gender) && (
              <button 
                type="button" 
                onClick={handleClearFilters}
                className="text-[11px] font-bold text-red-500 flex items-center gap-0.5 hover:underline"
              >
                <MdRefresh /> Clear
              </button>
            )}
          </div>

          <form onSubmit={applyFilters} className="space-y-4">
            {/* AREA FILTERS SELECT NODE */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700">Territory Area</label>
              <select
                value={filters.area}
                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 text-slate-900 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
              >
                <option value="">All Bhopal Locations</option>
                <option value="MP Nagar">MP Nagar</option>
                <option value="Indrapuri">Indrapuri</option>
                <option value="Ayodhya Bypass">Ayodhya Bypass</option>
              </select>
            </div>

            {/* BUDGET SYSTEM INTERACTIVE INPUT BOX */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700">Maximum Budget (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 8000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 text-slate-900 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* DEMOGRAPHIC SELECTION BAR */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700">Target Demographic</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 text-slate-900 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
              >
                <option value="">All Cohorts (Mixed)</option>
                <option value="Boys">Boys Only</option>
                <option value="Girls">Girls Only</option>
                <option value="Unisex">Co-living (Unisex)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs tracking-wide shadow-xs transition-colors pt-3"
            >
              Apply Filter Constraints
            </button>
          </form>
        </aside>

        {/* RESULTS GRID VIEWER STREAM */}
        <section className="lg:col-span-3">

          {/* DYNAMIC LIFECYCLE CONDITIONAL STATUS BLOCKS */}
          {loading && (
            <div className="text-center py-24 border border-dashed rounded-xl bg-slate-50/50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-3"></div>
              <p className="text-xs font-semibold text-slate-400">Filtering database architecture logs...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold">
              ⚠️ Database Interface Rejection: {error}
            </div>
          )}

          {!loading && !error && pgList.length === 0 && (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-white space-y-2">
              <MdSearchOff className="text-slate-300 text-4xl mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Target Found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">No matching verified property lists matched these filter boundaries. Clear metrics to cycle grid view state.</p>
            </div>
          )}

          {!loading && !error && pgList.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
              {pgList.map((pg) => (
                <PGCard
                  key={pg.id || pg._id}
                  pg={pg}
                />
              ))}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}