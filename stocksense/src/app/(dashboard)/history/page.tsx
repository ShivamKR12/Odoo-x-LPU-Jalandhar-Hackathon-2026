import prisma from "@/lib/prisma";

export default async function HistoryPage() {
  const moveLines = await prisma.moveLine.findMany({
    orderBy: { move: { createdAt: "desc" } },
    include: {
      move: {
        include: {
          sourceLocation: { include: { warehouse: true } },
          destLocation: { include: { warehouse: true } },
        }
      },
      product: true,
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Move History</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Date</th>
              <th className="px-6 py-4 font-medium text-slate-500">Reference</th>
              <th className="px-6 py-4 font-medium text-slate-500">Product</th>
              <th className="px-6 py-4 font-medium text-slate-500">From</th>
              <th className="px-6 py-4 font-medium text-slate-500">To</th>
              <th className="px-6 py-4 font-medium text-slate-500">Contact/Vendor</th>
              <th className="px-6 py-4 font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {moveLines.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No stock movements recorded yet.
                </td>
              </tr>
            ) : (
              moveLines.map((line) => {
                const isOut = line.move.type === "DELIVERY" || (line.move.type === "ADJUSTMENT" && !line.move.destLocationId);
                const colorClass = isOut ? "text-red-500" : "text-green-500";
                
                return (
                  <tr key={line.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(line.move.createdAt).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 font-medium ${colorClass}`}>{line.move.reference}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{line.product.name} ({line.quantity} {line.product.unit})</td>
                    <td className="px-6 py-4 text-slate-600">
                      {line.move.sourceLocation ? `${line.move.sourceLocation.name} (${line.move.sourceLocation.warehouse.shortCode})` : "Vendor / External"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {line.move.destLocation ? `${line.move.destLocation.name} (${line.move.destLocation.warehouse.shortCode})` : "Customer / External"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{line.move.contact || "-"}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{line.move.status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
