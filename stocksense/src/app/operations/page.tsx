import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, FileWarning } from "lucide-react";

export default async function OperationsPage() {
  const moves = await prisma.move.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const operationTypes = [
    { title: "Receipts (Incoming)", type: "RECEIPT", icon: ArrowDownToLine, color: "text-green-500", href: "/operations/new?type=RECEIPT" },
    { title: "Deliveries (Outgoing)", type: "DELIVERY", icon: ArrowUpFromLine, color: "text-orange-500", href: "/operations/new?type=DELIVERY" },
    { title: "Internal Transfers", type: "INTERNAL", icon: ArrowRightLeft, color: "text-purple-500", href: "/operations/new?type=INTERNAL" },
    { title: "Stock Adjustments", type: "ADJUSTMENT", icon: FileWarning, color: "text-red-500", href: "/operations/new?type=ADJUSTMENT" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Operations</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {operationTypes.map((op, idx) => {
          const Icon = op.icon;
          return (
            <Link key={idx} href={op.href} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-orange-500 transition-colors group flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Icon className={op.color} size={24} />
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-orange-500 transition-colors">{op.title}</h2>
              </div>
              <p className="text-sm text-slate-500">Create a new {op.title.toLowerCase()} document.</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-bold text-slate-800">Recent Operations</h2>
        </div>
        <table className="w-full text-left">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Reference</th>
              <th className="px-6 py-4 font-medium text-slate-500">Type</th>
              <th className="px-6 py-4 font-medium text-slate-500">Status</th>
              <th className="px-6 py-4 font-medium text-slate-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {moves.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No operations found.
                </td>
              </tr>
            ) : (
              moves.map((move) => (
                <tr key={move.id} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-6 py-4 font-medium text-orange-600">{move.reference}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{move.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      move.status === "DONE" ? "bg-green-100 text-green-700" :
                      move.status === "DRAFT" ? "bg-slate-100 text-slate-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {move.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(move.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
