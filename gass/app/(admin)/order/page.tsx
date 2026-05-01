"use client";
import React, { useState } from "react";
import { Search, X, Loader2, Filter } from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { IInvoice, IInvoiceSearch } from "@/types/order";
import { useToast } from "@/service/useToas";
import {
  searchInvoice,
  updateInvoiceStatus,
  deleteInvoice,
} from "@/service/order.service";
import { OrderTable } from "./components/orderTable";
import storage from "@/utils/storage";

export default function QuanLyDonHangPage() {
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<IInvoice | null>(null);

  const { showSuccess, showError } = useToast();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageIndex(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchParams: IInvoiceSearch = {
    pageIndex,
    pageSize,
    search_content: debouncedSearch,
  };

  const orderQuery = useQuery({
    queryKey: ["orders-admin", searchParams],
    queryFn: () => searchInvoice(searchParams),
    placeholderData: keepPreviousData,
  });

  const orderDataRaw = orderQuery.data?.data || [];
  
  const orderData = orderDataRaw.filter((o: IInvoice) => 
    !debouncedSearch || 
    o.orderId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    o.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    o.phone?.includes(debouncedSearch)
  );

  const totalRecords = orderData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const isLoading = orderQuery.isLoading;

  const getCurrentAdminId = () => {
    const user = storage.getUser();
    return user?.userId || user?.user_id || "admin_system";
  };

  const updateStatusMutation = useMutation({
    mutationFn: updateInvoiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      showSuccess("Cập nhật trạng thái thành công!");
    },
    onError: (error: any) => {
      showError(error.message || "Không thể cập nhật trạng thái.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      showSuccess("Đã xóa đơn hàng.");
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    },
    onError: (error: any) => {
      showError(error.message || "Không thể xóa đơn hàng này.");
    },
  });

  const handleUpdateStatus = (orderId: string, status: number) => {
    updateStatusMutation.mutate({
      orderId,
      status,
      adminId: getCurrentAdminId(),
    });
  };

  const handleDeleteClick = (order: IInvoice) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete.orderId);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(1);
  };

  const isDeleting = deleteMutation.isPending;

  return (
    <div className="max-w-[1600px] mx-auto pb-32 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-5xl font-black text-black tracking-tighter flex items-center gap-4 uppercase leading-none">
            Registry <span className="text-gray-200">/</span> Orders
          </h1>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Managing protocol execution and fulfillment
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 rounded-full px-8 py-3 gap-4 w-[400px] border border-gray-100 focus-within:border-black transition-all shadow-inner">
                <Search size={18} className="text-gray-400" />
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Protocols..."
                    className="w-full bg-transparent outline-none text-[11px] font-black uppercase tracking-[0.2em]"
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="text-gray-300 hover:text-black">
                        <X size={14} />
                    </button>
                )}
            </div>
            <button className="p-4 bg-white border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                <Filter size={20} />
            </button>
        </div>
      </div>

      {/* Table Section */}
      <OrderTable
        data={orderData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)}
        isLoading={isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords}
        totalPages={totalPages}
        onPageChange={setPageIndex}
        onPageSizeChange={handlePageSizeChange}
        onDelete={handleDeleteClick}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Delete Confirmation Modal - B&W Style */}
      {isDeleteModalOpen && orderToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <X size={40} className="text-black" />
            </div>
            <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-4">
              Revoke Protocol?
            </h3>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose mb-10">
              Are you sure you want to delete order
              <span className="text-black mx-2 underline decoration-black/20">
                #{orderToDelete.orderId.slice(0, 16)}
              </span>
              ? This operation is irreversible and will purge the data from the master registry.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setOrderToDelete(null);
                }}
                className="px-8 py-4 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Abort
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-8 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isDeleting && <Loader2 className="animate-spin" size={14} />}
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
