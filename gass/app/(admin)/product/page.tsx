"use client";
import React, { useState } from "react";
import { Plus, Download, RefreshCw, Layers } from "lucide-react";
import * as XLSX from "xlsx";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { IProduct, IProductSearch } from "@/types/product";
import { ProductTable } from "./components/productTable";
import { ProductSearchFilter } from "./components/ProductSearchFilter";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/service/product.service";
import { searchCategory } from "@/service/category";
import { ProductModal } from "./components/productModal";
import { ConfirmDeleteModal } from "./components/productDelete";
import { toast } from "react-hot-toast";

export default function ProductManagementPage() {
  const queryClient = useQueryClient();

  // States
  const [searchParams, setSearchParams] = useState<IProductSearch>({
    pageIndex: 1,
    pageSize: 10,
    search_content: "",
    categoryId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  // Fetch data
  const productQuery = useQuery({
    queryKey: ["product", searchParams.pageIndex, searchParams.pageSize],
    queryFn: () => getProducts(searchParams.pageIndex, searchParams.pageSize),
    placeholderData: keepPreviousData,
  });

  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => searchCategory({ pageIndex: 1, pageSize: 100 }),
  });

  const categories = categoryQuery.data?.data || [];
  const productData = productQuery.data?.data || [];
  const totalRecords = productQuery.data?.totalItems || 0;
  const totalPages = productQuery.data?.pageCount || 0;
  const isLoading = productQuery.isLoading;

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Thêm sản phẩm thành công!");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (productData: Partial<IProduct>) => updateProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Cập nhật thành công!");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId, "admin"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Xóa thành công!");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể xóa");
    },
  });

  // Handlers
  const handleSearch = (newParams: IProductSearch) => {
    setSearchParams(newParams);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: IProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.productId);
    }
  };

  const handleSaveProduct = (product: Partial<IProduct>) => {
    if (editingProduct) {
      updateMutation.mutate({ ...product, productId: editingProduct.productId });
    } else {
      createMutation.mutate(product);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams(prev => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["product"] });
  };

  const handleExportExcel = () => {
    if (productData.length === 0) {
      toast.error("Không có dữ liệu để xuất!");
      return;
    }

    const exportData = productData.map((product: IProduct, index: number) => ({
      "STT": index + 1,
      "Mã SP": product.productId,
      "Tên sản phẩm": product.productName,
      "Danh mục": product.categoryName,
      "Giá (VNĐ)": product.basePrice,
      "Số lượng": product.totalStock,
      "Đã bán": product.soldCount,
      "Trạng thái": product.activeFlag === 1 ? "Đang bán" : "Ngừng bán",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách sản phẩm");
    XLSX.writeFile(wb, `products-${Date.now()}.xlsx`);
    toast.success("Xuất file thành công!");
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-32 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-5xl font-black text-black tracking-tighter flex items-center gap-4 uppercase leading-none">
            Catalog <span className="text-gray-200">/</span> Products
          </h1>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Managing {totalRecords} inventory units in the system
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-4 bg-white border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
            >
                <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
            </button>

            <button
                onClick={handleExportExcel}
                disabled={productData.length === 0}
                className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
            >
                <Download size={16} />
                Export Data
            </button>

            <button
                onClick={handleAdd}
                className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20"
            >
                <Plus size={16} />
                New Entry
            </button>
        </div>
      </div>

      {/* Search Filter Section */}
      <div className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-8 flex items-center gap-3">
            <Layers size={14} /> Intelligence Filter
        </h3>
        <ProductSearchFilter
            onSearch={handleSearch}
            categories={categories}
            isLoading={isLoading}
            initialValues={searchParams}
        />
      </div>

      {/* Table Section */}
      <ProductTable
        data={productData}
        isLoading={isLoading}
        pageIndex={searchParams.pageIndex}
        pageSize={searchParams.pageSize}
        totalRecords={totalRecords}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        isLoading={createMutation.isPending || updateMutation.isPending}
        categories={categories}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={productToDelete?.productName || ""}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
