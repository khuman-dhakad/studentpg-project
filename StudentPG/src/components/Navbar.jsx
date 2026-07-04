import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MdHomeWork, MdLogout, MdDashboard, MdLogin, 
  MdAccountCircle, MdMenu, MdClose, MdAddCircle, MdOutlineReportProblem 
} from 'react-icons/md';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu Toggle State

  // Active link check karne ke liye helper function
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  // REAL AUTH VALIDATION: Checks if the user is truly authorized with a valid role
  const isSuccessfullyLoggedIn = user && (user.role === 'ADMIN' || user.role === 'OWNER' || user.role === 'STUDENT') && (user.username || user.email);

  return (
    <header className="bg-slate-900/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-slate-800 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* 🌟 LOGO */}
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-emerald-400 group">
          <MdHomeWork className="text-2xl group-hover:scale-110 transition-transform duration-200" />
          <span>Student<span className="text-white">PG</span></span>
        </Link>

        {/* 💻 DESKTOP NAVIGATION (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6 text-xs uppercase font-black tracking-wider">
          <Link 
            to="/" 
            className={`transition-colors ${isActive('/') ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'}`}
          >
            Home
          </Link>
          <Link 
            to="/search" 
            className={`transition-colors ${isActive('/search') ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'}`}
          >
            Find PGs
          </Link>
          <Link 
            to="/support" 
            className={`transition-colors ${isActive('/support') ? 'text-red-400' : 'text-red-500 hover:text-red-400 font-extrabold'}`}
          >
            Support / Complain
          </Link>
          
          {isSuccessfullyLoggedIn ? (
            <div className="flex items-center gap-4 normal-case tracking-normal text-sm font-medium">
              
              {/* ADMIN OPTION */}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="flex items-center gap-1.5 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-amber-500/30">
                  <MdDashboard className="text-sm" /> Admin Panel
                </Link>
              )}
              
              {/* OWNER OPTION */}
              {user.role === 'OWNER' && (
                <Link to="/add-pg" className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-emerald-500/30">
                  <MdAddCircle className="text-sm" /> Add Property
                </Link>
              )}
              
              {/* ROLE BASED PROFILE REDIRECTION */}
              <Link 
                to={user.role === 'ADMIN' ? "/admin/dashboard" : user.role === 'OWNER' ? "/owner/profile" : "/profile"} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-black uppercase tracking-wider text-xs bg-slate-800/40 border border-slate-700/50 ${isActive('/owner/profile') || isActive('/profile') || isActive('/admin/dashboard') ? 'text-emerald-400 border-emerald-500/30' : 'text-slate-300 hover:text-emerald-400'}`}
              >
                <MdAccountCircle className="text-lg text-emerald-400" /> 
                <span className="hidden lg:inline">
                  Hi, {user.name || user.username || (user.role === 'ADMIN' ? 'Admin' : user.role === 'OWNER' ? 'Property Owner' : 'Student')}
                </span>
              </Link>

              {/* LOGOUT BUTTON */}
              <button 
                onClick={handleLogout} 
                className="text-red-400 hover:text-white hover:bg-red-500/10 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 border border-transparent hover:border-red-500/20"
              >
                <MdLogout /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 normal-case tracking-normal">
              <Link to="/login" className="flex items-center gap-1 text-xs font-black uppercase tracking-wider border border-slate-700 hover:border-slate-500 px-3 py-2 rounded-xl hover:bg-slate-800 transition-all">
                <MdLogin /> Owner Login
              </Link>
              <Link to="/register" className="bg-emerald-500 text-slate-950 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/10">
                Join as Owner
              </Link>
            </div>
          )}
        </div>

        {/* 📱 MOBILE HAMBURGER BUTTON */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-slate-400 hover:text-white text-2xl focus:outline-none p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </nav>

      {/* 🗺️ MOBILE DRAWER OVERLAY */}
      <div className={`md:hidden fixed inset-x-0 top-16 bg-slate-950 border-b border-slate-800 transition-all duration-300 ease-in-out transform shadow-xl ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}`}>
        <div className="px-4 pt-3 pb-6 space-y-3 text-sm font-bold flex flex-col">
          
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`p-3 rounded-xl transition-colors ${isActive('/') ? 'bg-slate-900 text-emerald-400' : 'text-slate-300 hover:bg-slate-900'}`}
          >
            Home
          </Link>
          
          <Link 
            to="/search" 
            onClick={() => setIsOpen(false)}
            className={`p-3 rounded-xl transition-colors ${isActive('/search') ? 'bg-slate-900 text-emerald-400' : 'text-slate-300 hover:bg-slate-900'}`}
          >
            Find PGs
          </Link>

          <Link 
            to="/support" 
            onClick={() => setIsOpen(false)}
            className={`p-3 rounded-xl transition-colors ${isActive('/support') ? 'bg-slate-900 text-red-400' : 'text-red-400 hover:bg-slate-900'}`}
          >
            Support / Complain
          </Link>

          <hr className="border-slate-800 my-1" />

          {isSuccessfullyLoggedIn ? (
            <div className="space-y-3 pt-1">
              <div className="px-3 py-1.5 text-xs font-black text-slate-500 uppercase tracking-wider">
                Logged in as: <span className="text-slate-300 font-bold normal-case text-sm ml-1">{user.username}</span>
              </div>

              {user.role === 'ADMIN' && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 bg-amber-600/10 text-amber-400 p-3 rounded-xl border border-amber-500/20"
                >
                  <MdDashboard /> Admin Panel
                </Link>
              )}
              
              {user.role === 'OWNER' && (
                <Link 
                  to="/add-pg" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 bg-emerald-600/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20"
                >
                  <MdAddCircle /> Add Property Listing
                </Link>
              )}
              
              <Link 
                to={user.role === 'OWNER' ? "/owner/profile" : "/profile"} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 p-3 rounded-xl ${isActive('/owner/profile') || isActive('/profile') ? 'bg-slate-900 text-emerald-400' : 'text-slate-300 hover:bg-slate-900'}`}
              >
                <MdAccountCircle className="text-xl" /> View My Profile
              </Link>

              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-xl text-left border border-dashed border-red-500/20"
              >
                <MdLogout /> Secure Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 border border-slate-800 p-3 rounded-xl text-slate-300 hover:bg-slate-900 transition-all text-center"
              >
                <MdLogin /> Owner Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="bg-emerald-500 text-slate-950 p-3 rounded-xl text-center font-black uppercase tracking-wider hover:bg-emerald-400 transition-all"
              >
                Join as Owner
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}