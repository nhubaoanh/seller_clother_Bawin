"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import storage from "@/utils/storage";
import { getMenuByRole, MenuItem } from "@/lib/auth";

export default function Sidebar() {
  const { isSidebarOpen } = useSidebar();
  const pathname = usePathname();
  const [sidebarItems, setSidebarItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const user = storage.getUser();
    const roleCode = user?.role_code || "ADMIN";
    const menuItems = getMenuByRole(roleCode);
    setSidebarItems(menuItems);
  }, []);

  return (
    <div
      className={`relative z-20 transition-all duration-500 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-72" : "w-24"
      }`}
    >
      <div className="h-full bg-white border-r border-gray-100 p-6 flex flex-col justify-between overflow-hidden">
        <div>
          {/* Logo Area */}
          <div className="mb-12 flex justify-center text-center">
            <h2 className={`font-black uppercase tracking-tighter leading-tight ${isSidebarOpen ? 'text-2xl' : 'text-[10px]'}`}>
              {isSidebarOpen ? (
                <>CLOTH <br /><span className="text-gray-300">SELLER</span></>
              ) : (
                "CS"
              )}
            </h2>
          </div>

          <nav className="flex flex-col space-y-4">
            {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-black text-white shadow-xl shadow-black/10 translate-x-1"
                          : "text-gray-400 hover:text-black hover:bg-gray-50"
                      }`}
                    >
                      <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                         {/* Nếu icon là component thì render, nếu là path thì render Image. Ở đây giả định là component lucide nếu đã sửa lib/auth */}
                         {/* Tạm thời dùng icon mặc định nếu không chắc chắn type */}
                         <div className="w-5 h-5 flex items-center justify-center">
                            <span className="font-black text-[10px]">{item.name.charAt(0)}</span>
                         </div>
                      </div>
                      {isSidebarOpen && (
                        <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">{item.name}</span>
                      )}
                    </Link>
                )
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        {isSidebarOpen && (
            <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] mb-1">Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-black uppercase">Live System</span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
