import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { ENDPOINTS } from "../services/api/axios";
import PGCard from "../components/PGCard"; 
import { 
  MdVerified, MdAccountCircle, MdMail, MdPhone, MdHome, 
  MdCalendarToday, MdEdit, MdSettings, MdClose, MdLock, MdSave, 
  MdDelete, MdAddCircle, MdVisibility, MdVisibilityOff, MdPhotoCamera,
  MdZoomIn, MdCached
} from 'react-icons/md';

export default function OwnerProfile() {
  const navigate = useNavigate();

  // 1. Core Profile, Bio & Properties States
  const [profile, setProfile] = useState(null);
  const [myPgs, setMyPgs] = useState([]);
  const [activeTab, setActiveTab] = useState('pgs'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Custom Profile Details (Decoupled per user email)
  const [bio, setBio] = useState("Managing premium properties across Bhopal. Dedicated to providing safe, comfortable, and quality accommodation for modern students and professionals.");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // 2. Interactive Modals Overlays States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Image Preview Lightbox Modals
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxTitle, setLightboxTitle] = useState("");

  // 3. Form Input Submission States
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", whatsappNumber: "", bio: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);

  // 4. Password Visibility States
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Fetch initial dashboard data
  const fetchOwnerDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const profileRes = await api.get(ENDPOINTS.auth.me || '/owners/profile');
      setProfile(profileRes.data);
      
      // Extract profile photo & cover photo if available
      if (profileRes.data && profileRes.data.email) {
        const savedPhoto = localStorage.getItem(`owner_avatar_persistent_${profileRes.data.email}`);
        if (savedPhoto) {
          setAvatarPreview(savedPhoto);
        } else {
          setAvatarPreview(null);
        }

        const savedCover = localStorage.getItem(`owner_cover_persistent_${profileRes.data.email}`);
        if (savedCover) {
          setCoverPreview(savedCover);
        } else {
          setCoverPreview(null);
        }
      }

      setEditForm({ 
        name: profileRes.data.name || "", 
        email: profileRes.data.email || "", 
        phone: profileRes.data.phone || "",
        whatsappNumber: profileRes.data.whatsappNumber || "",
        bio: bio
      });

      const pgsRes = await api.get(ENDPOINTS.pgs.owner || '/pgs/owner');
      setMyPgs(pgsRes.data || []);
    } catch (err) {
      console.error("Dashboard data load failure:", err);
      setError(err.message || "Failed to load owner profile dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboardData();
  }, []);

  // Handle Profile Picture Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setAvatarPreview(base64Data);
        
        if (profile && profile.email) {
          localStorage.setItem(`owner_avatar_persistent_${profile.email}`, base64Data);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cover Picture Upload
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setCoverPreview(base64Data);
        
        if (profile && profile.email) {
          localStorage.setItem(`owner_cover_persistent_${profile.email}`, base64Data);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Full Screen Image Preview Lightbox
  const openImageLightbox = (imageSrc, title) => {
    if (!imageSrc) return; // Don't trigger if it's a fallback icon
    setLightboxImage(imageSrc);
    setLightboxTitle(title);
  };

  // Update Personal Profile Details
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(ENDPOINTS.auth.updateProfile || '/owners/profile', {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        whatsappNumber: editForm.whatsappNumber,
      });
      
      if (avatarPreview && profile && profile.email && profile.email !== editForm.email) {
        localStorage.setItem(`owner_avatar_persistent_${editForm.email}`, avatarPreview);
      }
      if (coverPreview && profile && profile.email && profile.email !== editForm.email) {
        localStorage.setItem(`owner_cover_persistent_${editForm.email}`, coverPreview);
      }

      setProfile(prev => ({ ...prev, name: editForm.name, email: editForm.email, phone: editForm.phone, whatsappNumber: editForm.whatsappNumber }));
      setBio(editForm.bio);
      
      setIsEditModalOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update profile. Please ensure all fields are correct.");
    } finally {
      setSubmitting(false);
    }
  };

  // Change Password Controller
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Validation failed: New Password and Confirm Password do not match!");
      return;
    }
    setSubmitting(true);
    try {
      await api.put(ENDPOINTS.auth.changePassword || '/owners/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setIsSettingsModalOpen(false);
      alert("Password changed successfully!");
    } catch (err) {
      alert(err.message || "Failed to change password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Property Action
  const handleDeletePg = async (pgId) => {
    if (!window.confirm("Are you sure you want to permanently delete this PG listing?")) return;
    try {
      await api.delete(`${ENDPOINTS.pgs.base}/${pgId}`);
      alert("Property listing removed successfully.");
      setMyPgs(prev => prev.filter(item => (item.id || item._id) !== pgId));
    } catch (err) {
      alert(err.message || "Failed to delete the property listing.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Synchronizing Node Dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 🌟 PREMIUM GRAPHICS BANNER CLUSTER */}
      <div className="relative rounded-3xl text-white shadow-xl overflow-hidden mb-8 border border-slate-200/10 group/cover min-h-[360px] flex items-end">
        
        {/* Background Image Viewer / Fallback Gradient */}
        {coverPreview ? (
          <div 
            onClick={() => openImageLightbox(coverPreview, "Background Cover Banner")}
            className="absolute inset-0 w-full h-full cursor-zoom-in group/coverimg"
          >
            <img 
              src={coverPreview} 
              alt="Dashboard Cover" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/coverimg:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 shadow-xl"><MdZoomIn className="text-sm text-indigo-400" /> Click to View Full Banner</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"></div>
        )}
        
        {/* Visual Overlays & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-0 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-emerald-500/5 to-transparent rounded-full pointer-events-none -mr-32 -mt-32 z-0"></div>
        
        {/* Dynamic Cover Photo Modifier Button */}
        <label className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/70 hover:bg-slate-900/90 border border-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl backdrop-blur-md cursor-pointer transition-all active:scale-95 shadow-lg select-none opacity-90 hover:opacity-100">
          <MdPhotoCamera className="text-sm text-indigo-400" />
          <span>Upload New Banner</span>
          <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
        </label>

        {/* Content Box */}
        <div className="relative w-full p-6 sm:p-10 z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-6 max-w-3xl">
            
            {/* 📸 SMART AVATAR CIRCLE CONTAINER */}
            <div className="relative group/avatar w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl bg-slate-900 flex items-center justify-center shrink-0 transition-all duration-300 hover:border-indigo-400 transform translate-y-4">
              {avatarPreview ? (
                <div 
                  onClick={() => openImageLightbox(avatarPreview, "Profile Portrait View")}
                  className="w-full h-full cursor-zoom-in"
                >
                  <img src={avatarPreview} alt="Host Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-105" />
                </div>
              ) : (
                <MdAccountCircle className="text-9xl text-slate-700" />
              )}
              
              {/* Overlay with Multi Options */}
              <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-all duration-300 text-white text-[10px] font-bold uppercase tracking-wider gap-1.5 backdrop-blur-xs">
                {avatarPreview && (
                  <button 
                    onClick={() => openImageLightbox(avatarPreview, "Profile Portrait View")}
                    className="bg-white/10 hover:bg-white/25 border border-white/10 px-2.5 py-1 rounded-md mb-0.5 transition-colors text-[9px] flex items-center gap-1"
                  >
                    <MdZoomIn className="text-xs text-indigo-400" /> View
                  </button>
                )}
                <label className="flex flex-col items-center justify-center cursor-pointer text-center px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors text-[9px] font-semibold tracking-wide gap-1">
                  <MdPhotoCamera className="text-xs" />
                  <span>{avatarPreview ? 'Change' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
            
            <div className="space-y-3 pb-2 mt-4 sm:mt-0">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight sm:leading-none">
                  {profile?.name || (profile?.role === 'ADMIN' ? 'Admin Controller' : 'Partner Dashboard')}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 shadow-xs backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <MdVerified className="text-xs" /> {profile?.role === 'ADMIN' ? 'System Admin' : 'Verified Partner'}
                </span>
              </div>
              
              <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed line-clamp-2">
                {bio}
              </p>
              
              {/* META INFO STRIP */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 pt-2 text-xs text-slate-300 font-semibold border-t border-white/10">
                <span className="flex items-center gap-2 hover:text-white transition-colors"><MdMail className="text-indigo-400 text-base" /> {profile?.email}</span>
                {profile?.phone && <span className="flex items-center gap-2 hover:text-white transition-colors"><MdPhone className="text-indigo-400 text-base" /> {profile.phone}</span>}
                {profile?.whatsappNumber && <span className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><MdPhone className="text-emerald-400 text-base" /> {profile.whatsappNumber} (WhatsApp)</span>}
              </div>
            </div>
          </div>

          {/* ACTION BUTTON GRID */}
          <div className="flex sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0 self-center lg:self-end pb-2">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all border border-white/10 backdrop-blur-md shadow-lg"
            >
              <MdEdit className="text-indigo-400 text-sm" /> Edit Profile
            </button>
            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all border border-white/10 backdrop-blur-md shadow-lg"
            >
              <MdSettings className="text-slate-300 text-sm" /> Settings
            </button>
          </div>
        </div>
      </div>

      {/* 📊 ANALYTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-6 sm:mt-10">
        {/* CARD 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Active Nodes</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{myPgs.length} Properties</p>
          </div>
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-600 text-xl transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6"><MdHome /></div>
        </div>
        
        {/* CARD 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Jurisdiction</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{profile?.city || "Bhopal, MP"}</p>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-xl text-emerald-600 text-xl transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110"><MdVerified /></div>
        </div>

        {/* CARD 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-purple-500/30 hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tier Architecture</p>
            <p className="text-2xl font-black text-purple-600 tracking-tight">Premium Verified</p>
          </div>
          <div className="bg-purple-50 p-3.5 rounded-xl text-purple-600 text-xl transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white group-hover:-translate-y-1"><MdCalendarToday /></div>
        </div>
      </div>

      {/* 🧭 NAVIGATION SEGMENT CONTROLLER */}
      <div className="border-b border-slate-200 mb-8 flex gap-8">
        <button 
          onClick={() => setActiveTab('pgs')} 
          className={`pb-4 text-xs uppercase font-bold tracking-widest border-b-2 transition-all duration-300 relative ${activeTab === 'pgs' ? 'border-indigo-600 text-slate-950 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          My Listings ({myPgs.length})
          {activeTab === 'pgs' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 rounded-full animate-fade-in"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`pb-4 text-xs uppercase font-bold tracking-widest border-b-2 transition-all duration-300 relative ${activeTab === 'overview' ? 'border-indigo-600 text-slate-950 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Node Parameters
          {activeTab === 'overview' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 rounded-full animate-fade-in"></span>}
        </button>
      </div>

      {/* 🗺️ DYNAMIC PANEL DATA */}
      {activeTab === 'pgs' ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-end">
            <Link to="/add-pg" className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 transition-all">
              <MdAddCircle className="text-sm" /> Add Property Instance
            </Link>
          </div>

          {myPgs.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400 text-xl"><MdHome /></div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No active property nodes configured.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPgs.map((pgItem) => {
                const currentId = pgItem.id || pgItem._id;
                return (
                  <div key={currentId} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative">
                      <PGCard pg={pgItem} />
                    </div>
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeletePg(currentId)}
                        className="flex items-center gap-1.5 text-[11px] font-bold bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-3.5 py-2 rounded-xl transition-all duration-200 border border-slate-200 hover:border-rose-200 shadow-xs"
                      >
                        <MdDelete className="text-sm" /> Remove Listing
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 max-w-3xl shadow-xs space-y-6 animate-fade-in">
          <div>
            <h3 className="text-[10px] font-black mb-4 uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><span className="w-1 h-3 bg-indigo-600 rounded-full"></span> Secure Profile Ledger</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Legal Entity Name</span>
                <span className="text-slate-900 text-sm font-bold block mt-1">{profile?.name}</span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Registered Communication Box</span>
                <span className="text-slate-900 text-xs font-mono font-bold block mt-1 break-all">{profile?.email}</span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Primary Phone Gateway</span>
                <span className="text-slate-900 text-sm font-bold block mt-1">{profile?.phone || "Null"}</span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">WhatsApp Enterprise Gateway</span>
                <span className="text-slate-900 text-sm font-bold block mt-1">{profile?.whatsappNumber || "Null"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ LIGHTBOX MODAL: FULL RESOLUTION VIEW & DYNAMIC CHANGE OPTION */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
          {/* Header Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white mb-4 px-2">
            <h4 className="text-xs uppercase font-black tracking-widest text-indigo-400">{lightboxTitle}</h4>
            <div className="flex items-center gap-3">
              {/* Contextual Change Input from within Lightbox */}
              <label className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all select-none">
                <MdCached className="text-sm" /> Replace Image
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if(lightboxTitle.includes("Banner")) {
                      handleCoverChange(e);
                    } else {
                      handleFileChange(e);
                    }
                    setLightboxImage(null); // Close after choosing
                  }} 
                />
              </label>
              <button 
                onClick={() => setLightboxImage(null)} 
                className="text-slate-400 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-xl text-xl"
              >
                <MdClose />
              </button>
            </div>
          </div>
          
          {/* Image Canvas Box */}
          <div className="relative max-w-4xl max-h-[75vh] bg-slate-900/50 rounded-2xl border border-white/5 p-2 overflow-hidden flex items-center justify-center shadow-2xl">
            <img 
              src={lightboxImage} 
              alt="Fullscreen Preview" 
              className="max-w-full max-h-[72vh] object-contain rounded-xl select-none"
            />
          </div>
          <p className="text-slate-500 text-[11px] mt-3 font-medium">Tip: Click outside or tap close button to escape matrix projection.</p>
        </div>
      )}

      {/* 📝 OVERLAY MODAL: EDIT TEXT MATRICES */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col scale-100 transition-transform">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center shrink-0 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><MdEdit className="text-indigo-400 text-base" /> Modify Node Identity</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-lg text-lg"><MdClose /></button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4 overflow-y-auto flex-grow custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp Number</label>
                <input 
                  type="tel"
                  value={editForm.whatsappNumber}
                  onChange={(e) => setEditForm({...editForm, whatsappNumber: e.target.value})}
                  placeholder="Enter 10-digit WhatsApp number"
                  maxLength="10"
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">About Me / Bio</label>
                <textarea 
                  value={editForm.bio} 
                  rows={3}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full mt-4 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-98 transition-all shadow-md shadow-indigo-600/10 disabled:opacity-50"
              >
                <MdSave className="text-base" /> {submitting ? "Committing..." : "Commit Parameter Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔐 OVERLAY MODAL: CHANGE SECURITY PASSWORD MATRIX */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><MdLock className="text-indigo-400 text-base" /> Update Access Crypt</h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-lg text-lg"><MdClose /></button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input 
                    type={showOldPass ? "text" : "password"} 
                    value={passwordForm.oldPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg">
                    {showOldPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password Target</label>
                <div className="relative">
                  <input 
                    type={showNewPass ? "text" : "password"} 
                    value={passwordForm.newPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg">
                    {showNewPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verify Password Target</label>
                <div className="relative">
                  <input 
                    type={showConfirmPass ? "text" : "password"} 
                    value={passwordForm.confirmPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg">
                    {showConfirmPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full mt-4 bg-slate-950 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-98 transition-all shadow-md disabled:opacity-50"
              >
                <MdSave className="text-base text-indigo-400" /> {submitting ? "Updating token..." : "Rewrite Password Crypt"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}