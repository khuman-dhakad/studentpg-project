import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { ENDPOINTS } from '../api/axios';
import { formatPrice } from '../utils/helpers';
import { getOptimizedUrl } from '../utils/cloudinary';
import { Link } from 'react-router-dom';
import { 
  MdVerified, MdEmail, MdPhone, MdAddBusiness, MdHome, 
  MdDeleteOutline, MdSettings, MdDashboard, MdCloudUpload 
} from 'react-icons/md';

export default function OwnerDashboard() {
  const { user, login } = useAuth(); // Local runtime mutations handler layer
  
  // 1. Core State Managers
  const [activeTab, setActiveTab] = useState('dashboard'); // Tabs: 'dashboard' or 'settings'
  const [myPgs, setMyPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // 2. Profile Form State Node
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    whatsappNumber: user?.whatsappNumber || "",
    profilePic: user?.profilePic || ""
  });

  // Keep form synced if user state loads delayed
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        whatsappNumber: user.whatsappNumber || "",
        profilePic: user.profilePic || ""
      });
    }
  }, [user]);

  /**
   * LOAD OWNER PROPERTIES
   */
  useEffect(() => {
    let isMounted = true;
    if (!user) return;

    const ownerId = user.id || user._id;
    
   api.get(ENDPOINTS.pgs.owner)
  .then((res) => {
    if (isMounted && res.data) setMyPgs(res.data);
  })
      .catch((err) => console.error(err?.message))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [user]);

  /**
   * IMAGE UPLOAD PIPELINE LAYER (CLOUDINARY DIRECT)
   */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setProfileForm(prev => ({ ...prev, profilePic: data.secure_url }));
      }
    } catch (err) {
      alert("Media transmission sequence failed to upload photo.");
    }
  };

  /**
   * TRANSMIT PROFILE CORRECTIONS TO BACKEND
   */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      // Points dynamically to your user update profile endpoint wrapper
      await api.put(`/auth/update-profile`, profileForm);
      alert("Profile data cluster successfully re-indexed!");
      window.location.reload(); // Refresh to sync deep state context tree
    } catch (err) {
      alert(err?.message || "Profile data modification rejected by database.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  /**
   * DELETE EXCLUSIVE PROPERTY TRIGGER
   */
  const handleDeletePG = async (pgId) => {
    if (!window.confirm("Are you completely sure you want to permanently delete this listing node?")) return;
    try {
      await api.delete(`${ENDPOINTS.pgs.base}/${pgId}`);
      setMyPgs(myPgs.filter(item => item.id !== pgId && item._id !== pgId));
    } catch (err) {
      alert(err?.message || "Internal mutation sequence rejected.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-32 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Compiling Dashboard Metrics...</p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex-grow space-y-8">
      
      {/* MASTER HOST BRIEF PANEL */}
      <section className="bg-slate-900 rounded-2xl p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-md border border-slate-800">
        <div className="flex items-center gap-4">
          <img 
            src={getOptimizedUrl(profileForm.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", 150, 150)} 
            alt="Owner Frame" 
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 bg-slate-800 flex-shrink-0"
          />
          <div className="space-y-0.5">
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Verified Host Console</p>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5 truncate">
              {user?.name || user?.username || "Authorized Host"}
              <MdVerified className="text-emerald-400 text-lg flex-shrink-0" />
            </h1>
            <p className="text-[11px] font-medium text-slate-400">ROLE_PROPERTY_OWNER</p>
          </div>
        </div>
        
        {/* COMMUNICATION HUB */}
        <div className="text-xs space-y-1.5 border-t md:border-t-0 md:border-x border-slate-800 pt-4 md:pt-0 md:px-6">
          <div className="flex items-center gap-2 text-slate-300">
            <MdEmail className="text-emerald-400 text-sm flex-shrink-0" />
            <span className="font-mono truncate">{user?.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MdPhone className="text-emerald-400 text-sm flex-shrink-0" />
            <span>{user?.phone || profileForm.phone || "+91 Unset"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MdMessage className="text-emerald-400 text-sm flex-shrink-0" />
            <span>{user?.whatsappNumber || profileForm.whatsappNumber || "+91 Unset"}</span>
          </div>
        </div>

        {/* CLUSTER STATS METRICS */}
        <div className="flex justify-around bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-center">
          <div>
            <p className="text-xl font-black text-emerald-400">{myPgs.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total PGs listed</p>
          </div>
          <div className="border-r border-slate-800"></div>
          <div>
            <p className="text-xl font-black text-blue-400">
              {myPgs.reduce((acc, curr) => acc + (curr.totalInquiries || 0), 0)}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leads Received</p>
          </div>
        </div>
      </section>

      {/* DYNAMIC NAVIGATION CONTROLLER BAR */}
      <section className="flex border-b border-slate-200 gap-4 text-xs font-black uppercase tracking-wider">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 flex items-center gap-1.5 transition-all ${activeTab === 'dashboard' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <MdDashboard className="text-base" /> My Properties
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-3 flex items-center gap-1.5 transition-all ${activeTab === 'settings' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <MdSettings className="text-base" /> Profile Settings
        </button>
      </section>

      {/* TAB CONTAINER VIEWPORT */}
      {activeTab === 'dashboard' ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">Your Hosted Living Inventories</h2>
              <p className="text-xs text-slate-500 font-medium">Manage allocations, pricing indices, and property parameters.</p>
            </div>
            <Link 
              to="/owner/add-pg" 
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition-all shadow-sm h-10"
            >
              <MdAddBusiness className="text-sm" /> List a New PG
            </Link>
          </div>

          {myPgs.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center max-w-lg mx-auto bg-slate-50/40">
              <MdHome className="text-slate-300 text-5xl mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No active housing slots indexed</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 max-w-xs mx-auto">Get started by hosting your property cluster network inside the Bhopal hub node.</p>
              <Link to="/owner/add-pg" className="bg-slate-900 text-white font-black px-4 py-2 text-xs uppercase tracking-wider rounded-lg shadow-xs">Add First PG Node</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPgs.map((item) => {
                const currentId = item.id || item._id;
                const cardImg = item.propertyImages?.[0] || item.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500";
                
                return (
                  <div key={currentId} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-center shadow-xs hover:border-slate-300 transition-all">
                    <img src={getOptimizedUrl(cardImg, 120, 100)} alt={item.title} className="w-24 h-20 rounded-lg object-cover bg-slate-100 flex-shrink-0 border" />
                    <div className="flex-grow min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-100 text-slate-800 text-[9px] uppercase font-black px-2 py-0.5 rounded-sm">{item.gender || "Unisex"}</span>
                        <span className="text-[10px] font-black text-emerald-600 font-mono">{formatPrice(item.price || 0)}/mo</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight">{item.title}</h3>
                      <p className="text-[11px] font-semibold text-slate-400 truncate">{item.area}, Bhopal</p>
                      <div className="flex items-center gap-3 pt-1.5 border-t border-slate-100 mt-2">
                        <Link to={`/pg/${currentId}`} className="text-[10px] uppercase font-black text-slate-500 hover:text-slate-900 transition-colors">Preview</Link>
                        <Link to={`/owner/edit-pg/${currentId}`} className="text-[10px] uppercase font-black text-emerald-600 hover:text-emerald-500 transition-colors">Modify Specs</Link>
                        <button type="button" onClick={() => handleDeletePG(currentId)} className="text-[10px] uppercase font-black text-red-500 hover:text-red-600 ml-auto flex items-center gap-0.5 transition-colors"><MdDeleteOutline className="text-xs" /> Wipe</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        
        /* DYNAMIC INTERACTIVE EDIT PROFILE INTERFACE */
        <section className="max-w-xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="mb-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Account Credentials Matrix</h3>
            <p className="text-xs text-slate-400 font-medium">Update identities, profiles and operational communication streams.</p>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            
            {/* AVATAR INTERFACE CLOUDINARY HOOK */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <img 
                src={profileForm.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"} 
                alt="Form Frame" 
                className="w-14 h-14 rounded-full object-cover border bg-slate-200 flex-shrink-0"
              />
              <label className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 cursor-pointer shadow-xs hover:bg-slate-50 transition-all">
                <MdCloudUpload className="text-slate-500 text-sm" /> 
                <span>Upload New Avatar</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {/* FULL LEGAL NAME INPUT */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Authorized Management Name</label>
              <input 
                type="text" required value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
              />
            </div>

            {/* SECURE DIRECT LINE PHONE INPUT */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Direct Direct Line Mobile (+91)</label>
              <input 
                type="tel" required value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
              />
            </div>
            {/* WHATSAPP COMMUNICATION INPUT */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">WhatsApp Communication (+91)</label>
              <input 
                type="tel" required value={profileForm.whatsappNumber}
                onChange={e => setProfileForm({ ...profileForm, whatsappNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
              />
            </div>

            {/* READONLY NOTIFICATION MATRIX EMAIL NODE */}
            <div className="space-y-1 opacity-60">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">System Communication Root (Non-Modifiable)</label>
              <input type="text" disabled value={user?.email || "No email bound to node."} className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-600 cursor-not-allowed" />
            </div>

            {/* TRIGGER SUBMIT BLOCK BUTTON */}
            <button 
              type="submit" 
              disabled={updatingProfile}
              className="w-full bg-slate-900 text-white font-black py-2.5 rounded-xl text-xs tracking-wider uppercase hover:bg-slate-800 transition-all shadow-xs disabled:opacity-40 h-10"
            >
              {updatingProfile ? "Updating Server Registry..." : "Commit Profile Changes"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
}