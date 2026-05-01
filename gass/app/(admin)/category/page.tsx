"use client";
import React, { useState } from "react";
import { Search, Plus, X, Loader2, Layers } from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CategoryTable } from "./components/categoryTable";
import { CategoryModal } from "./components/categoryModal";
import { ICategory, ICategorySearch } from "@/types/category";
import { 
  searchCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "@/service/category";

export default function CategoryManagementPage() {
  const queryClient = useQueryClient();

  // --- STATE FOR API QUERY PARAMETERS ---
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  // --- DEBOUNCE SEARCH ---
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageIndex(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchParams: ICategorySearch = {
    pageIndex,
    pageSize,
    search_content: debouncedSearch,
  };

  const categoriesQuery = useQuery({
    queryKey: ["category", searchParams],
    queryFn: () => searchCategory(searchParams),
    placeholderData: keepPreviousData,
  });

  const categoryData = categoriesQuery.data?.data || [];
  const totalRecords = categoriesQuery.data?.totalItems || 0;
  const totalPages = categoriesQuery.data?.pageCount || 0;
  const isLoading = categoriesQuery.isLoading;

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      toast.success("Classification initialized.");
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      toast.success("Classification intelligence updated.");
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      toast.success("Taxonomy entry purged.");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category: ICategory) => {
    if (confirm(`Are you sure you want to delete category: ${category.category_name}?`)) {
        deleteMutation.mutate(category.category_id);
    }
  };

  const handleSave = (data: Partial<ICategory>) => {
    if (editingCategory) {
      updateMutation.mutate({ ...data, categoryId: editingCategory.category_id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(1);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-32 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-5xl font-black text-black tracking-tighter flex items-center gap-4 uppercase leading-none">
            Catalog <span className="text-gray-200">/</span> Class
          </h1>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Managing product classifications and taxonomy
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 rounded-full px-8 py-3 gap-4 w-[400px] border border-gray-100 focus-within:border-black transition-all shadow-inner">
                <Search size={18} className="text-gray-400" />
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Taxonomy..."
                    className="w-full bg-transparent outline-none text-[11px] font-black uppercase tracking-[0.2em]"
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="text-gray-300 hover:text-black">
                        <X size={14} />
                    </button>
                )}
            </div>
            <button
                onClick={handleAdd}
                className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20"
            >
                <Plus size={16} />
                New Class
            </button>
        </div>
      </div>

      {/* Table Section */}
      <CategoryTable
        data={categoryData}
        isLoading={isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords}
        totalPages={totalPages}
        onPageChange={setPageIndex}
        onPageSizeChange={handlePageSizeChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={editingCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

