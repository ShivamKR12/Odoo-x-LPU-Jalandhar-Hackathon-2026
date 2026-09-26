"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowRightLeft, Package, History, Settings, ChevronDown, ChevronRight, FileDown, FileUp, FileWarning, MapPin, Building2 } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [opsOpen, setOpsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const linkClass = (active: boolean) => 
    `flex items-center gap-3 px-4 py-2 text-[13px] transition-colors ${active ? "bg-gray-100 font-bold text-odoo-text" : "text-odoo-text hover:bg-gray-50"}`;

  const subLinkClass = (active: boolean) => 
    `flex items-center gap-3 py-1.5 text-[13px] transition-colors ${active ? "font-bold text-odoo-text" : "text-odoo-muted hover:text-odoo-text"}`;

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 min-h-full flex flex-col shrink-0 overflow-y-auto">
      <nav className="flex-1 py-4 space-y-1">
        <Link href="/" className={linkClass(isActive("/") && pathname === "/")}>
          <LayoutDashboard size={16} className="text-odoo-muted" />
          <span>Dashboard</span>
        </Link>

        {/* Operations */}
        <div>
          <button onClick={() => setOpsOpen(!opsOpen)} className={`w-full flex items-center justify-between px-4 py-2 text-[13px] transition-colors ${isActive("/operations") ? "font-bold bg-gray-100 text-odoo-text" : "text-odoo-text hover:bg-gray-50"}`}>
            <div className="flex items-center gap-3">
              <ArrowRightLeft size={16} className="text-odoo-muted" />
              <span>Operations</span>
            </div>
            {opsOpen ? <ChevronDown size={14} className="text-odoo-muted" /> : <ChevronRight size={14} className="text-odoo-muted" />}
          </button>
          
          {opsOpen && (
            <div className="pl-11 pr-4 py-1 space-y-1">
              <Link href="/operations/receipts" className={subLinkClass(isActive("/operations/receipts"))}>
                <FileDown size={14} />
                1. Receipt
              </Link>
              <Link href="/operations/deliveries" className={subLinkClass(isActive("/operations/deliveries"))}>
                <FileUp size={14} />
                2. Delivery
              </Link>
              <Link href="/operations/adjustments" className={subLinkClass(isActive("/operations/adjustments"))}>
                <FileWarning size={14} />
                3. Adjustment
              </Link>
            </div>
          )}
        </div>

        <Link href="/stock" className={linkClass(isActive("/stock"))}>
          <Package size={16} className="text-odoo-muted" />
          <span>Stock</span>
        </Link>

        <Link href="/history" className={linkClass(isActive("/history"))}>
          <History size={16} className="text-odoo-muted" />
          <span>Move History</span>
        </Link>

        {/* Settings */}
        <div>
          <button onClick={() => setSettingsOpen(!settingsOpen)} className={`w-full flex items-center justify-between px-4 py-2 text-[13px] transition-colors ${isActive("/settings") ? "font-bold bg-gray-100 text-odoo-text" : "text-odoo-text hover:bg-gray-50"}`}>
            <div className="flex items-center gap-3">
              <Settings size={16} className="text-odoo-muted" />
              <span>Settings</span>
            </div>
            {settingsOpen ? <ChevronDown size={14} className="text-odoo-muted" /> : <ChevronRight size={14} className="text-odoo-muted" />}
          </button>
          
          {settingsOpen && (
            <div className="pl-11 pr-4 py-1 space-y-1">
              <Link href="/settings/warehouse" className={subLinkClass(isActive("/settings/warehouse"))}>
                <Building2 size={14} />
                1. Warehouse
              </Link>
              <Link href="/settings/locations" className={subLinkClass(isActive("/settings/locations"))}>
                <MapPin size={14} />
                2. Locations
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
