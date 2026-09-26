"use client";

import { Grid, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavbar() {
  const pathname = usePathname();
  let appName = "Inventory";
  if (pathname.includes("/operations")) appName = "Operations";
  if (pathname.includes("/stock")) appName = "Stock";
  if (pathname.includes("/settings")) appName = "Settings";

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

      <div className="flex items-center gap-4">
        <Link href="/profile" className="flex items-center gap-2 hover:bg-white/10 p-1 rounded transition-colors">
          <span className="text-sm font-medium hidden sm:block">Administrator</span>
          <UserCircle size={24} />
        </Link>
      </div>
    </header>
  );
}
