"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useSidebarStore } from "@/lib/sidebar-store";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebarStore();

  // Close sidebar on mobile by default on first load
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Sidebar defaults to closed on mobile based on localStorage
      // If not in localStorage yet, the persist middleware will use the initial value (true)
      // So we need to check if this is the first time and set it to closed on mobile
      const stored = localStorage.getItem("sidebar-storage");
      if (!stored && isMobile) {
        useSidebarStore.setState({ isOpen: false });
      }
    }
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        } overflow-auto`}
      >
        {children}
      </main>
    </div>
  );
}
