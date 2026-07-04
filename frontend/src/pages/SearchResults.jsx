import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPGs } from "../services/api/pg.api";
import PGCard from "../components/PGCard";
import { MdFilterList, MdRefresh, MdSearchOff, MdSearch, MdLocationOn } from "react-icons/md";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  // === Core States ===
  const [masterPgList, setMasterPgList] = useState([]); // Original raw data from the backend
  const [pgList, setPgList] = useState([]); // Filtered data currently displayed on screen
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // === Search Bar & Dropdown Auto-Complete States ===
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Stores the local values selected inside the filter fields
  const [filters, setFilters] = useState({
    area: searchParams.get("area") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    gender: searchParams.get("gender") || "",
  });

  // Keep filters updated if url params change directly (e.g., via top navigation bar)
  useEffect(() => {
    setFilters({
      area: searchParams.get("area") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      gender: searchParams.get("gender") || "",
    });
    loadPGs();
  }, [searchParams]);

  /**
   * FETCH APPROVED PG LISTINGS FROM THE SERVER
   */
  const loadPGs = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      
      if (searchParams.get("area")) {
        params.city = searchParams.get("area");
      }
      
      if (searchParams.get("maxPrice")) {
        params.maxRent = parseFloat(searchParams.get("maxPrice"));
      }
      
      if (searchParams.get("gender")) {
        params.category = searchParams.get("gender");
      }

      const data = await searchPGs(params);
      const approved = (data || []).filter((pg) => pg.approvalStatus === "APPROVED");
      
      setMasterPgList(approved);
      setPgList(approved); // Show all approved PGs by default
      setGlobalSearchQuery(""); // Clear text search whenever filters change
    } catch (err) {
      setError(err?.message || "Unable to load active PG listings from the database.");
      setMasterPgList([]);
      setPgList([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * LIVE TEXT SEARCH BAR (Searches through names, descriptions, or addresses instantly)
   */
  useEffect(() => {
    const query = globalSearchQuery.trim().toLowerCase();

    if (!query) {
      setPgList(masterPgList);
      setSuggestions([]);
      return;
    }

    // Match query text against property names and address details
    const filtered = masterPgList.filter((pg) => {
      const name = (pg.pgName || "").toLowerCase();
      const desc = (pg.description || "").toLowerCase();
      const addr = (pg.address || "").toLowerCase();
      const city = (pg.city || "").toLowerCase();

      return (
        name.includes(query) ||
        desc.includes(query) ||
        addr.includes(query) ||
        city.includes(query)
      );
    });

    setPgList(filtered);
    setSuggestions(filtered.slice(0, 5)); // Show top 5 items in the helper dropdown
  }, [globalSearchQuery, masterPgList]);

  // Hide dropdown recommendations if user clicks outside the search box
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
   * SAVE SELECTED FILTERS INTO THE URL
   */
  const applyFilters = (e) => {
    e.preventDefault();
    const params = {};

    if (filters.area) params.area = filters.area;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.gender) params.gender = filters.gender;

    setSearchParams(params);
  };

  /**
   * RESET ALL FILTER SELECTIONS
   */
  const handleClearFilters = () => {
    setFilters({ area: "", maxPrice: "", gender: "" });
    setGlobalSearchQuery("");
    setSearchParams({});
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-xl font-black flex items-center gap-2 text-slate-900 tracking-tight">
          <MdFilterList className="text-emerald-500 text-2xl" />
          <span>Explore Available PGs</span>
        </h1>

        {/* INSTANT TEXT SEARCH BAR */}
        <div className="relative w-full max-w-md" ref={suggestionRef}>
          <div className="flex items-center bg-white border-2 border-slate-200 focus-within:border-emerald-500 rounded-xl shadow-xs overflow-hidden transition-all px-3 py-1.5">
            <MdSearch className="text-slate-400 text-xl flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, college or street (e.g. LNCT, Kolar)..."
              value={globalSearchQuery}
              onChange={(e) => {
                setGlobalSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-2 py-1 bg-transparent outline-none text-slate-800 text-xs font-semibold"
            />
            {globalSearchQuery && (
              <button 
                onClick={() => { setGlobalSearchQuery(""); setSuggestions([]); }}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Panel */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-slate-200 rounded-xl mt-2 overflow-hidden shadow-lg z-50 divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {suggestions.map((pg) => {
                const pgId = pg.id || pg._id;
                return (
                  <li
                    key={pgId}
                    onClick={() => {
                      setGlobalSearchQuery(pg.pgName || "");
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{pg.pgName || "Premium PG"}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                        <MdLocationOn className="text-emerald-500" /> {pg.address || "Bhopal"}
                      </p>
                    </div>
                    <span className="text-[11px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">
                      ₹{pg.rent}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">

        {/* SIDEBAR FILTER INPUT CONTROLS */}
        <aside className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Search Filters</h2>
            {(filters.area || filters.maxPrice || filters.gender || globalSearchQuery) && (
              <button 
                type="button" 
                onClick={handleClearFilters}
                className="text-[11px] font-bold text-red-500 flex items-center gap-0.5 hover:underline"
              >
                <MdRefresh /> Clear All
              </button>
            )}
          </div>

          <form onSubmit={applyFilters} className="space-y-4">
            {/* AREA SELECTION */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700">Location Area</label>
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

            {/* MAX BUDGET */}
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

            {/* GENDER REQS */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700">Who is it for</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 text-slate-900 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
              >
                <option value="">All Types</option>
                <option value="Boys">Boys Only</option>
                <option value="Girls">Girls Only</option>
                <option value="Unisex">Co-living (Unisex)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs tracking-wide shadow-xs transition-colors pt-3"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* RESULTS CARDS GRID */}
        <section className="lg:col-span-3">

          {/* DYNAMIC SCREEN MESSAGES */}
          {loading && (
            <div className="text-center py-24 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-3"></div>
              <p className="text-xs font-semibold text-slate-400">Searching properties...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold">
              ⚠️ Connection Error: {error}
            </div>
          )}

          {!loading && !error && pgList.length === 0 && (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-white space-y-2">
              <MdSearchOff className="text-slate-300 text-4xl mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Properties Found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">No properties matched your filters. Try clearing your choices to see all options.</p>
            </div>
          )}

          {!loading && !error && pgList.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
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