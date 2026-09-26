import prisma from "@/lib/prisma";
import { createMove } from "./actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewOperationPage({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams.type || "RECEIPT"; // RECEIPT, DELIVERY, INTERNAL, ADJUSTMENT
  
  const products = await prisma.product.findMany();
  const locations = await prisma.location.findMany({ include: { warehouse: true } });

  const titleMap: Record<string, string> = {
    RECEIPT: "New Receipt (Incoming)",
    DELIVERY: "New Delivery (Outgoing)",
    INTERNAL: "Internal Transfer",
    ADJUSTMENT: "Stock Adjustment"
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/operations" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">{titleMap[type]}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form action={createMove} className="space-y-6">
          <input type="hidden" name="type" value={type} />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <select name="productId" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
              <option value="">Select a product...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(type === "DELIVERY" || type === "INTERNAL" || type === "ADJUSTMENT") && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source Location</label>
                <select name="sourceLocationId" required={type !== "ADJUSTMENT"} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
                  <option value="">Select source...</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.warehouse.name})</option>)}
                </select>
              </div>
            )}

            {(type === "RECEIPT" || type === "INTERNAL" || type === "ADJUSTMENT") && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destination Location</label>
                <select name="destLocationId" required={type !== "ADJUSTMENT"} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
                  <option value="">Select destination...</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.warehouse.name})</option>)}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
            <input type="number" name="quantity" required min="1" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. 10" />
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Validate Operation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
