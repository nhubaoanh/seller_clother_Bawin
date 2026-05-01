"use client";
import React, { useState, useEffect } from "react";
import { Search, Plus, X, Loader2, Package, CheckCircle2, ChevronRight } from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { IImportOrder, IStockReport } from "@/types/importOrder";
import { ImportOrderTable } from "./components/importOrderTable";
import { 
  searchImportOrder, 
  createImportOrder,
  getStockReport
} from "@/service/importOrder.service";
import { getProducts, getProductVariants } from "@/service/product.service";
import storage from "@/utils/storage";

export default function QuanLyNhapHang() {
  const queryClient = useQueryClient();

  // --- STATE ---
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- DEBOUNCE SEARCH ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageIndex(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- FETCHING DATA ---
  const searchParams = {
    pageIndex,
    pageSize,
    q: debouncedSearch,
  };

  const importHistoryQuery = useQuery({
    queryKey: ["importHistory", searchParams],
    queryFn: () => searchImportOrder(searchParams),
    placeholderData: keepPreviousData,
  });

  const stockReportQuery = useQuery({
    queryKey: ["stockReport"],
    queryFn: () => getStockReport(),
  });

  const importData: IImportOrder[] = importHistoryQuery.data?.data || [];
  const stockReport: IStockReport[] = stockReportQuery.data?.data || [];
  const totalRecords = importHistoryQuery.data?.totalItems || 0;
  const totalPages = importHistoryQuery.data?.pageCount || 0;
  const isLoading = importHistoryQuery.isLoading || stockReportQuery.isLoading;

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 pb-24 bg-white min-h-screen text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Inventory Flow
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Quản trị Nhập - Xuất - Tồn kho sản phẩm
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 transition-all text-xs font-black uppercase tracking-widest"
        >
          <Plus size={18} />
          Create New Import
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-6 py-3 w-full md:w-1/2 focus-within:ring-2 ring-black/5 transition-all">
          <Search size={18} className="text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm trong kho..."
            className="w-full pl-4 outline-none bg-transparent text-sm font-medium"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")}>
              <X size={14} className="text-gray-400 hover:text-black" />
            </button>
          )}
        </div>
      </div>

      {/* Table & Report */}
      <ImportOrderTable
        data={importData}
        stockReport={stockReport}
        isLoading={isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords}
        totalPages={totalPages}
        onPageChange={setPageIndex}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Import Modal */}
      {isModalOpen && (
        <ImportStockModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["importHistory"] });
            queryClient.invalidateQueries({ queryKey: ["stockReport"] });
          }}
        />
      )}
    </div>
  );
}

/* ================================
   MODAL NHẬP HÀNG MỚI (B&W STYLE)
================================ */
function ImportStockModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [searchProd, setSearchProd] = useState("");

  const [formData, setFormData] = useState({
    productId: "",
    variantId: "",
    quantity: 0,
    purchasePrice: 0,
    supplier: "",
    notes: ""
  });

  useEffect(() => {
    const fetchProds = async () => {
      const res = await getProducts(1, 100);
      if (res.success) setProducts(res.data);
    };
    fetchProds();
  }, []);

  useEffect(() => {
    if (formData.productId) {
      const fetchVars = async () => {
        const res = await getProductVariants(formData.productId);
        if (res.success) setVariants(res.data);
      };
      fetchVars();
    }
  }, [formData.productId]);

  const mutation = useMutation({
    mutationFn: createImportOrder,
    onSuccess: () => {
      toast.success("Hàng đã được nhập kho!");
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error("Lỗi khi nhập kho!");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = storage.getUser();
    mutation.mutate({
      ...formData,
      adminId: user?.user_id || "admin"
    });
  };

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchProd.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm py-12 px-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-white px-8 pt-12 pb-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Inventory Input</h3>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Step {step}/2: {step === 1 ? 'Product Selection' : 'Stock Details'}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all duration-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-6">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" size={18} />
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm font-medium"
                    placeholder="Search for a product..."
                    value={searchProd}
                    onChange={(e) => setSearchProd(e.target.value)}
                  />
               </div>
               <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredProducts.map(p => (
                    <button
                      key={p.productId}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, productId: p.productId });
                        setStep(2);
                      }}
                      className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 transition-all hover:bg-black"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 group-hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-white">
                           <Package size={20} />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-gray-900 group-hover:text-white transition-colors">{p.productName}</div>
                          <div className="text-[10px] font-bold text-gray-400 group-hover:text-white/50 uppercase tracking-widest">ID: {p.productId.slice(0, 8)}</div>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-200 group-hover:text-white" size={20} />
                    </button>
                  ))}
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Variant selection (Size/Color)</label>
                  <select 
                    required
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm font-bold"
                    value={formData.variantId}
                    onChange={(e) => setFormData({ ...formData, variantId: e.target.value })}
                  >
                    <option value="">-- Choose Variant --</option>
                    {variants.map(v => (
                      <option key={v.variantId} value={v.variantId}>
                        {v.size} / {v.color} (Current: {v.stock})
                      </option>
                    ))}
                  </select>
               </div>

               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2 italic">1. Inbound Quantity (Số lượng)</label>
                  <input 
                    type="number" required min="1"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 ring-black font-black text-xl"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  />
               </div>

               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2 italic">2. Unit Cost (Giá nhập mỗi SP)</label>
                  <input 
                    type="number" required min="0"
                    placeholder="Ví dụ: 50000"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 ring-black font-black text-xl text-black placeholder:text-gray-300"
                    value={formData.purchasePrice || ''}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                  />
               </div>

               <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Supplier</label>
                  <input 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-black/5 text-sm font-medium"
                    placeholder="Enter supplier name..."
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
               </div>

               <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Internal Notes</label>
                  <textarea 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-black/5 min-h-[100px] text-sm font-medium"
                    placeholder="Any additional information..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
               </div>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-100">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black">Back</button>
            )}
            <div className="flex gap-4 ml-auto">
              <button type="button" onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Cancel</button>
              {step === 2 && (
                <button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="px-10 py-4 bg-black text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-gray-800 shadow-xl transition-all disabled:opacity-50"
                >
                  {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  Confirm Stock Entry
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
