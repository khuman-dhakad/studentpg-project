import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from "../utils/helpers";
import { getOptimizedUrl } from "../utils/cloudinaryUpload"; 
import { MdLocationOn, MdVerified, MdChevronLeft, MdChevronRight, MdClose, MdBed } from 'react-icons/md';

export default function PGCard({ pg }) {
  const pgId = pg?.id || pg?._id;
  
  // Safely extract images array
  const pgsImages = pg?.images && pg.images.length > 0 
    ? pg.images.map(img => img.url) 
    : [pg?.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500"];

  // States
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Controls the big screen popup

  // Navigation Logic for Slider
  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === pgsImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? pgsImages.length - 1 : prev - 1));
  };

  // Open Popup Handler
  const openLightbox = (e) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };

  return (
    <>
      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full w-full group">
        
        {/* IMAGE CONTAINER LAYER (Clicking this opens the big popup) */}
        <div 
          onClick={openLightbox}
          className="relative h-52 bg-slate-100 overflow-hidden cursor-zoom-in"
          title="Click to view full screen"
        >
          <img 
            src={getOptimizedUrl(pgsImages[currentImgIndex], 500, 350)} 
            alt={`${pg.pgName || "PG"} - View ${currentImgIndex + 1}`}
            width="500"
            height="350"
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* HOVER SLIDERS (For quick inline browsing) */}
          {pgsImages.length > 1 && (
            <>
              <button 
                type="button"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <MdChevronLeft className="text-lg" />
              </button>
              <button 
                type="button"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <MdChevronRight className="text-lg" />
              </button>
            </>
          )}
          
          {/* GENDER BADGE */}
          <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full text-white shadow-sm backdrop-blur-xs z-10 ${
            pg.gender === 'Girls' ? 'bg-pink-600/90' : pg.gender === 'Boys' ? 'bg-blue-600/90' : 'bg-slate-900/90'
          }`}>
            {pg.gender || "Unisex"} Only
          </span>

          {/* VERIFIED BADGE */}
          {pg.approvalStatus === "APPROVED" && (
            <span className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 z-10">
              <MdVerified className="text-sm" /> Verified
            </span>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
          <div>
            {/* SUGGESTION 1: LOCATION WITH PINCODE */}
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-1 font-semibold">
              <MdLocationOn className="text-emerald-500 text-base flex-shrink-0" />
              <span className="truncate text-slate-600">
                {pg.address || "Local Area"}, {pg.city || "Bhopal"} {pg.pincode ? `(${pg.pincode})` : ""}
              </span>
            </div>
            
            {/* CARD TITLE */}
            <h3 className="font-extrabold text-slate-900 text-base mb-1 line-clamp-1 tracking-tight group-hover:text-emerald-600 transition-colors">
              {pg.pgName || "Premium Co-living Space"}
            </h3>

            {/* SUGGESTION 2: SHORT DESCRIPTION BLURB */}
            <p className="text-xs text-slate-400 line-clamp-1 mb-3.5 italic">
              {pg.description || "Premium accommodation options available for immediate onboarding."}
            </p>

            {/* SUGGESTION 3: ROOM TYPE CHIP & AMENITIES */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {pg.roomType && (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                  <MdBed className="text-xs" /> {pg.roomType}
                </span>
              )}
              {pg.wifiAvailable && (
                <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-100">🌐 Free Wifi</span>
              )}
              {pg.foodAvailable && (
                <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-100">🍱 Food Inc.</span>
              )}
            </div>
          </div>

          {/* PRICING AND ACTION BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starts from</p>
              <p className="text-lg font-black text-slate-900">
                {formatINR(pg.rent || 0)}
                <span className="text-xs font-semibold text-slate-400 tracking-normal font-normal"> /mo</span>
              </p>
            </div>
            
            <Link 
              to={`/pg/${pgId}`} 
              className="bg-slate-900 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-300 shadow-xs hover:shadow-md"
            >
              Details
            </Link>
          </div>
        </div>
      </article>

      {/* 🔴 BIG LIGHTBOX MODAL POPUP (Renders globally when active) */}
      {isPopupOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsPopupOpen(false)} // Closes if clicked outside on backdrop
        >
          {/* Close Button */}
          <button 
            type="button"
            onClick={() => setIsPopupOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-red-500 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all text-2xl z-50"
          >
            <MdClose />
          </button>

          {/* Central Showcase Wrapper */}
          <div 
            className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Stop propagation so clicking content doesn't close it
          >
            {/* Large Image Frame */}
            <img 
              src={pgsImages[currentImgIndex]} 
              alt="Full Screen Review" 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none"
            />

            {/* Popup Left Scroller */}
            {pgsImages.length > 1 && (
              <>
                <button 
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-2 md:-left-16 bg-white/10 hover:bg-white text-white hover:text-slate-900 p-3 rounded-full transition-all border border-white/20 shadow-xl"
                >
                  <MdChevronLeft className="text-3xl" />
                </button>

                {/* Popup Right Scroller */}
                <button 
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-2 md:-right-16 bg-white/10 hover:bg-white text-white hover:text-slate-900 p-3 rounded-full transition-all border border-white/20 shadow-xl"
                >
                  <MdChevronRight className="text-3xl" />
                </button>

                {/* Index Indicator Text */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm font-semibold tracking-wider bg-black/40 px-3 py-1 rounded-full">
                  Image {currentImgIndex + 1} of {pgsImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}