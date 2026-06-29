import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdHomeWork, MdLogout, MdDashboard, MdLogin } from 'react-icons/md';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-400">
          <MdHomeWork className="text-2xl" />
          <span>Student<span className="text-white">PG</span></span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <Link to="/search" className="hover:text-emerald-400 transition-colors">Find PGs</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="flex items-center gap-1 bg-amber-600 px-3 py-1.5 rounded-md hover:bg-amber-700">
                  <MdDashboard /> Admin Panel
                </Link>
              )}
              {user.role === 'OWNER' && (
                <Link to="/add-pg" className="bg-emerald-600 px-3 py-1.5 rounded-md hover:bg-emerald-700">
                  + Add Property
                </Link>
              )}
              <span className="text-slate-400 hidden sm:inline">Hi, {user.username}</span>
              <button onClick={() => logout().then(() => navigate('/'))} className="text-red-400 hover:text-red-300 flex items-center gap-1">
                <MdLogout /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="flex items-center gap-1 border border-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-800">
                <MdLogin /> Owner Login
              </Link>
              <Link to="/register" className="bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-md font-semibold hover:bg-emerald-400">
                Join as Owner
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}