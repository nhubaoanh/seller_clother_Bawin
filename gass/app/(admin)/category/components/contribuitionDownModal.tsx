"use client";

import React, { useEffect } from "react";
import { X, Check, Loader2, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllDongHo } from "@/service/lineage.service";
import { useToast } from "@/service/useToas";
import { useFormValidation } from "@/lib/useFormValidation";
import { FormRules } from "@/lib/validator";
import { IContributionDown } from "@/types/contribuitionDown";

// ==================== PROPS ====================
interface ContributionUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IContributionDown>) => void;
  initialData?: IContributionDown | null;
  isLoading: boolean;
}

// ==================== VALIDATION RULES ====================
const rules: FormRules = {
  hoTenNguoiDong: {
    label: "Họ tên người đóng",
    rules: [{ type: "required" }, { type: "maxLength", value: 200 }],
  },
  ngayDong: {
    label: "Ngày đóng",
    rules: [{ type: "required" }, { type: "date" }],
  },
  soTien: {
    label: "Số tiền",
    rules: [{ type: "required" }, { type: "positive" }],
  },
  dongHoId: {
    label: "Dòng họ",
    rules: [{ type: "required" }],
  },
  danhMucId: {
    label: "Danh mục",
    rules: [{ type: "required" }],
  },
  phuongThucThanhToan: {
    label: "Phương thức thanh toán",
    rules: [{ type: "required" }],
  },
  noiDung: {
    label: "Nội dung",
    rules: [{ type: "maxLength", value: 500 }],
  },
  ghiChu: {
    label: "Ghi chú",
    rules: [{ type: "maxLength", value: 300 }],
  },
  soDienThoaiNguoiNhap: {
    label: "SĐT người nhập",
    rules: [{ type: "phone" }],
  },
};

// ==================== PAYMENT METHODS ====================
const PAYMENT_METHODS = [
  { value: "tien_mat", label: "Tiền mặt" },
  { value: "chuyen_khoan", label: "Chuyển khoản" },
  { value: "khac", label: "Khác" },
];

// ==================== DANH MỤC THU ====================
const DANH_MUC_LIST = [
  { value: 1, label: "Đóng góp xây dựng" },
  { value: 2, label: "Quỹ từ thiện" },
  { value: 3, label: "Phí thường niên" },
  { value: 4, label: "Đóng góp sự kiện" },
  { value: 5, label: "Khác" },
];

// ==================== INITIAL VALUES ====================
const getInitialValues = (data?: IContributionDown | null): Partial<IContributionDown> => ({
  nguoiNhan: data?.nguoiNhan || "",
  ngayChi: data?.ngayChi || new Date(),
  soTien: data?.soTien || 0,
  dongHoId: data?.dongHoId || "",
  danhMucId: data?.danhMucId || 1,
  phuongThucThanhToan: data?.phuongThucThanhToan || "tien_mat",
  noiDung: data?.noiDung || "",
  ghiChu: data?.ghiChu || "",
  soDienThoaiNguoiNhap: data?.soDienThoaiNguoiNhap || "",
});

// ==================== MAIN COMPONENT ====================
export const ContributionUpModal: React.FC<ContributionUpModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const { showError } = useToast();

  // ========== FORM VALIDATION HOOK ==========
  const {
    values,
    handleChange,
    handleBlur,
    validateAll,
    setValue,
    getError,
  } = useFormValidation({
    initialValues: getInitialValues(initialData),
    rules,
  });

  // ========== LOAD DATA ==========
  const { data: dongHoData } = useQuery({
    queryKey: ["Lineage"],
    queryFn: getAllDongHo,
  });
  const dongHoList = Array.isArray(dongHoData) ? dongHoData : dongHoData?.data ?? [];

  // ========== RESET FORM KHI MODAL MỞ ==========
  useEffect(() => {
    if (isOpen) {
      // Reset với giá trị mới
      Object.entries(getInitialValues(initialData)).forEach(([key, val]) => {
        setValue(key as keyof IContributionDown, val);
      });
    }
  }, [isOpen, initialData, setValue]);

  // ========== SUBMIT ==========
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      showError("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    onSubmit({
      ...values,
      chiId: initialData?.chiId,
      nguoiNhapId: initialData?.nguoiNhapId,
    });
  };

  // ========== HELPERS ==========
  const formatDate = (date: any): string => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#fffdf5] w-full max-w-xl rounded-lg shadow-2xl border border-[#d4af37] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-[#b91c1c] text-yellow-400 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold uppercase flex items-center gap-2">
            <DollarSign size={24} />
            {initialData ? "Sửa khoản thu" : "Thêm khoản thu"}
          </h3>
          <button onClick={onClose} disabled={isLoading} className="hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form id="contributionForm" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Họ tên người đóng */}
          <Field
            label="Họ tên người đóng"
            name="nguoiNhan"
            required
            value={values.nguoiNhan || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("nguoiNhan")}
            placeholder="Nhập họ tên người đóng góp"
          />

          {/* Dòng họ + Danh mục */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Dòng họ"
              name="dongHoId"
              required
              value={values.dongHoId || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              options={dongHoList}
              optionLabel="tenDongHo"
              optionValue="dongHoId"
              error={getError("dongHoId")}
            />
            <Select
              label="Danh mục thu"
              name="danhMucId"
              required
              value={values.danhMucId ?? 1}
              onChange={handleChange}
              onBlur={handleBlur}
              options={DANH_MUC_LIST}
              optionLabel="label"
              optionValue="value"
              error={getError("danhMucId")}
            />
          </div>

          {/* Số tiền + Ngày đóng */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Số tiền (VNĐ)"
              name="soTien"
              type="number"
              required
              value={values.soTien?.toString() || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError("soTien")}
              placeholder="0"
            />
            <Field
              label="Ngày đóng"
              name="ngayDong"
              type="date"
              required
              value={formatDate(values.ngayChi)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError("ngayChi")}
            />
          </div>

          {/* Phương thức thanh toán */}
          <Select
            label="Phương thức thanh toán"
            name="phuongThucThanhToan"
            required
            value={values.phuongThucThanhToan || "tien_mat"}
            onChange={handleChange}
            onBlur={handleBlur}
            options={PAYMENT_METHODS}
            optionLabel="label"
            optionValue="value"
            error={getError("phuongThucThanhToan")}
          />

          {/* Nội dung */}
          <TextArea
            label="Nội dung"
            name="noiDung"
            value={values.noiDung || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("noiDung")}
            placeholder="VD: Đóng góp xây dựng nhà thờ họ"
            rows={2}
          />

          {/* SĐT người nhập */}
          <Field
            label="SĐT người nhập"
            name="soDienThoaiNguoiNhap"
            value={values.soDienThoaiNguoiNhap || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("soDienThoaiNguoiNhap")}
            placeholder="VD: 0912345678"
          />

          {/* Ghi chú */}
          <TextArea
            label="Ghi chú"
            name="ghiChu"
            value={values.ghiChu || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("ghiChu")}
            placeholder="Ghi chú thêm (nếu có)"
            rows={2}
          />
        </form>

        {/* FOOTER */}
        <div className="p-4 bg-[#fdf6e3] border-t border-[#d4af37]/30 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2 text-[#5d4037] font-bold hover:text-[#b91c1c]"
          >
            Đóng
          </button>
          <button
            type="submit"
            form="contributionForm"
            disabled={isLoading}
            className="px-6 py-2 bg-[#b91c1c] text-white font-bold rounded hover:bg-[#991b1b] flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
            {isLoading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==================== REUSABLE COMPONENTS ==================== */

const Field = ({ label, name, type = "text", required, value, onChange, onBlur, error, placeholder }: any) => (
  <div className="space-y-1">
    <label className="text-sm font-bold text-[#8b5e3c] uppercase">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full p-3 bg-white border rounded focus:outline-none ${
        error ? "border-red-500" : "border-[#d4af37]/50 focus:border-[#b91c1c]"
      }`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const Select = ({ label, name, required, value, onChange, onBlur, options, optionLabel, optionValue, error }: any) => (
  <div className="space-y-1">
    <label className="text-sm font-bold text-[#8b5e3c] uppercase">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full p-3 bg-white border rounded focus:outline-none ${
        error ? "border-red-500" : "border-[#d4af37]/50 focus:border-[#b91c1c]"
      }`}
    >
      <option value="">-- Chọn --</option>
      {options.map((item: any) => (
        <option key={item[optionValue]} value={item[optionValue]}>
          {item[optionLabel]}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const TextArea = ({ label, name, required, value, onChange, onBlur, error, placeholder, rows = 3 }: any) => (
  <div className="space-y-1">
    <label className="text-sm font-bold text-[#8b5e3c] uppercase">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-3 bg-white border rounded focus:outline-none resize-none ${
        error ? "border-red-500" : "border-[#d4af37]/50 focus:border-[#b91c1c]"
      }`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);
