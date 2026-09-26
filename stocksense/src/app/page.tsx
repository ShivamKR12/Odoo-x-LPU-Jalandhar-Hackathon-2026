import prisma from "@/lib/prisma";
import { PackageSearch, TrendingDown, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from "lucide-react";

export default async function Dashboard() {
  // Fetch real data KPIs using Prisma
  const totalProducts = await prisma.product.count();
  
  // Products where any associated stock quant is <= minStock (simplified for now)
  const lowStockItems = await prisma.product.count({
    where: {
      stockQuants: {
        some: { quantity: { lte: 10 } } // Mock threshold for low stock
      }
    }
  });

  const pendingReceipts = await prisma.move.count({
    where: { type: "RECEIPT", status: { in: ["DRAFT", "WAITING", "READY"] } }
  });

  const pendingDeliveries = await prisma.move.count({
    where: { type: "DELIVERY", status: { in: ["DRAFT", "WAITING", "READY"] } }
  });

  const pendingTransfers = await prisma.move.count({
    where: { type: "INTERNAL", status: { in: ["DRAFT", "WAITING", "READY"] } }
  });

  const kpis = [
    { title: "Total Products", value: totalProducts, icon: PackageSearch, color: "text-blue-500", bg: "bg-blue-100" },
    { title: "Low/Out of Stock", value: lowStockItems, icon: TrendingDown, color: "text-red-500", bg: "bg-red-100" },
    { title: "Pending Receipts", value: pendingReceipts, icon: ArrowDownToLine, color: "text-green-500", bg: "bg-green-100" },
    { title: "Pending Deliveries", value: pendingDeliveries, icon: ArrowUpFromLine, color: "text-orange-500", bg: "bg-orange-100" },
    { title: "Scheduled Transfers", value: pendingTransfers, icon: ArrowRightLeft, color: "text-purple-500", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Inventory Dashboard</h1>
        <div className="flex gap-2">
          {/* Filters Placeholder */}
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option>All Warehouses</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option>All Statuses</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${kpi.bg}`}>
                <Icon className={kpi.color} size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{kpi.title}</p>
                <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Snapshot / Recent Activity can go here */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Operations</h2>
        <div className="text-center text-slate-500 py-8">
          No recent activity found.
        </div>
      </div>
    </div>
  );
}
