"use client";

import React from "react";
import {
  Edit,
  Trash2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { ICategory } from "@/types/category";

interface CategoryTableProps {
  data: ICategory[];
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  data = [],
  isLoading = false,
  pageIndex = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages = 1,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[500px] flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <Loader2 className="text-black w-10 h-10 animate-spin" />
        </div>
      )}

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-8 w-12 text-center">#</th>
              <th className="p-8">Classification Code</th>
              <th className="p-8">Label Name</th>
              <th className="p-8">Specification</th>
              <th className="p-8 text-center">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-all duration-300 group">
                <td className="p-8 text-center text-gray-300 text-[10px] font-bold">
                  {(pageIndex - 1) * pageSize + index + 1}
                </td>
                <td className="p-8 font-black text-gray-300 text-[10px] uppercase tracking-tighter italic">
                  {item.category_code || "GENERIC"}
                </td>
                <td className="p-8">
                  <div className="font-black text-black text-xs uppercase tracking-tight group-hover:underline cursor-pointer" onClick={() => onEdit(item)}>{item.category_name}</div>
                </td>
                <td className="p-8">
                  <p className="text-[11px] font-bold text-gray-400 uppercase leading-loose max-w-md line-clamp-2">{item.description || "NO_DESCRIPTION"}</p>
                </td>
                <td className="p-8 text-center">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                    <button onClick={() => onEdit(item)} className="p-3 bg-white border border-gray-100 text-black hover:bg-black hover:text-white rounded-full transition-all shadow-sm">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => onDelete(item)} className="p-3 bg-white border border-gray-100 text-red-600 hover:bg-black hover:text-white rounded-full transition-all shadow-sm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : !isLoading && (
              <tr>
                <td colSpan={5} className="p-32 text-center text-gray-300">
                  <FileSpreadsheet size={64} className="mx-auto mb-6 opacity-5" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Registry Empty</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-8 border-t border-gray-50 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Scanning <b className="text-black">{totalRecords}</b> Master Classes</span>
        <div className="flex items-center gap-6">
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
          </select>
          <div className="flex items-center gap-3">
            <button onClick={() => onPageChange(Math.max(1, pageIndex - 1))} disabled={pageIndex === 1} className="p-3 border border-gray-100 rounded-full disabled:opacity-20 hover:bg-black hover:text-white transition-all shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-black uppercase px-4 tracking-widest">{pageIndex} / {totalPages || 1}</span>
            <button onClick={() => onPageChange(pageIndex + 1)} disabled={data.length < pageSize} className="p-3 border border-gray-100 rounded-full disabled:opacity-20 hover:bg-black hover:text-white transition-all shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
