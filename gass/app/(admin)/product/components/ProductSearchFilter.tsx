"use client";

import React, { useState, useEffect } from "react";
import { Search, X, RefreshCw } from "lucide-react";
import { IProductSearch, ICategory } from "@/types/product";

interface ProductSearchFilterProps {
  onSearch: (searchData: IProductSearch) => void;
  categories: ICategory[];
  isLoading?: boolean;
  initialValues?: Partial<IProductSearch>;
}

export const ProductSearchFilter: React.FC<ProductSearchFilterProps> = ({
  onSearch,
  categories,
  isLoading = false,
  initialValues = {}
}) => {
  const [searchData, setSearchData] = useState<IProductSearch>({
    search_content: initialValues.search_content || "",
    categoryId: initialValues.categoryId || "",
    pageIndex: initialValues.pageIndex || 1,
    pageSize: initialValues.pageSize || 10
  });

  useEffect(() => {
    if (initialValues) {
      setSearchData(prev => ({
        ...prev,
        ...initialValues
      }));
    }
  }, [initialValues]);

  const handleInputChange = (field: keyof IProductSearch, value: string | number) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value,
      pageIndex: 1
    }));
  };

  const handleSearch = () => {
    onSearch(searchData);
  };

  const handleReset = () => {
    const resetData: IProductSearch = {
      search_content: "",
      categoryId: "",
      pageIndex: 1,
      pageSize: searchData.pageSize
    };
    setSearchData(resetData);
    onSearch(resetData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                    type="text"
                    value={searchData.search_content}
                    onChange={(e) => handleInputChange('search_content', e.target.value)}
                    placeholder="Search master label..."
                    className="w-full pl-14 pr-12 py-5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 ring-gray-50 text-[11px] font-black uppercase tracking-widest placeholder:text-gray-200"
                />
                {searchData.search_content && (
                    <button onClick={() => handleInputChange('search_content', '')} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200 hover:text-black">
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>

        <div>
            <select
                value={searchData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 ring-gray-50 text-[11px] font-black uppercase tracking-widest appearance-none cursor-pointer"
            >
                <option value="">All Classifications</option>
                {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                    </option>
                ))}
            </select>
        </div>

        <div className="flex gap-4">
            <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10"
            >
                {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                Execute
            </button>
            <button
                onClick={handleReset}
                className="p-5 bg-white border border-gray-100 text-gray-300 hover:text-black rounded-2xl transition-all"
            >
                <X size={20} />
            </button>
        </div>
    </div>
  );
};