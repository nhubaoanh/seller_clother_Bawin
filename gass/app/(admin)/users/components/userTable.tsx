"use client";

import React from "react";
import { Edit, Trash2, FileSpreadsheet, ChevronLeft, ChevronRight, Loader2, ShieldCheck, User } from "lucide-react";
import { IUser } from "@/types/user";

interface UserTableProps {
  data: IUser[];
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  data,
  isLoading,
  pageIndex,
  pageSize,
  totalRecords,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  const getRoleBadge = (roleCode: string, roleName: string) => {
    return (
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 ${roleCode === 'ADMIN' ? 'bg-black text-white' : 'text-gray-400'}`}>
        {roleName || roleCode}
      </span>
    );
  };

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
              <th className="p-8">Account Profile</th>
              <th className="p-8">System ID</th>
              <th className="p-8 hidden md:table-cell">Communication</th>
              <th className="p-8 hidden lg:table-cell">Logistics</th>
              <th className="p-8 text-center">Security Level</th>
              <th className="p-8 text-center">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? data.map((user, index) => (
              <tr key={user.user_id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                <td className="p-8 text-center text-gray-300 text-[10px] font-bold">
                  {(pageIndex - 1) * pageSize + index + 1}
                </td>
                <td className="p-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
                            <User size={16} />
                        </div>
                        <div>
                            <div className="font-black text-black text-xs uppercase tracking-tight">{user.full_name || "ANONYMOUS"}</div>
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status: {user.active_flag === 1 ? 'ACTIVE' : 'LOCKED'}</div>
                        </div>
                    </div>
                </td>
                <td className="p-8 font-black text-gray-300 text-[10px] uppercase tracking-tighter italic">
                  {user.username}
                </td>
                <td className="p-8 hidden md:table-cell">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{user.email || "NO_MAIL"}</div>
                    <div className="text-[10px] font-black text-black mt-1 font-mono">{user.phone || "-"}</div>
                </td>
                <td className="p-8 hidden lg:table-cell">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-loose max-w-[200px] line-clamp-1">{user.address || "NOT_PROVIDED"}</p>
                </td>
                <td className="p-8 text-center">
                    {getRoleBadge(user.role_code, user.role_name)}
                </td>
                <td className="p-8 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <button onClick={() => onEdit(user)} className="p-3 bg-white border border-gray-100 text-black hover:bg-black hover:text-white rounded-full transition-all shadow-sm">
                            <Edit size={14} />
                        </button>
                        <button onClick={() => onDelete(user)} className="p-3 bg-white border border-gray-100 text-red-600 hover:bg-black hover:text-white rounded-full transition-all shadow-sm">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </td>
              </tr>
            )) : !isLoading && (
              <tr>
                <td colSpan={7} className="p-32 text-center text-gray-300">
                  <FileSpreadsheet size={64} className="mx-auto mb-6 opacity-5" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">User Registry Empty</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-8 border-t border-gray-50 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Scanning <b className="text-black">{totalRecords}</b> Profile Entries</span>
        <div className="flex items-center gap-6">
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
            <option value={50}>Show 50</option>
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
