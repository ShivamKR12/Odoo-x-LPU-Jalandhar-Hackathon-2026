import prisma from "@/lib/prisma";
import Link from "next/link";
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
    <div className="flex flex-col h-full bg-odoo-bg">
      {/* Control Panel */}
      <div className="bg-white border-b border-gray-300 px-4 py-2 flex flex-col gap-2 shrink-0">
        <div className="flex justify-between items-center text-[13px]">
          <div className="flex items-center text-odoo-muted gap-2">
            <Link href={`/operations/${params.type}`} className="hover:text-odoo-text hover:underline">Operations</Link>
            <span>/</span>
            <Link href={`/operations/${params.type}`} className="hover:text-odoo-text hover:underline capitalize">{params.type.toLowerCase()}</Link>
            <span>/</span>
            <span className="text-odoo-text font-bold">{move.reference}</span>
          </div>
          <div className="relative">
            <input type="text" placeholder="Search..." className="border border-gray-300 rounded px-2 py-1 text-sm focus:border-odoo-purple focus:outline-none w-64" />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <Link href={`/operations/${params.type}/new`} className="px-3 py-1.5 bg-white border border-gray-300 text-odoo-text font-medium text-[13px] hover:bg-gray-50 rounded-sm">New</Link>
            <button className="px-3 py-1.5 bg-white border border-gray-300 text-odoo-text font-medium text-[13px] hover:bg-gray-50 rounded-sm cursor-not-allowed opacity-50">Save</button>
            <button className="px-3 py-1.5 bg-white border border-gray-300 text-odoo-text font-medium text-[13px] hover:bg-gray-50 rounded-sm cursor-not-allowed opacity-50">Discard</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 o_content">
        <div className="o_form_sheet">
          
          {/* Statusbar */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6 -mx-6 px-6 -mt-6 pt-4 bg-white sticky top-0 z-10">
            <div className="flex gap-2">
              {move.status !== "DONE" && move.status !== "CANCELED" && (
                <form action={validateOperation}>
                  <input type="hidden" name="moveId" value={move.id} />
                  <button type="submit" className="bg-odoo-teal text-white px-3 py-1.5 font-bold text-[13px] uppercase rounded-sm hover:bg-teal-700 transition-colors">
                    Validate
                  </button>
                </form>
              )}
              {move.status !== "DONE" && move.status !== "CANCELED" && (
                <form action={cancelOperation}>
                  <input type="hidden" name="moveId" value={move.id} />
                  <button type="submit" className="bg-white border border-gray-300 text-odoo-text px-3 py-1.5 font-bold text-[13px] uppercase rounded-sm hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </form>
              )}
              <button disabled={move.status !== "DONE"} className={`bg-white border border-gray-300 px-3 py-1.5 font-bold text-[13px] uppercase rounded-sm transition-colors ${move.status === "DONE" ? "text-odoo-text hover:bg-gray-50" : "text-gray-300 cursor-not-allowed"}`}>
                Print
              </button>
            </div>
            
            <div className="o_statusbar_status flex">
              {statuses.map((status, index) => {
                const isActive = move.status === status;
                return (
                  <div key={status} className={`o_arrow_button ${isActive ? "active" : ""}`}>
                    {status}
                  </div>
                );
              })}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-odoo-text mb-8">{move.reference}</h1>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8">
            <div className="flex items-center">
              <label className="w-1/3 o_label">{isDelivery ? "Delivery Address" : "Receive From"}</label>
              <div className="w-2/3 border-b border-gray-300 py-1">{move.contact || "None"}</div>
            </div>
            <div className="flex items-center">
              <label className="w-1/3 o_label">Schedule Date</label>
              <div className="w-2/3 border-b border-gray-300 py-1">{move.scheduleDate ? new Date(move.scheduleDate).toLocaleDateString() : "-"}</div>
            </div>
            <div className="flex items-center">
              <label className="w-1/3 o_label">Operation Type</label>
              <div className="w-2/3 border-b border-gray-300 py-1 font-bold">{move.type}</div>
            </div>
            <div className="flex items-center">
              <label className="w-1/3 o_label">Responsible</label>
              <div className="w-2/3 border-b border-gray-300 py-1 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                  {move.responsible?.name?.[0]?.toUpperCase() || "?"}
                </div>
                {move.responsible?.name || "-"}
              </div>
            </div>
          </div>

          {/* Notebook / Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <button className="px-4 py-2 border-b-2 border-odoo-purple text-odoo-purple font-bold text-[13px]">Operations</button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 border-b-2 border-gray-300 text-odoo-muted font-bold uppercase text-[12px]">Product</th>
                <th className="py-2 border-b-2 border-gray-300 text-odoo-muted font-bold uppercase text-[12px] text-right">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {move.lines.map((line) => {
                let isError = false;
                if (isDelivery) {
                  const locationStock = line.product.stockQuants.find(q => q.locationId === move.sourceLocationId)?.quantity || 0;
                  if (locationStock < line.quantity) isError = true;
                }

                return (
                  <tr key={line.id} className={`hover:bg-gray-50 cursor-pointer ${isError ? "text-odoo-danger" : "text-odoo-text"}`}>
                    <td className="py-2 font-medium">[{line.product.sku}] {line.product.name}</td>
                    <td className="py-2 font-bold text-right">{line.quantity} {line.product.unit}</td>
                  </tr>
                );
              })}
              
              {move.status !== "DONE" && move.status !== "CANCELED" && (
                <tr>
                  <td colSpan={2} className="py-2">
                    <form action={addMoveLine} className="flex gap-4 items-center">
                      <input type="hidden" name="moveId" value={move.id} />
                      <select name="productId" required className="o_input max-w-xs bg-white">
                        <option value="">Add a line...</option>
                        {products.map(p => <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>)}
                      </select>
                      <input type="number" name="quantity" min="1" defaultValue="1" required className="o_input w-24 text-right bg-white" placeholder="Qty" />
                      <button type="submit" className="text-odoo-teal font-bold hover:underline">Add</button>
                    </form>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
