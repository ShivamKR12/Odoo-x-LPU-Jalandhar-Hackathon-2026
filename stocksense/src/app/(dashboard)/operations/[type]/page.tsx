import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";

export default async function OperationListPage({ params }: { params: { type: string } }) {
  const opType = params.type.toUpperCase();
  
  if (!["RECEIPTS", "DELIVERIES", "ADJUSTMENTS", "INTERNAL"].includes(opType)) {
    notFound();
  }

  const dbTypeMap: Record<string, string> = {
    "RECEIPTS": "RECEIPT",
    "DELIVERIES": "DELIVERY",
    "ADJUSTMENTS": "ADJUSTMENT",
    "INTERNAL": "INTERNAL",
  };

  const titleMap: Record<string, string> = {
    "RECEIPTS": "Receipts (Incoming)",
    "DELIVERIES": "Delivery Orders",
    "ADJUSTMENTS": "Stock Adjustments",
    "INTERNAL": "Internal Transfers",
  };

  const moves = await prisma.move.findMany({
    where: { type: dbTypeMap[opType] },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">{titleMap[opType]}</h1>
        <div className="flex gap-4">
          <input type="text" placeholder="Search by Reference or Contact..." className="border border-slate-300 rounded-lg px-4 py-2 min-w-[300px] focus:ring-2 focus:ring-orange-500 focus:outline-none" />
          <Link href={`/operations/${params.type}/new`} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Plus size={20} />
            New
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">List View</div>
          <div className="text-sm font-medium text-orange-500 cursor-pointer">Kanban View</div>
        </div>
        <table className="w-full text-left">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Reference</th>
              <th className="px-6 py-4 font-medium text-slate-500">Contact</th>
              <th className="px-6 py-4 font-medium text-slate-500">Schedule Date</th>
              <th className="px-6 py-4 font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {moves.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No {titleMap[opType].toLowerCase()} found.
                </td>
              </tr>
            ) : (
              moves.map((move) => (
                <tr key={move.id} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    <Link href={`/operations/${params.type}/${move.id}`} className="hover:text-orange-500 hover:underline">{move.reference}</Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{move.contact || "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{move.scheduleDate ? new Date(move.scheduleDate).toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      move.status === "DONE" ? "bg-green-100 text-green-700" :
                      move.status === "WAITING" ? "bg-yellow-100 text-yellow-700" :
                      move.status === "READY" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {move.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
