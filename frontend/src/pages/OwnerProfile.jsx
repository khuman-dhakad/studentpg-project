import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { ENDPOINTS } from "../services/api/axios";
import PGCard from "../components/PGCard"; 
import { 
  MdVerified, MdAccountCircle, MdMail, MdPhone, MdHome, 
  MdCalendarToday, MdEdit, MdSettings, MdClose, MdLock, MdSave, 
  MdDelete, MdAddCircle, MdVisibility, MdVisibilityOff, MdPhotoCamera
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

  // 2. Interactive Modals Overlays States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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
      
      // Extract profile photo if available
      if (profileRes.data && profileRes.data.email) {
        const savedPhoto = localStorage.getItem(`owner_avatar_persistent_${profileRes.data.email}`);
        if (savedPhoto) {
          setAvatarPreview(savedPhoto);
        } else {
          setAvatarPreview(null);
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
      <div className="max-w-6xl mx-auto px-4 py-32 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p className="text-xs font-semibold text-slate-400 tracking-wide">Loading owner dashboard...</p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 flex-grow">
      
      {/* 🌟 HEADER BANNER CARD LAYER */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center gap-6 z-10">
          
          {/* 📸 INTERACTIVE AVATAR WITH INTEGRATED EDIT CLAMP */}
          <div className="relative group/avatar w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-white/10 flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Host Avatar" className="w-full h-full object-cover" />
            ) : (
              <MdAccountCircle className="text-7xl text-emerald-400" />
            )}
            
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-black uppercase tracking-wider gap-1 select-none">
              <MdPhotoCamera className="text-xl text-emerald-400" />
              <span>Change</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          
          <div className="text-center sm:text-left flex-grow space-y-2">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {profile?.name || (profile?.role === 'ADMIN' ? 'Admin Dashboard' : 'Owner Dashboard')}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <MdVerified /> {profile?.role === 'ADMIN' ? 'System Admin' : 'Verified Partner'}
              </span>
            </div>
            
            <p className="text-xs font-medium text-slate-300 max-w-xl leading-relaxed">
              {bio}
            </p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1"><MdMail className="text-emerald-400 text-sm" /> {profile?.email}</span>
              {profile?.phone && <span className="flex items-center gap-1"><MdPhone className="text-emerald-400 text-sm" /> {profile.phone}</span>}
              {profile?.whatsappNumber && <span className="flex items-center gap-1"><MdPhone className="text-emerald-400 text-sm" /> {profile.whatsappNumber} (WhatsApp)</span>}
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-white/10"
            >
              <MdEdit className="text-emerald-400" /> Edit Profile
            </button>
            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-white/10"
            >
              <MdSettings className="text-blue-400" /> Settings
            </button>
          </div>
        </div>
      </div>

      {/* 📊 BUSINESS HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Properties</p>
            <p className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{myPgs.length} Active</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 text-2xl transition-transform group-hover:scale-110"><MdHome /></div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:border-blue-500/20 transition-all">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary City Location</p>
            <p className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{profile?.city || "Bhopal, MP"}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 text-2xl transition-transform group-hover:scale-110"><MdVerified /></div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:border-purple-500/20 transition-all">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
            <p className="text-3xl font-black text-purple-600 tracking-tight">Premium Verified</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 text-2xl transition-transform group-hover:scale-110"><MdCalendarToday /></div>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="border-b border-slate-200 mb-6 flex gap-6">
        <button onClick={() => setActiveTab('pgs')} className={`pb-3 text-xs uppercase font-black tracking-wider border-b-2 transition-all ${activeTab === 'pgs' ? 'border-slate-950 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          My Listings ({myPgs.length})
        </button>
        <button onClick={() => setActiveTab('overview')} className={`pb-3 text-xs uppercase font-black tracking-wider border-b-2 transition-all ${activeTab === 'overview' ? 'border-slate-950 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          Profile Details
        </button>
      </div>

      {/* 🗺️ DYNAMIC CONTENT SWITCH CHANGER */}
      {activeTab === 'pgs' ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Link to="/add-pg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all">
              <MdAddCircle className="text-base" /> Add New PG Listing
            </Link>
          </div>

          {myPgs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm font-bold text-slate-700">No properties listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myPgs.map((pgItem) => {
                const currentId = pgItem.id || pgItem._id;
                return (
                  <div key={currentId} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md flex flex-col justify-between">
                    <div>
                      <PGCard pg={pgItem} />
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeletePg(currentId)}
                        className="flex items-center gap-1 text-xs font-black bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl transition-colors border border-red-200"
                      >
                        <MdDelete /> Remove Listing
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-2xl space-y-6">
          <div>
            <h3 className="text-sm font-black mb-3 uppercase tracking-wider text-slate-400">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 uppercase font-black">Owner Name</span>
                <span className="text-slate-900 text-sm font-bold">{profile?.name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 uppercase font-black">Email Address</span>
                <span className="text-slate-900 font-mono">{profile?.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 uppercase font-black">Phone Number</span>
                <span className="text-slate-900 font-bold">{profile?.phone || "Not Set"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 uppercase font-black">WhatsApp Number</span>
                <span className="text-slate-900 font-bold">{profile?.whatsappNumber || "Not Set"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📝 INTERACTIVE MODAL: EDIT TEXT MATRICES */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><MdEdit className="text-emerald-400" /> Edit Profile Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors text-xl"><MdClose /></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">WhatsApp Number</label>
                <input 
                  type="tel"
                  value={editForm.whatsappNumber}
                  onChange={(e) => setEditForm({...editForm, whatsappNumber: e.target.value})}
                  placeholder="Enter 10-digit WhatsApp number"
                  maxLength="10"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">About Me / Bio</label>
                <textarea 
                  value={editForm.bio} 
                  rows={3}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full mt-2 bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                <MdSave className="text-base text-emerald-400" /> {submitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔐 INTERACTIVE MODAL: CHANGE SECURITY PASSWORD MATRIX */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><MdLock className="text-blue-400" /> Change Password</h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors text-xl"><MdClose /></button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input 
                    type={showOldPass ? "text" : "password"} 
                    value={passwordForm.oldPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                    required
                  />
                  <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base">
                    {showOldPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPass ? "text" : "password"} 
                    value={passwordForm.newPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base">
                    {showNewPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPass ? "text" : "password"} 
                    value={passwordForm.confirmPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base">
                    {showConfirmPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full mt-2 bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                <MdSave className="text-base text-blue-400" /> {submitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}