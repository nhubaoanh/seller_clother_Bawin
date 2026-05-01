"use client";

import React, { useEffect, useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { IUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { searchRole } from "@/service/role.service";
import { useToast } from "@/service/useToas";
import { checkUsernameExist } from "@/service/user.service";
import { FormRules, validateForm, validateField } from "@/lib/validator";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<IUser>) => void;
  initialData?: IUser | null;
  isLoading: boolean;
}

// Định nghĩa rules validate - khớp với field names mới
const userRules: FormRules = {
  full_name: { label: "Họ và tên", rules: ["required", "fullName"] },
  username: { label: "Tên đăng nhập", rules: ["required", "email"] },
  password_hash: { label: "Mật khẩu", rules: ["password"] }, // Không required khi edit
  email: { label: "Email", rules: ["email"] },
  phone: { label: "Số điện thoại", rules: ["phone"] },
  role_id: { label: "Vai trò", rules: ["required"] },
};

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const { showSuccess, showError } = useToast();
  const isEditMode = !!initialData;

  // Form state
  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Username check state
  const [checking, setChecking] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Load roles
  const { data: roleData } = useQuery({
    queryKey: ["role"],
    queryFn: searchRole,
  });

  const roleList = Array.isArray(roleData) ? roleData : roleData?.data ?? [];

  // Reset form khi modal mở
  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: initialData?.full_name || "",
        username: initialData?.username || "",
        password_hash: "", // Không hiển thị password cũ
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        address: initialData?.address || "",
        gender: initialData?.gender || "",
        role_id: initialData?.role_id || "",
        create_user_id: initialData?.create_user_id
      });
      setErrors({});
      setTouched({});
      setUsernameError(null);
    }
  }, [isOpen, initialData]);

  // Handle change + chặn nhập số vào họ tên
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === "full_name") {
      newValue = value.replace(/\d/g, "");
    }
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (touched[name]) {
      const error = validateField(name, newValue, userRules, formData);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value, userRules, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Check username exist
  const handleCheckUsername = async (value: string) => {
    // Không check nếu rỗng hoặc không phải email hợp lệ
    if (!value || !value.trim()) {
      setUsernameError(null);
      return;
    }
    
    // Validate email format trước khi gọi API
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return; // Không gọi API nếu chưa phải email hợp lệ
    }
    
    // Nếu đang edit và username không đổi thì không cần check
    if (initialData && value === initialData.username) {
      setUsernameError(null);
      return;
    }

    try {
      setChecking(true);
      const result = await checkUsernameExist(value);
      if (result?.exists === 1) {
        setUsernameError("Tên đăng nhập đã tồn tại!");
        showError("Tên đăng nhập đã tồn tại!");
      } else {
        setUsernameError(null);
        showSuccess("Tên đăng nhập hợp lệ!");
      }
    } catch (err) {
      // Không hiển thị lỗi nếu API fail - chỉ log
      console.warn("Check username error:", err);
      setUsernameError(null);
    } finally {
      setChecking(false);
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tạo rules động - password required khi thêm mới
    const dynamicRules = { ...userRules };
    if (!isEditMode) {
      dynamicRules.password_hash = { label: "Mật khẩu", rules: ["required", "password"] };
    }

    const { isValid, errors: formErrors } = validateForm(formData, dynamicRules);
    setErrors(formErrors);
    setTouched(
      Object.keys(dynamicRules).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (!isValid) {
      showError("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    if (checking) {
      showError("Đang kiểm tra tên đăng nhập...");
      return;
    }

    if (usernameError) {
      showError("Tên đăng nhập đã tồn tại!");
      return;
    }

    // Lấy user_id từ localStorage (người đang đăng nhập) - dùng prefix BA_
    let currentUserId = "system";
    try {
      const stored = localStorage.getItem("BA_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        currentUserId = parsed.user_id || "system";
      }
    } catch {}

    const user: Partial<IUser> = {
      user_id: initialData?.user_id,
      username: formData.username,
      password_hash: formData.password_hash || undefined,
      role_id: formData.role_id,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      gender: formData.gender,
      lu_user_id: currentUserId,
    };

    // Nếu edit và không nhập password mới thì xóa field password
    if (isEditMode && !formData.password_hash) {
      delete user.password_hash;
    }

    onSubmit(user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm py-12 px-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white border-b border-gray-50 px-10 pt-12 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Profile Authentication</h3>
            <h2 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">
                {isEditMode ? "Modify Intel" : "Initialize Profile"}
            </h2>
          </div>
          <button onClick={onClose} className="p-4 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Identity Name" name="full_name" value={formData.full_name || ""} onChange={handleChange} onBlur={handleBlur} error={touched.full_name ? errors.full_name : null} placeholder="Full Legal Name" />
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Master Username (Email)</label>
                <div className="relative">
                    <input
                        name="username" type="email" value={formData.username || ""} onChange={handleChange}
                        onBlur={(e) => { handleBlur(e); handleCheckUsername(e.target.value); }}
                        readOnly={isEditMode}
                        placeholder="admin@jmfashion.com"
                        className={`w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''} ${touched.username && (errors.username || usernameError) ? 'border-red-100 ring-red-50 text-red-500' : 'text-black'}`}
                    />
                    {checking && <Loader2 className="absolute right-6 top-5 animate-spin text-black" size={16} />}
                </div>
                {(touched.username && errors.username) || usernameError ? <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-1">{errors.username || usernameError}</p> : null}
            </div>
            <InputField label={isEditMode ? "Revised Security Key" : "Master Security Key"} name="password_hash" type="password" value={formData.password_hash || ""} onChange={handleChange} onBlur={handleBlur} error={touched.password_hash ? errors.password_hash : null} placeholder="••••••••" />
            <SelectField label="Clearance Level" name="role_id" value={formData.role_id || ""} onChange={handleChange} onBlur={handleBlur} options={roleList} optionLabel="role_name" optionValue="role_id" error={touched.role_id ? errors.role_id : null} />
            <InputField label="Contact Channel" name="email" type="email" value={formData.email || ""} onChange={handleChange} onBlur={handleBlur} error={touched.email ? errors.email : null} placeholder="Alternative Email" />
            <InputField label="Signal Frequency (Phone)" name="phone" value={formData.phone || ""} onChange={handleChange} onBlur={handleBlur} error={touched.phone ? errors.phone : null} placeholder="+84 000 000 000" />
            <div className="md:col-span-2">
                <InputField label="Base Location" name="address" value={formData.address || ""} onChange={handleChange} onBlur={handleBlur} placeholder="Operational Address" />
            </div>
            <SelectField label="Gender Identity" name="gender" value={formData.gender || ""} onChange={handleChange} onBlur={handleBlur} options={[{ value: "Nam", label: "Male" }, { value: "Nữ", label: "Female" }, { value: "Khác", label: "Other" }]} optionLabel="label" optionValue="value" />
          </div>
        </form>

        {/* Footer */}
        <div className="p-10 bg-white border-t border-gray-50 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-10 py-4 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Abort</button>
          <button type="submit" onClick={handleSubmit} disabled={isLoading || checking} className="px-10 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center gap-3">
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Commit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, onBlur, error, placeholder, type = "text", readOnly }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
    <input
      type={type} name={name} value={value || ""} onChange={onChange} onBlur={onBlur} readOnly={readOnly} placeholder={placeholder}
      className={`w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${error ? 'border-red-100 ring-red-50 text-red-500' : 'text-black'}`}
    />
    {error && <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, onBlur, options, optionLabel, optionValue, error }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
    <select
      name={name} value={value || ""} onChange={onChange} onBlur={onBlur}
      className={`w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all appearance-none cursor-pointer ${error ? 'border-red-100 ring-red-50 text-red-500' : 'text-black'}`}
    >
      <option value="">Choose Level</option>
      {options.map((item: any) => (
        <option key={item[optionValue]} value={item[optionValue]}>{item[optionLabel]}</option>
      ))}
    </select>
  </div>
);
