"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, Building, Phone } from "lucide-react";

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<any>({
    department: "Pusat Medis / Administrasi",
    phone: "+62 812-XXXX-XXXX"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    department: "",
    phone: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Pertahankan departemen & telepon yang disave lokal, gabung dengan auth token
        setUserInfo({
          ...parsed,
          department: parsed.department || "Pusat Medis / Administrasi",
          phone: parsed.phone || "+62 812-XXXX-XXXX"
        });
      } catch (e) {}
    }
  }, []);

  const handleEdit = () => {
    setEditData({
      department: userInfo.department,
      phone: userInfo.phone
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedInfo = { ...userInfo, ...editData };
    setUserInfo(updatedInfo);
    localStorage.setItem("user_info", JSON.stringify(updatedInfo));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Profil Saya</h1>
        <p className="text-slate-400 text-sm">Informasi akun dan data personal Anda di RS Efarina.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-black/20">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-slate-900 border-b border-slate-800 relative">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        {/* Profile Content */}
        <div className="px-8 pb-8 relative">
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-slate-400 shadow-2xl overflow-hidden relative group">
              <User size={64} className="opacity-50 transition-opacity group-hover:opacity-30" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  Ubah Foto
                </div>
              )}
            </div>
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Edit Profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  Simpan Perubahan
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{userInfo.username || "Pengguna"}</h2>
              <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm mt-1 bg-indigo-500/10 w-fit px-3 py-1 rounded-full border border-indigo-500/20">
                <Shield size={14} />
                {userInfo.role || "EMPLOYEE"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/80">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username / NIK</label>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                  <User size={18} className="text-slate-400" />
                  <span className="font-medium">{userInfo.username || "Tidak ada"}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Utama</label>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                  <Mail size={18} className="text-slate-400" />
                  <span className="font-medium">{userInfo.username ? `${userInfo.username.toLowerCase().replace(/\s/g, '')}@rsefarina.id` : "Belum diatur"}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Departemen</label>
                {isEditing ? (
                  <div className="relative">
                    <Building size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={editData.department}
                      onChange={(e) => setEditData({...editData, department: e.target.value})}
                      className="w-full bg-slate-800/80 border border-indigo-500/50 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                    <Building size={18} className="text-slate-400" />
                    <span className="font-medium">{userInfo.department}</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No. Telepon (Darurat)</label>
                {isEditing ? (
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full bg-slate-800/80 border border-indigo-500/50 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                    <Phone size={18} className="text-slate-400" />
                    <span className="font-medium">{userInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
