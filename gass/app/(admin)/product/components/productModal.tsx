"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save, AlertCircle, CheckCircle, Trash2, Box, Info, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { FormRules, validateForm, validateField } from "@/lib/validator";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  product?: any | null;
  isLoading?: boolean;
  categories?: { categoryId: string; categoryName: string }[];
}

const productRules: FormRules = {
  categoryId: { label: "Classification", rules: ["required"] },
  productName: { label: "Label Name", rules: ["required", { min: 3 }, { max: 200 }] },
  basePrice: { label: "Valuation", rules: ["required", "number", "positive", { minVal: 1000 }] },
  description: { label: "Detailed Specification", rules: [{ max: 1000 }] },
  thumbnail: { label: "Primary Media", rules: [] },
  stock: { label: "Initial Inventory", rules: ["required", "number", { minVal: 0 }] }
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  isLoading = false,
  categories = [],
}) => {
  const [formData, setFormData] = useState<any>({ images: [] });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialData = {
        productId: product?.productId || "",
        categoryId: product?.categoryId || "",
        productName: product?.productName || "",
        basePrice: product?.basePrice !== undefined ? String(product.basePrice) : "",
        description: product?.description || "",
        activeFlag: product?.activeFlag !== undefined ? product.activeFlag === 1 : true,
        thumbnail: product?.thumbnail || "",
        images: product?.images || [],
        stock: product?.totalStock !== undefined ? String(product.totalStock) : "100",
      };
      setFormData(initialData);
      setErrors({});
      setTouched({});
      const { isValid } = validateForm(initialData, productRules);
      setIsFormValid(isValid);
    }
  }, [isOpen, product]);

  useEffect(() => {
    const { isValid } = validateForm(formData, productRules);
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (name === "basePrice") newValue = value.replace(/[^0-9.]/g, "");
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    setFormData((prev: any) => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      const error = validateField(name, newValue, productRules, { ...formData, [name]: newValue });
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value, productRules, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (images: string | string[]) => {
    const allImages = Array.isArray(images) ? images : images ? [images] : [];
    const thumbnail = allImages[0] || "";
    setFormData((prev: any) => ({ ...prev, thumbnail, images: allImages }));
    setErrors((prev) => ({ ...prev, thumbnail: null }));
  };

  const handleSubmit = () => {
    const allTouched = Object.keys(productRules).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    const { isValid, errors: formErrors } = validateForm(formData, productRules);
    setErrors(formErrors);
    if (!isValid) return;
    const submitData = {
      productId: formData.productId || undefined,
      categoryId: formData.categoryId,
      productName: formData.productName.trim(),
      basePrice: Number(formData.basePrice),
      description: formData.description?.trim() || "",
      activeFlag: formData.activeFlag ? 1 : 0,
      thumbnail: formData.thumbnail,
      images: formData.images || [],
      stock: Number(formData.stock || 0),
    };
    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center py-12 px-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-gray-50">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-1">Inventory Registry</h3>
            <h2 className="text-2xl font-black text-black tracking-tighter uppercase leading-none">
              {product ? "Edit Entry" : "New Manifest"}
            </h2>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto flex-1 space-y-12">
            <div className="flex flex-col gap-12">
                {/* Media Section - Top */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3 italic">
                        <ImageIcon size={14} /> Media Assets
                    </h4>
                    <div className="p-6 border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                        <ImageUpload
                            value={formData.images}
                            onChange={handleImageChange}
                            multiple={true}
                            maxFiles={10}
                            placeholder="Drop Assets Here"
                        />
                    </div>
                </div>

                {/* Form Section - Bottom */}
                <div className="space-y-10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3 italic">
                        <Info size={14} /> Specification Data
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormInput label="Label Name" name="productName" value={formData.productName} onChange={handleChange} onBlur={handleBlur} error={touched.productName ? errors.productName : null} placeholder="e.g. Minimalist Silk Dress" />
                        <FormSelect label="Classification" name="categoryId" value={formData.categoryId} onChange={handleChange} onBlur={handleBlur} options={categories} optionLabel="categoryName" optionValue="categoryId" error={touched.categoryId ? errors.categoryId : null} />
                        <FormInput label="Valuation (VNĐ)" name="basePrice" value={formData.basePrice} onChange={handleChange} onBlur={handleBlur} error={touched.basePrice ? errors.basePrice : null} placeholder="1.000.000" />
                        {!product && <FormInput label="Initial Inventory" name="stock" value={formData.stock} onChange={handleChange} onBlur={handleBlur} error={touched.stock ? errors.stock : null} placeholder="100" type="number" />}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Detailed Specification</label>
                        <textarea 
                            name="description" 
                            value={formData.description || ""} 
                            onChange={handleChange} 
                            onBlur={handleBlur}
                            rows={3} 
                            placeholder="Enter the essence of this product..."
                            className="w-full p-8 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-black/5 text-[11px] font-bold uppercase tracking-widest leading-loose"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <input type="checkbox" name="activeFlag" checked={formData.activeFlag} onChange={handleChange} className="w-6 h-6 rounded-full border-gray-100 text-black focus:ring-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">Active in Global Registry</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-white border-t border-gray-50 flex justify-between items-center">
            <div className={`flex items-center gap-3 ${isFormValid ? 'text-black' : 'text-gray-300'}`}>
                {isFormValid ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{isFormValid ? 'Ready for deployment' : 'Awaiting data completion'}</span>
            </div>
            <div className="flex gap-4">
                <button onClick={onClose} className="px-10 py-4 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Discard</button>
                <button onClick={handleSubmit} disabled={isLoading} className="px-10 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center gap-3">
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Commit Entry
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, name, value, onChange, onBlur, error, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
    <input 
      type={type} name={name} value={value || ""} onChange={onChange} onBlur={onBlur} placeholder={placeholder}
      className={`w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${error ? 'border-red-100 ring-red-50 text-red-500' : 'text-black'}`} 
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, onBlur, options, optionLabel, optionValue, error }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
    <select 
      name={name} value={value || ""} onChange={onChange} onBlur={onBlur}
      className={`w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all appearance-none cursor-pointer ${error ? 'border-red-100 ring-red-50 text-red-500' : 'text-black'}`}
    >
      <option value="">Choose Class</option>
      {options.map((item: any) => (
        <option key={item[optionValue]} value={item[optionValue]}>{item[optionLabel]}</option>
      ))}
    </select>
  </div>
);