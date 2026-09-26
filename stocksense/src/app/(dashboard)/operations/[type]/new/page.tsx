import prisma from "@/lib/prisma";
import { createOperation } from "../../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewOperationPage({ params }: { params: { type: string } }) {
  const opType = params.type.toUpperCase();
  if (!["RECEIPTS", "DELIVERIES", "ADJUSTMENTS"].includes(opType)) notFound();

  const titleMap: Record<string, string> = {
    "RECEIPTS": "New Receipt",
    "DELIVERIES": "New Delivery",
    "ADJUSTMENTS": "New Stock Adjustment",
  };

  const locations = await prisma.location.findMany({ include: { warehouse: true } });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/operations/${params.type}`} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">{titleMap[opType]}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form action={createOperation} className="space-y-6">
          <input type="hidden" name="type" value={opType} />
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {opType === "RECEIPTS" ? "Receive From (Vendor)" : opType === "DELIVERIES" ? "Delivery Address (Customer)" : "Reason / Contact"}
              </label>
              <input name="contact" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Date</label>
              <input name="scheduleDate" type="date" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {opType === "DELIVERIES" ? "Source Location" : "Destination Location"}
            </label>
            <select name="locationId" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
              <option value="">Select Location...</option>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.warehouse.name})</option>)}
            </select>
            <p className="text-xs text-slate-500 mt-1">Required to generate the auto-increment Reference ID.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Create Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
