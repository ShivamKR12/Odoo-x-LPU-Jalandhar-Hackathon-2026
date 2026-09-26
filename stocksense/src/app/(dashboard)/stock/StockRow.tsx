"use client";

import { useState } from "react";
import { updateStock } from "./actions";
import { Edit2, Check, X } from "lucide-react";

export default function StockRow({ productId, name, cost, onHand, freeToUse, unit }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [newQuantity, setNewQuantity] = useState(onHand);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateStock(productId, newQuantity - onHand);
    setIsEditing(false);
    setLoading(false);
  };

  return (
    <tr className="hover:bg-slate-50 group">
      <td className="px-6 py-4 font-medium text-slate-800">{name}</td>
      <td className="px-6 py-4 text-slate-600">{cost} Rs</td>
      <td className="px-6 py-4 text-slate-800 font-semibold">
        {isEditing ? (
          <input 
            type="number" 
            value={newQuantity} 
            onChange={e => setNewQuantity(Number(e.target.value))}
            className="w-20 border border-orange-500 rounded px-2 py-1 text-sm focus:outline-none"
          />
        ) : (
          `${onHand} ${unit}`
        )}
      </td>
      <td className="px-6 py-4 text-green-600 font-semibold">{freeToUse} {unit}</td>
      <td className="px-6 py-4 text-right">
        {isEditing ? (
          <div className="flex justify-end gap-2">
            <button onClick={handleSave} disabled={loading} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200">
              <Check size={16} />
            </button>
            <button onClick={() => setIsEditing(false)} className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="p-1.5 bg-slate-100 text-slate-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:text-orange-500">
            <Edit2 size={16} />
          </button>
        )}
      </td>
    </tr>
  );
}
