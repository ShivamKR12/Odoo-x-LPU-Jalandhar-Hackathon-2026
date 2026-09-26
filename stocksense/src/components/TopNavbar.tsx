"use client";

import { Grid, UserCircle, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function TopNavbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  let appName = "Inventory";
  if (pathname.includes("/operations")) appName = "Operations";
  if (pathname.includes("/stock")) appName = "Stock";
  if (pathname.includes("/settings")) appName = "Settings";
  if (pathname.includes("/history")) appName = "Move History";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[46px] bg-odoo-purple text-white flex items-center justify-between px-4 shrink-0 shadow-sm z-50">
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-white/10 rounded transition-colors">
          <Grid size={18} />
        </button>
        <Link href="/" className="font-semibold text-[15px] tracking-wide">
          {appName}
        </Link>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors focus:outline-none"
        >
          <span className="text-[13px] font-medium hidden sm:block">{userName}</span>
          <UserCircle size={24} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-[40px] w-48 bg-white text-odoo-text shadow-lg rounded-sm border border-gray-200 overflow-hidden py-1 z-50">
            <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-[13px] hover:bg-gray-100 transition-colors">
              <User size={16} className="text-odoo-muted" />
              My Profile
            </Link>
            <div className="h-px bg-gray-200 my-1"></div>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })} 
              className="w-full flex items-center gap-3 px-4 py-2 text-[13px] hover:bg-gray-100 transition-colors text-left"
            >
              <LogOut size={16} className="text-odoo-danger" />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
