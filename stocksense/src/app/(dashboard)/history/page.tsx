import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

export default async function HistoryPage() {
  const moveLines = await prisma.moveLine.findMany({
    orderBy: { move: { createdAt: "desc" } },
    include: {
      move: {
        include: {
          sourceLocation: true,
          destLocation: true,
        }
      },
      product: true,
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Move History (Stock Ledger)</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Date</th>
              <th className="px-6 py-4 font-medium text-slate-500">Reference</th>
              <th className="px-6 py-4 font-medium text-slate-500">Product</th>
              <th className="px-6 py-4 font-medium text-slate-500">From &rarr; To</th>
              <th className="px-6 py-4 font-medium text-slate-500">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {moveLines.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No stock movements recorded yet.
                </td>
              </tr>
            ) : (
              moveLines.map((line) => (
                <tr key={line.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500">{new Date(line.move.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-orange-600">{line.move.reference}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{line.product.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <span className="truncate max-w-[120px]">{line.move.sourceLocation?.name || "Vendor / External"}</span>
                      <ArrowRight size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[120px]">{line.move.destLocation?.name || "Customer / External"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{line.quantity} {line.product.unit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
