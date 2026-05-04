"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, Info, Briefcase, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useSidebarStore } from "@/lib/sidebar-store";

const sidebarNavLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "#about", icon: Info },
  { label: "Services", href: "#services", icon: Briefcase },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set initial collapsed state for mobile
  useEffect(() => {
    if (isMobile && !isOpen) {
      // Already collapsed by default on mobile
    }
  }, [isMobile, isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, sidebarNavLinks.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? sidebarNavLinks.length - 1 : Math.max(prev - 1, 0)
      );
    } else if (e.key === "Enter" && focusedIndex !== null) {
      e.preventDefault();
      navItemsRef.current[focusedIndex]?.click();
    } else if (e.key === "Escape" && isMobile && isOpen) {
      e.preventDefault();
      toggle();
    }
  };

  // Focus the focused item
  useEffect(() => {
    if (focusedIndex !== null && navItemsRef.current[focusedIndex]) {
      navItemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => toggle()}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={twMerge(
          "fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col",
          isOpen ? "w-64" : "w-20",
          isMobile && !isOpen && "translate-x-0"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          {isOpen && (
            <span className="text-xl font-bold text-white">Brand</span>
          )}
          <button
            ref={toggleButtonRef}
            onClick={() => toggle()}
            className="inline-flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-white text-white hover:text-slate-200 transition-colors"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isOpen}
            aria-controls="sidebar-nav"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav
          id="sidebar-nav"
          className="flex-1 overflow-y-auto py-4"
          onKeyDown={handleKeyDown}
          role="menubar"
        >
          <ul className="space-y-2 px-2">
            {sidebarNavLinks.map((link, index) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <li key={link.label} role="none">
                  <a
                    ref={(el) => {
                      navItemsRef.current[index] = el;
                    }}
                    href={link.href}
                    className={twMerge(
                      "flex items-center gap-4 px-4 py-3 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white",
                      active
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                    aria-label={link.label}
                    aria-current={active ? "page" : undefined}
                    role="menuitem"
                    onClick={() => {
                      if (isMobile) {
                        toggle();
                      }
                      setFocusedIndex(null);
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && (
                      <span className="text-sm font-medium whitespace-nowrap">
                        {link.label}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
