"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save, User as UserIcon, Mail, Phone, MapPin, Camera, Lock } from "lucide-react";
import { useFormValidation } from "@/lib/useFormValidation";
import { FormRules } from "@/lib/validator";
import { UpdateMyProfile } from "@/service/user.service";
import { toast } from "react-hot-toast";
import storage from "@/utils/storage";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const profileRules: FormRules = {
  full_name: { label: "Full Name", rules: ["required", { min: 3 }] },
  email: { label: "Email", rules: ["required", "email"] },
  phone: { label: "Contact Number", rules: ["required", "phone"] },
  address: { label: "Location", rules: [] },
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const form = useFormValidation({
    initialValues: {
      user_id: user?.user_id || "",
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      username: user?.username || "",
      img_ure: user?.img_ure || "",
      role_id: user?.role_id || "",
      role_code: user?.role_code || "",
    },
    rules: profileRules,
  });

  useEffect(() => {
    if (isOpen && user) {
      form.setMultipleValues({
        user_id: user.user_id,
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        username: user.username || "",
        img_ure: user.img_ure || "",
        role_id: user.role_id || "",
        role_code: user.role_code || "",
      });
    }
  }, [isOpen, user]);

  const handleSubmit = async () => {
    if (!form.validateAll()) return;

    setLoading(true);
    try {
      const res = await UpdateMyProfile(form.values as any);
      if (res.success) {
        const updatedUser = { ...user, ...form.values };
        storage.setUser(updatedUser);
        onUpdate(updatedUser);
        toast.success("Profile architecture updated.");
        onClose();
      } else {
        toast.error(res.message || "Update sequence failed.");
      }
    } catch (error: any) {
      toast.error(error.message || "System error.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm py-12 px-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white border-b border-gray-50 px-10 pt-12 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Identity Management</h3>
            <h2 className="text-3xl font-black text-black tracking-tighter uppercase leading-none italic">User Profile</h2>
          </div>
          <button onClick={onClose} className="p-4 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto flex-1 space-y-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-6">
             <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-2xl overflow-hidden italic">
                    {form.values.full_name?.charAt(0) || "A"}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={24} />
                </div>
             </div>
             <div className="text-center">
                <h4 className="text-xl font-black uppercase tracking-tighter italic">{form.values.full_name || "New Identity"}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">{user?.role_name || "Administrative Staff"}</p>
             </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileInput 
                    label="Full Name" 
                    icon={<UserIcon size={14} />} 
                    value={form.values.full_name} 
                    onChange={(val: string) => form.setValue("full_name", val)} 
                    error={form.errors.full_name} 
                />
                <ProfileInput 
                    label="Contact Email" 
                    icon={<Mail size={14} />} 
                    value={form.values.email} 
                    onChange={(val: string) => form.setValue("email", val)} 
                    error={form.errors.email} 
                />
                <ProfileInput 
                    label="Contact Number" 
                    icon={<Phone size={14} />} 
                    value={form.values.phone} 
                    onChange={(val: string) => form.setValue("phone", val)} 
                    error={form.errors.phone} 
                />
                <ProfileInput 
                    label="Master Username" 
                    icon={<Lock size={14} />} 
                    value={form.values.username} 
                    disabled={true} 
                    onChange={() => {}} 
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <MapPin size={12} /> Geographic Location
                </label>
                <textarea
                    value={form.values.address}
                    onChange={(e) => form.setValue("address", e.target.value)}
                    rows={2}
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest leading-loose"
                    placeholder="Enter architectural residence..."
                />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-white border-t border-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-10 py-4 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Discard</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="px-10 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center gap-3"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Commit Updates
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileInput = ({ label, icon, value, onChange, error, disabled = false }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        {icon} {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${error ? 'border-red-100 ring-red-50 text-red-500' : 'text-black'}`}
    />
    {error && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-4">{error}</p>}
  </div>
);
