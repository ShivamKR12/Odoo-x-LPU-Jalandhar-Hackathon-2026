import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Printer, Check, X, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { validateOperation, cancelOperation, addMoveLine } from "../../actions";

export default async function OperationDetailPage({ params }: { params: { type: string, id: string } }) {
  const move = await prisma.move.findUnique({
    where: { id: params.id },
    include: {
      responsible: true,
      lines: { include: { product: { include: { stockQuants: true } } } },
      sourceLocation: { include: { warehouse: true } },
      destLocation: { include: { warehouse: true } }
    }
  });

  if (!move) notFound();

  const products = await prisma.product.findMany();
  const isDelivery = move.type === "DELIVERY";
  const statuses = isDelivery ? ["DRAFT", "WAITING", "READY", "DONE"] : ["DRAFT", "READY", "DONE"];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header UI */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Link href={`/operations/${params.type}`} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">{move.reference}</h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/operations/${params.type}/new`} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">New</Link>
          {move.status !== "DONE" && move.status !== "CANCELED" && (
            <form action={validateOperation}>
              <input type="hidden" name="moveId" value={move.id} />
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
                <Check size={18} /> Validate
              </button>
            </form>
          )}
          {move.status !== "DONE" && move.status !== "CANCELED" && (
            <form action={cancelOperation}>
              <input type="hidden" name="moveId" value={move.id} />
              <button type="submit" className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 flex items-center gap-2">
                <X size={18} /> Cancel
              </button>
            </form>
          )}
          <button disabled={move.status !== "DONE"} className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 ${move.status === "DONE" ? "border-slate-300 text-slate-700 hover:bg-slate-50" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}>
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Status Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-end">
          <div className="flex items-center">
            {statuses.map((status, index) => {
              const isActive = move.status === status;
              const isPast = statuses.indexOf(move.status) > index;
              return (
                <div key={status} className="flex items-center">
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${isActive ? 'bg-orange-500 text-white shadow-md' : isPast ? 'text-orange-500' : 'text-slate-400'}`}>
                    {status}
                  </div>
                  {index < statuses.length - 1 && <div className={`w-8 h-[2px] mx-2 ${isPast ? 'bg-orange-500' : 'bg-slate-300'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-8 border-b border-slate-100">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                {isDelivery ? "Delivery Address" : "Receive From"}
              </label>
              <div className="font-medium text-slate-800 text-lg">{move.contact || "Not specified"}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Operation Type</label>
              <div className="font-medium text-slate-800">{move.type}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Schedule Date</label>
              <div className="font-medium text-slate-800">{move.scheduleDate ? new Date(move.scheduleDate).toLocaleDateString() : "-"}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Responsible</label>
              <div className="font-medium text-slate-800">{move.responsible?.name || "-"}</div>
            </div>
          </div>
        </div>

        {/* Products Tab */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Products</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 font-medium text-slate-500">Product</th>
                <th className="py-3 font-medium text-slate-500 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {move.lines.map((line) => {
                // Check stock alert logic for deliveries
                let rowClass = "text-slate-800";
                if (isDelivery) {
                  const locationStock = line.product.stockQuants.find(q => q.locationId === move.sourceLocationId)?.quantity || 0;
                  if (locationStock < line.quantity) {
                    rowClass = "text-red-600 bg-red-50/50"; // Red row if outgoing product not in stock
                  }
                }

                return (
                  <tr key={line.id} className={rowClass}>
                    <td className="py-3 font-medium">[{line.product.sku}] {line.product.name}</td>
                    <td className="py-3 font-medium text-right">{line.quantity} {line.product.unit}</td>
                  </tr>
                );
              })}
              {move.lines.length === 0 && (
                <tr><td colSpan={2} className="py-4 text-center text-slate-500 italic">No products added.</td></tr>
              )}
            </tbody>
          </table>

          {move.status !== "DONE" && move.status !== "CANCELED" && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <form action={addMoveLine} className="flex gap-4 items-end">
                <input type="hidden" name="moveId" value={move.id} />
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Add Product</label>
                  <select name="productId" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
                    <option value="">Select...</option>
                    {products.map(p => <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>)}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Qty</label>
                  <input type="number" name="quantity" min="1" defaultValue="1" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
                <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 h-10 flex items-center gap-2">
                  <Plus size={16} /> Add Line
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
