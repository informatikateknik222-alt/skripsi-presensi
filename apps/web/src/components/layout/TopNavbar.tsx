import { Bell, User, LogOut, Settings, UserCircle, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [userName, setUserName] = useState("Admin User");
  const [userRole, setUserRole] = useState("ADMIN");
  
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Sistem', message: 'Pengajuan cuti Anda telah disetujui.', time: '10 menit yang lalu', read: false, type: 'system' },
    { id: 2, title: 'Admin', message: 'Silakan cek jadwal dinas terbaru.', time: '1 jam yang lalu', read: false, type: 'admin' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    window.location.href = "/";
  };

  useEffect(() => {
    // Di real app, ambil data dari Token
    const savedInfo = localStorage.getItem("user_info");
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        if (parsed.username) setUserName(parsed.username);
        if (parsed.role) setUserRole(parsed.role);
      } catch (e) {}
    }
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
      {/* Left side: Hamburger (Mobile) + Breadcrumb (Desktop) */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:block">
          {/* Breadcrumb could go here */}
        </div>
      </div>

      {/* Right Side (Actions) */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </button>
          
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifikasi</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">{unreadCount} Baru</span>
                )}
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-indigo-50/30 dark:bg-slate-800/50' : 'opacity-70'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${notif.type === 'system' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'}`}>
                        {notif.type === 'system' ? <User size={16} /> : <Bell size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 dark:text-slate-200"><span className="font-medium text-slate-900 dark:text-white">{notif.title}</span> {notif.message}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 text-sm">Tidak ada notifikasi</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

        {/* Profile / Avatar */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{userName}</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{userRole}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:border-indigo-500 transition-colors shadow-sm overflow-hidden">
               <User size={20} />
            </div>
          </div>
          
          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/30">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userRole}</p>
              </div>
              <div className="p-2">
                <Link href="/dashboard/profile" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-left">
                  <UserCircle size={16} className="text-slate-400" />
                  Profil Saya
                </Link>
                <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-left">
                  <Settings size={16} className="text-slate-400" />
                  Pengaturan
                </Link>
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-700/50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-medium"
                >
                  <LogOut size={16} />
                  Keluar / Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
