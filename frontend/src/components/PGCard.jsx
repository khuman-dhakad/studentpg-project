import React from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from "../utils/helpers";
import AmenityBadge from './AmenityBadge';
import { getOptimizedUrl } from "../utils/cloudinaryUpload"; // Cloudinary optimization import
import { MdLocationOn } from 'react-icons/md';

export default function PGCard({ pg }) {
  // MongoDB _id or standard relational server ID resolver abstraction
  const pgId = pg?.id || pg?._id;
  
  // Real database dynamic image array pull or property image fallback engine
  const cardImage = pg?.propertyImages?.[0] || pg?.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500";

  return (
    <article className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full w-full">
      
      {/* IMAGE CONTAINER LAYER */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img 
          src={getOptimizedUrl(cardImage, 500, 350)} // Micro optimized thumbnail pipeline
          alt={pg.title || "Student Accommodation"}
          width="500"
          height="350"
          loading="lazy"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" // FIX: height-full to h-full
        />
        
        {/* DEMOGRAPHIC GENDER COMPONENT BADGE */}
        <span className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-sm ${
          pg.gender === 'Girls' ? 'bg-pink-600' : pg.gender === 'Boys' ? 'bg-blue-600' : 'bg-slate-900'
        }`}>
          {pg.gender || "Unisex"} Only
        </span>
      </div>

      {/* INFORMATION NODE WRAPPER */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
        <div>
          {/* LOCATION SUB-TERRITORY STRING */}
          <div className="flex items-center gap-0.5 text-slate-500 text-xs mb-1 font-semibold">
            <MdLocationOn className="text-emerald-500 text-sm flex-shrink-0" />
            <span className="truncate">{pg.area || "Bhopal Area"}, Bhopal</span>
          </div>
          
          {/* CARD PROPERTY TITLE */}
          <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-1 tracking-tight hover:text-emerald-600 transition-colors">
            {pg.title || "Premium Co-living Space"}
          </h3>
          
          {/* DYNAMIC AMENITIES GRID MATRIX SLICE LIMIT TO 3 ITEMS */}
          <div className="flex flex-wrap gap-1">
            {pg.amenities && pg.amenities.length > 0 ? (
              pg.amenities.slice(0, 3).map((amt, idx) => (
                <AmenityBadge key={idx} name={amt.name || amt} />
              ))
            ) : (
              <span className="text-[10px] font-medium text-slate-400">Essential standard load amenities included</span>
            )}
          </div>
        </div>

        {/* PRICING AND NAVIGATION TRIGGER PANEL */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starts from</p>
            <p className="text-base font-black text-slate-900">
              {formatPrice(pg.price || 0)}
              <span className="text-xs font-medium text-slate-400 tracking-normal">/mo</span>
            </p>
          </div>
          
          <Link 
            to={`/pg/${pgId}`} 
            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-black tracking-wide uppercase transition-all shadow-xs"
          >
            Details
          </Link>
        </div>
      </div>

    </article>
  );
}