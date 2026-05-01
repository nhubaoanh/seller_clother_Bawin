"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { ICategory } from "@/types/category";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Partial<ICategory>) => void;
  category?: ICategory | null;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<ICategory>>({
    category_name: "",
    description: "",
    active_flag: 1,
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          category_id: category.category_id,
          category_name: category.category_name || "",
          description: category.description || "",
          active_flag: category.active_flag ?? 1,
        });
      } else {
        setFormData({
          category_name: "",
          description: "",
          active_flag: 1,
        });
      }
    }
  }, [isOpen, category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_name?.trim()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm py-12 px-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white border-b border-gray-50 px-10 pt-12 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Taxonomy Protocol</h3>
            <h2 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">
                {category ? "Edit Class" : "New Classification"}
            </h2>
          </div>
          <button onClick={onClose} className="p-4 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10">
          <div className="space-y-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Classification Label</label>
                <input
                    name="category_name"
                    value={formData.category_name || ""}
                    onChange={handleChange}
                    placeholder="e.g. Evening Wear"
                    required
                    className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all text-black"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Logic / Description</label>
                <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Define the scope of this classification..."
                    rows={4}
                    className="w-full p-8 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-black/5 text-[11px] font-bold uppercase tracking-widest leading-loose"
                />
            </div>

            <div className="flex items-center gap-4">
                <input 
                    type="checkbox" 
                    checked={formData.active_flag === 1} 
                    onChange={(e) => setFormData(prev => ({ ...prev, active_flag: e.target.checked ? 1 : 0 }))}
                    className="w-6 h-6 rounded-full border-gray-100 text-black focus:ring-black"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-black">Active in Taxonomy Registry</span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-10 bg-white border-t border-gray-50 flex justify-between items-center">
            <div className={`flex items-center gap-3 ${formData.category_name?.trim() ? 'text-black' : 'text-gray-300'}`}>
                {formData.category_name?.trim() ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{formData.category_name?.trim() ? 'Logic Verified' : 'Label Required'}</span>
            </div>
            <div className="flex gap-4">
                <button type="button" onClick={onClose} className="px-10 py-4 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Abort</button>
                <button type="submit" onClick={handleSubmit} disabled={isLoading || !formData.category_name?.trim()} className="px-10 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center gap-3 disabled:opacity-50">
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Commit Class
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
