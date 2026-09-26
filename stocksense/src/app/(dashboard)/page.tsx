import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, Settings } from "lucide-react";

export default async function Dashboard() {
  const now = new Date();

  // Receipts
  const receipts = await prisma.move.findMany({ where: { type: "RECEIPT", status: { not: "DONE" } } });
  const receiptsLate = receipts.filter(r => r.scheduleDate && r.scheduleDate < now).length;
  const receiptsOperations = receipts.filter(r => r.scheduleDate && r.scheduleDate >= now).length;
  const receiptsToReceive = receipts.length;

  // Deliveries
  const deliveries = await prisma.move.findMany({ where: { type: "DELIVERY", status: { not: "DONE" } } });
  const deliveriesLate = deliveries.filter(d => d.scheduleDate && d.scheduleDate < now).length;
  const deliveriesWaiting = deliveries.filter(d => d.status === "WAITING").length;
  const deliveriesOperations = deliveries.filter(d => d.scheduleDate && d.scheduleDate >= now).length;
  const deliveriesToDeliver = deliveries.length;

  // Products & Stock KPIs
  const products = await prisma.product.findMany({ include: { stockQuants: true } });
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => {
    const totalQty = p.stockQuants.reduce((sum, q) => sum + q.quantity, 0);
    return totalQty <= p.minStock;
  }).length;

  // Internal Transfers
  const internalTransfers = await prisma.move.count({ where: { type: "INTERNAL", status: { not: "DONE" } } });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Inventory Overview</h1>
      </div>

      {/* High Level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-3xl font-bold text-odoo-purple">{totalProducts}</span>
          <span className="text-xs font-bold text-odoo-muted uppercase mt-1">Total Products</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-3xl font-bold text-odoo-danger">{lowStockItems}</span>
          <span className="text-xs font-bold text-odoo-muted uppercase mt-1">Low / Out of Stock</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-3xl font-bold text-odoo-teal">{receiptsToReceive}</span>
          <span className="text-xs font-bold text-odoo-muted uppercase mt-1">Pending Receipts</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-3xl font-bold text-orange-500">{deliveriesToDeliver}</span>
          <span className="text-xs font-bold text-odoo-muted uppercase mt-1">Pending Deliveries</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-3xl font-bold text-blue-500">{internalTransfers}</span>
          <span className="text-xs font-bold text-odoo-muted uppercase mt-1">Pending Transfers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Receipts Kanban Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <Link href="/operations/receipts" className="text-lg font-bold text-slate-800 hover:text-orange-500 transition-colors">Receipts</Link>
            <Settings size={18} className="text-slate-400 cursor-pointer" />
          </div>
          <div className="p-6 flex items-start gap-8">
            <div className="flex-1">
              <Link href="/operations/receipts">
                <div className="bg-orange-500 text-white rounded-lg p-4 text-center hover:bg-orange-600 transition-colors cursor-pointer mb-6">
                  <span className="block text-3xl font-bold">{receiptsToReceive}</span>
                  <span className="block text-sm font-medium opacity-90 uppercase tracking-wide">To Receive</span>
                </div>
              </Link>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{receiptsOperations} operations</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{receiptsOperations}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-500 font-medium">{receiptsLate} Late</span>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">{receiptsLate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries Kanban Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <Link href="/operations/deliveries" className="text-lg font-bold text-slate-800 hover:text-orange-500 transition-colors">Delivery Orders</Link>
            <Settings size={18} className="text-slate-400 cursor-pointer" />
          </div>
          <div className="p-6 flex items-start gap-8">
            <div className="flex-1">
              <Link href="/operations/deliveries">
                <div className="bg-orange-500 text-white rounded-lg p-4 text-center hover:bg-orange-600 transition-colors cursor-pointer mb-6">
                  <span className="block text-3xl font-bold">{deliveriesToDeliver}</span>
                  <span className="block text-sm font-medium opacity-90 uppercase tracking-wide">To Deliver</span>
                </div>
              </Link>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{deliveriesOperations} operations</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{deliveriesOperations}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-yellow-600 font-medium">{deliveriesWaiting} waiting</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">{deliveriesWaiting}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-500 font-medium">{deliveriesLate} Late</span>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">{deliveriesLate}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
