import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-slate-50 border-t border-slate-200 px-4 py-12 mt-auto w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* BRAND COLUMN */}
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-black text-slate-900 text-lg tracking-tight">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
              <rect width="32" height="32" rx="8" fill="#0f172a"/>
              <path d="M16 7L7 14V26H13V20H19V26H25V14L16 7Z" fill="#34d399"/>
            </svg>
            <span>StudentPG</span>
          </p>
          <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm">
            Bhopal's most trusted platform for students to find safe, affordable, and admin-verified PG accommodation near major coaching hubs and college campuses.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Quick Navigation</h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-600">
            <li>
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home Portal</Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-emerald-600 transition-colors">Explore All PGs</Link>
            </li>
            <li>
              <Link to="/owner/register" className="hover:text-emerald-600 transition-colors">List Your Property</Link>
            </li>
          </ul>
        </div>

        {/* POPULAR AREAS (SYNCED WITH BHOPAL SEARCH QUERY) */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Popular Localities</h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-600">
            <li>
              <Link to="/search?area=MP Nagar" className="hover:text-emerald-600 transition-colors">MP Nagar (Zone 1 & 2)</Link>
            </li>
            <li>
              <Link to="/search?area=Indrapuri" className="hover:text-emerald-600 transition-colors">Indrapuri Sectors</Link>
            </li>
            <li>
              <Link to="/search?area=Ayodhya Bypass" className="hover:text-emerald-600 transition-colors">Ayodhya Bypass Road</Link>
            </li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT STACK */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-200/60 text-center text-[11px] font-medium text-slate-400 tracking-wide">
        <p>© {new Date().getFullYear()} StudentPG Network. All rights reserved. Made with ❤️ for students in Bhopal.</p>
      </div>
    </footer>
  );
}