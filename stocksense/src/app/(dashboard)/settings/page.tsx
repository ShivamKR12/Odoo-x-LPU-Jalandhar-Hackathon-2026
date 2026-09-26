import prisma from "@/lib/prisma";
import { createWarehouse, createLocation } from "./actions";
import { Building2, MapPin } from "lucide-react";

export default async function SettingsPage() {
  const warehouses = await prisma.warehouse.findMany({
    include: { locations: true }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Warehouses */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-orange-500" />
            Warehouses
          </h2>
          <form action={createWarehouse} className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" name="name" required placeholder="Name (e.g. Main)" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              <input type="text" name="shortCode" required placeholder="Short Code (e.g. WH)" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
            </div>
            <div className="flex gap-2">
              <input type="text" name="address" placeholder="Address (Optional)" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700">Add</button>
            </div>
          </form>

          <ul className="space-y-3">
            {warehouses.map(wh => (
              <li key={wh.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">{wh.name}</span>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded">{wh.shortCode}</span>
                </div>
                {wh.address && <span className="text-sm text-slate-500">{wh.address}</span>}
              </li>
            ))}
            {warehouses.length === 0 && <li className="text-slate-500 text-sm">No warehouses configured.</li>}
          </ul>
        </div>

        {/* Locations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-orange-500" />
            Locations / Racks
          </h2>
          <form action={createLocation} className="space-y-3 mb-6">
            <select name="warehouseId" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
              <option value="">Select Warehouse...</option>
              {warehouses.map(wh => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="text" name="name" required placeholder="Name (e.g. Rack A)" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              <input type="text" name="shortCode" required placeholder="Code (e.g. RCK-A)" className="w-32 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
            </div>
            <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700">Add Location</button>
          </form>

          <ul className="space-y-3">
            {warehouses.flatMap(wh => wh.locations.map(loc => (
              <li key={loc.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <span className="font-medium text-slate-700">{loc.name}</span>
                <div className="flex gap-2">
                  <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded">{loc.shortCode}</span>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded">{wh.shortCode}</span>
                </div>
              </li>
            )))}
          </ul>
        </div>

      </div>
    </div>
  );
}
