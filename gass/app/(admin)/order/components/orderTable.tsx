"use client";

import React, { useState } from "react";
import {
  Eye,
  Trash2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { IInvoice } from "@/types/order";

interface OrderTableProps {
  data: IInvoice[];
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDelete: (order: IInvoice) => void;
  onUpdateStatus?: (orderId: string, status: number) => void;
}

const STATUS_LIST = [
  { value: 0, label: "Chờ xác nhận", color: "bg-gray-100 text-gray-400 border-gray-200" },
  { value: 1, label: "Đã xác nhận", color: "bg-black text-white border-black" },
  { value: 2, label: "Đang giao", color: "bg-gray-200 text-black border-gray-300" },
  { value: 3, label: "Hoàn thành", color: "bg-black text-white border-black shadow-lg shadow-black/10" },
  { value: 4, label: "Đã hủy", color: "bg-white text-gray-300 border-gray-100 italic" },
];

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

const getStatusBadge = (status: number) => {
  const found = STATUS_LIST.find(s => s.value === status);
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${found?.color || "bg-gray-50 text-gray-400"}`}>
      {found?.label || `Status ${status}`}
    </span>
  );
};

const getPaymentBadge = (method: any) => {
  const label = method ? method.toString().toUpperCase() : "N/A";
  return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 text-gray-400">{label}</span>;
};

const StatusDropdown: React.FC<{
  currentStatus: number;
  onSelect: (status: number) => void;
}> = ({ currentStatus, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-2 py-1 transition-all"
      >
        {getStatusBadge(currentStatus)}
        <ChevronDown size={12} className="text-gray-300" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 min-w-[180px] py-2 text-left animate-in fade-in zoom-in-95 duration-200">
            {STATUS_LIST.map((s) => (
              <button
                key={s.value}
                onClick={() => { onSelect(s.value); setOpen(false); }}
                className={`w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center gap-3 ${
                  currentStatus === s.value ? "bg-gray-50 text-black" : "text-gray-400"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${s.value === 3 ? 'bg-black' : 'bg-gray-200'}`} />
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const OrderTable: React.FC<OrderTableProps> = ({
  data, isLoading, pageIndex, pageSize, totalRecords, totalPages,
  onPageChange, onPageSizeChange, onDelete, onUpdateStatus,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<IInvoice | null>(null);

  return (
    <>
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[500px] flex flex-col">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <Loader2 className="text-black w-10 h-10 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="p-8 w-12 text-center">#</th>
                <th className="p-8">Journal ID</th>
                <th className="p-8">Customer Account</th>
                <th className="p-8 text-center">Contact</th>
                <th className="p-8 text-right">Volume</th>
                <th className="p-8 text-center">Payment</th>
                <th className="p-8 text-center">Protocol Status</th>
                <th className="p-8 text-center">Timestamp</th>
                <th className="p-8 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.length > 0 ? data.map((order, index) => (
                <tr key={order.orderId} className="hover:bg-gray-50/50 transition-all duration-300 group">
                  <td className="p-8 text-center text-gray-300 text-[10px] font-bold">
                    {(pageIndex - 1) * pageSize + index + 1}
                  </td>
                  <td className="p-8">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="font-black text-black text-xs uppercase tracking-tighter hover:underline"
                    >
                      {order.orderId.slice(0, 12)}
                    </button>
                  </td>
                  <td className="p-8">
                      <div className="font-black text-black text-[11px] uppercase tracking-widest">{order.fullName || "GUEST"}</div>
                      <div className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-1">{order.email || "no-email@jmfashion.com"}</div>
                  </td>
                  <td className="p-8 text-center text-[11px] font-bold text-gray-500">{order.phone || "-"}</td>
                  <td className="p-8 text-right font-black text-black text-sm italic">{formatCurrency(order.totalPrice)}</td>
                  <td className="p-8 text-center">{getPaymentBadge(order.paymentMethod || "")}</td>
                  <td className="p-8 text-center">
                    {onUpdateStatus ? (
                      <StatusDropdown
                        currentStatus={order.orderStatus}
                        onSelect={(status) => onUpdateStatus(order.orderId, status)}
                      />
                    ) : (
                      getStatusBadge(order.orderStatus)
                    )}
                  </td>
                  <td className="p-8 text-center text-gray-400 text-[10px] font-bold">{formatDate(order.createdAt)}</td>
                  <td className="p-8 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedOrder(order)} className="p-3 bg-white border border-gray-100 text-black hover:bg-black hover:text-white rounded-full transition-all shadow-sm">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => onDelete(order)} className="p-3 bg-white border border-gray-100 text-red-600 hover:bg-black hover:text-white rounded-full transition-all shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : !isLoading && (
                <tr>
                  <td colSpan={9} className="p-32 text-center text-gray-300">
                    <FileSpreadsheet size={64} className="mx-auto mb-6 opacity-5" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Empty Registry</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white p-8 border-t border-gray-50 flex items-center justify-between mt-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Scanning <b className="text-black">{totalRecords}</b> Protocols
          </span>
          <div className="flex items-center gap-6">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
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

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  );
};

interface OrderDetailModalProps {
  order: IInvoice;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm py-12 px-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white border-b border-gray-50 px-10 pt-12 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Protocol Details</h3>
            <h2 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">#{order.orderId.slice(0, 16)}</h2>
          </div>
          <button onClick={onClose} className="p-4 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all duration-300">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto flex-1 space-y-12">
          {/* Customer & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3">
                    <User size={14} /> Account Intelligence
                </h4>
                <div className="bg-gray-50 rounded-[2rem] p-8 space-y-4">
                    <div className="flex justify-between border-b border-gray-100 pb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Full Name</span>
                        <span className="text-[11px] font-black uppercase text-black">{order.fullName || "GUEST"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Phone Identity</span>
                        <span className="text-[11px] font-black text-black font-mono">{order.phone || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Mail Address</span>
                        <span className="text-[11px] font-black text-black">{order.email || "-"}</span>
                    </div>
                    <div className="pt-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Shipping Logistics</span>
                        <span className="text-[11px] font-bold text-black uppercase leading-relaxed">{order.shippingAddress || "-"}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3">
                    <CreditCard size={14} /> Transaction Summary
                </h4>
                <div className="bg-black text-white rounded-[2rem] p-8 space-y-6 shadow-xl shadow-black/20">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Status</span>
                        {getStatusBadge(order.orderStatus)}
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-6">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Method</span>
                        <span className="text-[11px] font-black uppercase tracking-widest">{order.paymentMethod || "COD"}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-6">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Timestamp</span>
                        <span className="text-[11px] font-black uppercase tracking-widest">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2">Final Volume</span>
                        <span className="text-4xl font-black italic tracking-tighter">{formatCurrency(order.totalPrice)}</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 rounded-[2rem] border-l-4 border-black">
            <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-wide italic">
              "This protocol has been verified by JM Fashion Intelligence. For full itemized breakdown, please consult the inventory nexus."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white border-t border-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-black/20"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
