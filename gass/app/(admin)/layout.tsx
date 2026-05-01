"use client";

import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { SidebarProvider } from "@/context/SidebarContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <div className="flex h-screen w-full bg-white text-black font-sans selection:bg-black selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto relative">
                <div className="relative z-10 p-8 h-full max-w-[1600px] mx-auto">{children}</div>
              </main>
            </div>
          </div>
        </SidebarProvider>
    </QueryClientProvider>
  );
}
