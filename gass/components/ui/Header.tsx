"use client";
import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Settings, LogOut, User, Search } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";
import storage from "@/utils/storage";
import Link from "next/link";
import { ProfileModal } from "@/components/ProfileModal";

const DEFAULT_AVATAR = "/images/vangoc.jpg";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    storage.clearToken();
    storage.removeUser();
    router.push("/login");
  };

  useEffect(() => {
    const user = storage.getUser();
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleProfileUpdate = (updatedUser: any) => {
    setUserData(updatedUser);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 py-4 px-8 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
            <button
              onClick={toggleSidebar}
              className="p-3 rounded-full bg-gray-50 hover:bg-black hover:text-white transition-all duration-300"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-6 py-2 gap-3 w-64 border border-transparent focus-within:border-black/10 transition-all">
                <Search size={16} className="text-gray-400" />
                <input 
                    placeholder="Global Search..."
                    className="bg-transparent outline-none text-[11px] font-bold uppercase tracking-widest w-full"
                />
            </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-black transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full" />
          </button>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 pl-4 border-l border-gray-100 group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black uppercase tracking-widest text-black group-hover:text-gray-400 transition-colors">
                    {userData?.full_name || 'Administrator'}
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{userData?.role_name || 'Master Account'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-black text-sm overflow-hidden group-hover:ring-4 ring-gray-50 transition-all italic">
                {userData?.full_name?.charAt(0) || <User size={20} />}
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-6 w-64 bg-white rounded-3xl shadow-2xl py-4 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-6 py-4 border-b border-gray-50">
                  <p className="text-xs font-black uppercase tracking-widest text-black">{userData?.full_name || 'Người dùng'}</p>
                  <p className="text-[10px] font-bold text-gray-400 truncate">{userData?.email || 'admin@jmfashion.com'}</p>
                </div>

                <div className="p-2">
                    <button
                      className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-black transition-all rounded-2xl"
                      onClick={() => {
                        setOpen(false);
                        setProfileModalOpen(true);
                      }}
                    >
                      <User size={18} />
                      <span className="text-[11px] font-black uppercase tracking-widest">Profile</span>
                    </button>

                    <Link
                      href="/settings"
                      className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-black transition-all rounded-2xl"
                      onClick={() => setOpen(false)}
                    >
                      <Settings size={18} />
                      <span className="text-[11px] font-black uppercase tracking-widest">Settings</span>
                    </Link>

                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-black hover:text-white transition-all rounded-2xl"
                      >
                        <LogOut size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
                      </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        user={userData}
        onUpdate={handleProfileUpdate}
      />
    </header>
  );
}
