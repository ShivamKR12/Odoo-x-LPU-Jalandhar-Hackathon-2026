import prisma from "@/lib/prisma";
import { createProduct } from "./actions";
import { Plus } from "lucide-react";

export default async function ProductsPage({ searchParams }: { searchParams: { error?: string } }) {
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
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
      </div>
      
      {searchParams.error === "SKU_EXISTS" && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
          A product with this SKU already exists! Please use a unique code.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500">Name</th>
                <th className="px-6 py-4 font-medium text-slate-500">SKU</th>
                <th className="px-6 py-4 font-medium text-slate-500">Category</th>
                <th className="px-6 py-4 font-medium text-slate-500">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No products found. Add one to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = product.stockQuants.reduce((acc, q) => acc + q.quantity, 0);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                      <td className="px-6 py-4 text-slate-500">{product.sku}</td>
                      <td className="px-6 py-4 text-slate-500">{product.category}</td>
                      <td className="px-6 py-4 text-slate-800 font-semibold">{totalStock} {product.unit}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-orange-500" />
            Add New Product
          </h2>
          <form action={createProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <input name="name" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. Steel Rods" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU / Code</label>
              <input name="sku" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. SR-101" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input name="category" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. Raw Material" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Min Stock Alert</label>
                <input name="minStock" type="number" defaultValue="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit of Measure</label>
                <input name="unit" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. kg, pcs" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock (Opt)</label>
                <input name="initialStock" type="number" defaultValue="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Initial Location (Opt)</label>
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
