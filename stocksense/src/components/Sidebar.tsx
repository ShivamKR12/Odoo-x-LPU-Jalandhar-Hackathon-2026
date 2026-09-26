"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ArrowRightLeft, History, Settings, User, LogOut, ChevronDown, ChevronRight, FileDown, FileUp, FileWarning, MapPin, Building2 } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [opsOpen, setOpsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-500">StockSense</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <Link href="/" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/") && pathname === "/" ? "bg-slate-800 text-orange-400" : "hover:bg-slate-800/50"}`}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Operations */}
        <div>
          <button onClick={() => setOpsOpen(!opsOpen)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${isActive("/operations") ? "text-orange-400" : "hover:bg-slate-800/50"}`}>
            <div className="flex items-center gap-3">
              <ArrowRightLeft size={20} />
              <span className="font-medium">Operations</span>
            </div>
            {opsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {opsOpen && (
            <div className="pl-11 pr-4 py-1 space-y-1">
              <Link href="/operations/receipts" className={`flex items-center gap-3 py-2 text-sm transition-colors ${isActive("/operations/receipts") ? "text-orange-400 font-medium" : "text-slate-400 hover:text-slate-200"}`}>
                <FileDown size={16} />
                1. Receipt
              </Link>
              <Link href="/operations/deliveries" className={`flex items-center gap-3 py-2 text-sm transition-colors ${isActive("/operations/deliveries") ? "text-orange-400 font-medium" : "text-slate-400 hover:text-slate-200"}`}>
                <FileUp size={16} />
                2. Delivery
              </Link>
              <Link href="/operations/adjustments" className={`flex items-center gap-3 py-2 text-sm transition-colors ${isActive("/operations/adjustments") ? "text-orange-400 font-medium" : "text-slate-400 hover:text-slate-200"}`}>
                <FileWarning size={16} />
                3. Adjustment
              </Link>
            </div>
          )}
        </div>

        <Link href="/stock" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/stock") ? "bg-slate-800 text-orange-400" : "hover:bg-slate-800/50"}`}>
          <Package size={20} />
          <span className="font-medium">Stock</span>
        </Link>

        <Link href="/history" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/history") ? "bg-slate-800 text-orange-400" : "hover:bg-slate-800/50"}`}>
          <History size={20} />
          <span className="font-medium">Move History</span>
        </Link>

        {/* Settings */}
        <div>
          <button onClick={() => setSettingsOpen(!settingsOpen)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${isActive("/settings") ? "text-orange-400" : "hover:bg-slate-800/50"}`}>
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </div>
            {settingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {settingsOpen && (
            <div className="pl-11 pr-4 py-1 space-y-1">
              <Link href="/settings/warehouse" className={`flex items-center gap-3 py-2 text-sm transition-colors ${isActive("/settings/warehouse") ? "text-orange-400 font-medium" : "text-slate-400 hover:text-slate-200"}`}>
                <Building2 size={16} />
                1. Warehouse
              </Link>
              <Link href="/settings/locations" className={`flex items-center gap-3 py-2 text-sm transition-colors ${isActive("/settings/locations") ? "text-orange-400 font-medium" : "text-slate-400 hover:text-slate-200"}`}>
                <MapPin size={16} />
                2. Locations
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <Link href="/profile" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive("/profile") ? "bg-slate-800 text-orange-400" : "hover:bg-slate-800/50"}`}>
          <User size={20} />
          <span className="font-medium">My Profile</span>
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800/50 transition-colors text-left text-red-400">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
