import prisma from "@/lib/prisma";
import { createProduct, updateStock } from "./actions";
import { Plus } from "lucide-react";
import StockRow from "./StockRow";

export default async function StockPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      stockQuants: true,
    }
  });

  const locations = await prisma.location.findMany({ include: { warehouse: true } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Stock</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500">Product</th>
                <th className="px-6 py-4 font-medium text-slate-500">Per unit cost</th>
                <th className="px-6 py-4 font-medium text-slate-500">On hand</th>
                <th className="px-6 py-4 font-medium text-slate-500">Free to Use</th>
                <th className="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No stock found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const onHand = product.stockQuants.reduce((acc, q) => acc + q.quantity, 0);
                  const freeToUse = Math.max(0, onHand); // Placeholder logic for reserves
                  
                  return (
                    <StockRow 
                      key={product.id}
                      productId={product.id}
                      name={product.name}
                      cost={product.cost}
                      onHand={onHand}
                      freeToUse={freeToUse}
                      unit={product.unit}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-orange-500" />
            Create Product
          </h2>
          <form action={createProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <input name="name" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU / Code</label>
              <input name="sku" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input name="category" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                <input name="unit" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cost (Rs)</label>
                <input name="cost" type="number" defaultValue="0" step="0.01" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1 mt-2">Initial Stock (Opt)</label>
              <input name="initialStock" type="number" defaultValue="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              
              <label className="block text-sm font-medium text-slate-700 mb-1 mt-2">Initial Location (Opt)</label>
              <select name="locationId" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
                <option value="">None</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.warehouse.name})</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Save Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
