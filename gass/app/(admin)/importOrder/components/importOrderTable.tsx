"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { IImportOrder, IStockReport } from "@/types/importOrder";

interface ImportOrderTableProps {
  data: IImportOrder[];
  stockReport: IStockReport[];
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const formatCurrency = (amount: number | string) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num === undefined || num === null) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN").format(num || 0) + " VNĐ";
};

const formatDate = (date: Date | string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

export const ImportOrderTable: React.FC<ImportOrderTableProps> = ({
  data, stockReport, isLoading, pageIndex, pageSize, totalRecords, totalPages,
  onPageChange, onPageSizeChange
}) => {
  const [view, setView] = useState<'history' | 'report'>('history');

  return (
    <div className="space-y-10">
      {/* Tabs - B&W Style */}
      <div className="flex gap-8 border-b border-gray-100">
        <button 
          onClick={() => setView('history')}
          className={`pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${view === 'history' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Import History
        </button>
        <button 
          onClick={() => setView('report')}
          className={`pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${view === 'report' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Inventory Balance
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px] flex flex-col">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <Loader2 className="text-black w-10 h-10 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto flex-1">
          {view === 'history' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-6 w-12 text-center">#</th>
                  <th className="p-6">Product Item</th>
                  <th className="p-6 text-center">Variants</th>
                  <th className="p-6 text-center">Qty</th>
                  <th className="p-6 text-right">Unit Cost</th>
                  <th className="p-6 text-right">Total</th>
                  <th className="p-6">Supplier</th>
                  <th className="p-6 text-center">Inbound Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.length > 0 ? data.map((item, index) => (
                  <tr key={item.importId} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-6 text-center text-gray-300 text-[10px] font-bold">{(pageIndex - 1) * pageSize + index + 1}</td>
                    <td className="p-6">
                      <div className="font-black text-black text-sm uppercase tracking-tight">{item.productName}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {item.importId.slice(0, 10)}</div>
                    </td>
                    <td className="p-6 text-center">
                       <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded-full">{item.size} / {item.color}</span>
                    </td>
                    <td className="p-6 text-center font-black text-black">{item.quantity}</td>
                    <td className="p-6 text-right text-xs font-bold text-gray-500">{formatCurrency(item.purchasePrice)}</td>
                    <td className="p-6 text-right font-black text-black">{formatCurrency(item.quantity * item.purchasePrice)}</td>
                    <td className="p-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{item.supplier || "-"}</td>
                    <td className="p-6 text-center text-gray-400 text-[10px] font-bold">{formatDate(item.createdAt)}</td>
                  </tr>
                )) : !isLoading && (
                  <tr>
                    <td colSpan={8} className="p-20 text-center text-gray-300">
                      <FileSpreadsheet size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No Import Data Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-6">Product Item</th>
                  <th className="p-6 text-center">Variants</th>
                  <th className="p-6 text-center">Total In</th>
                  <th className="p-6 text-center">Total Out</th>
                  <th className="p-6 text-center">Available Stock</th>
                  <th className="p-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stockReport.length > 0 ? stockReport.map((item) => (
                  <tr key={item.variantId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 font-black text-black text-sm uppercase tracking-tight">{item.productName}</td>
                    <td className="p-6 text-center">
                       <span className="px-3 py-1 border border-black text-black text-[10px] font-black uppercase rounded-full">{item.size} / {item.color}</span>
                    </td>
                    <td className="p-6 text-center font-bold text-gray-400">{item.totalImported}</td>
                    <td className="p-6 text-center font-bold text-gray-400">{item.totalSold}</td>
                    <td className="p-6 text-center font-black text-black text-xl">{item.currentStock}</td>
                    <td className="p-6 text-center">
                       {item.currentStock <= 5 ? (
                         <span className="px-3 py-1 bg-gray-100 text-black text-[9px] font-black uppercase tracking-widest rounded-full ring-1 ring-black">Low Stock</span>
                       ) : (
                         <span className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full">Optimal</span>
                       )}
                    </td>
                  </tr>
                )) : !isLoading && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-gray-300">
                      <TrendingUp size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No Statistical Data</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination - B&W */}
        {view === 'history' && (
          <div className="bg-white p-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Total <b className="text-black">{totalRecords}</b> Entries
            </span>
            <div className="flex items-center gap-4">
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none"
              >
                <option value={10}>Show 10</option>
                <option value={20}>Show 20</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => onPageChange(Math.max(1, pageIndex - 1))} disabled={pageIndex === 1} className="p-2 border border-gray-100 rounded-full disabled:opacity-30 hover:bg-black hover:text-white transition-all">
                  <ChevronLeft size={16} />
                </button>
                <span className="flex items-center text-[11px] font-black px-4 uppercase">Page {pageIndex}</span>
                <button onClick={() => onPageChange(pageIndex + 1)} disabled={data.length < pageSize} className="p-2 border border-gray-100 rounded-full disabled:opacity-30 hover:bg-black hover:text-white transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
