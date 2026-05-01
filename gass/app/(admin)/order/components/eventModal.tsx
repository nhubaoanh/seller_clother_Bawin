// "use client";

// /**
//  * EventModal - Modal thêm/sửa sự kiện
//  * 
//  * Tính năng:
//  * - Validate form realtime (blur) và khi submit
//  * - Controlled form với useState
//  * - Hiển thị lỗi dưới mỗi field
//  * - Load danh sách dòng họ và thành viên
//  */

// import React, { useEffect, useState } from "react";
// import { X, Check, Loader2, Calendar } from "lucide-react";
// import { IInvoice } from "@/types/order";
// import { useQuery } from "@tanstack/react-query";
// import { useToast } from "@/service/useToas";
// import { FormRules, validateForm, validateField } from "@/lib/validator";

// // ==================== PROPS ====================
// interface EventModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (event: Partial<IInvoice>) => void;
//   initialData?: IInvoice | null;  // null = thêm mới, có data = sửa
//   isLoading: boolean;
// }

// // ==================== VALIDATION RULES ====================
// /**
//  * Định nghĩa rules validate cho từng field
//  * - required: Bắt buộc nhập
//  * - maxLength: Giới hạn độ dài
//  * - date: Kiểm tra định dạng ngày
//  */
// const eventRules: FormRules = {
//   tenSuKien: { label: "Tên sự kiện", rules: ["required", { min: 3 }, { max: 200 }] },
//   ngayDienRa: { label: "Ngày diễn ra", rules: ["required", "date"] },
//   diaDiem: { label: "Địa điểm", rules: [{ max: 300 }] },
//   moTa: { label: "Mô tả", rules: [{ max: 1000 }] },
//   dongHoId: { label: "Dòng họ", rules: ["required"] },
// };

// // ==================== LOẠI SỰ KIỆN ====================
// const EVENT_TYPES = [
//   { value: 1, label: "Giỗ" },
//   { value: 2, label: "Cưới" },
//   { value: 3, label: "Sinh nhật" },
//   { value: 4, label: "Họp mặt" },
//   { value: 5, label: "Khác" },
// ];

// // ==================== MỨC ĐỘ ƯU TIÊN ====================
// const PRIORITY_LEVELS = [
//   { value: 1, label: "Thấp" },
//   { value: 2, label: "Trung bình" },
//   { value: 3, label: "Cao" },
// ];

// // ==================== MAIN COMPONENT ====================
// export const EventModal: React.FC<EventModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   isLoading,
// }) => {
//   const { showError } = useToast();

//   // ========== FORM STATE ==========
//   // Dùng controlled form để dễ validate và quản lý
//   const [formData, setFormData] = useState<Partial<IInvoice>>({});
//   const [errors, setErrors] = useState<Record<string, string | null>>({});
//   const [touched, setTouched] = useState<Record<string, boolean>>({});

//   // ========== RESET FORM KHI MODAL MỞ ==========
//   useEffect(() => {
//     if (isOpen) {
//       // Reset về giá trị ban đầu hoặc rỗng
//       setFormData({
//         tenSuKien: initialData?.tenSuKien || "",
//         ngayDienRa: initialData?.ngayDienRa,
//         gioDienRa: initialData?.gioDienRa,
//         diaDiem: initialData?.diaDiem || "",
//         moTa: initialData?.moTa || "",
//         dongHoId: initialData?.dongHoId || "",
//         loaiSuKien: initialData?.loaiSuKien ?? 1,
//         uuTien: initialData?.uuTien ?? 2,
//         lapLai: initialData?.lapLai ?? 0,
//         nguoiTaoId: initialData?.nguoiTaoId || "",
//       });
//       // Reset errors và touched
//       setErrors({});
//       setTouched({});
//     }
//   }, [isOpen, initialData]);

//   // ========== HANDLE CHANGE ==========
//   /**
//    * Xử lý khi user thay đổi giá trị input
//    * - Cập nhật formData
//    * - Nếu field đã touched và có lỗi, validate lại ngay
//    */
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
    
//     // Xử lý giá trị theo type
//     let newValue: any = value;
//     if (type === "number") {
//       newValue = value ? Number(value) : undefined;
//     } else if (type === "checkbox") {
//       newValue = (e.target as HTMLInputElement).checked ? 1 : 0;
//     }

//     setFormData((prev) => ({ ...prev, [name]: newValue }));

//     // Validate lại nếu field đã touched
//     if (touched[name]) {
//       const error = validateField(name, newValue, eventRules, formData);
//       setErrors((prev) => ({ ...prev, [name]: error }));
//     }
//   };

//   // ========== HANDLE BLUR ==========
//   /**
//    * Xử lý khi user rời khỏi input (blur)
//    * - Mark field là touched
//    * - Validate field
//    */
//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     const error = validateField(name, value, eventRules, formData);
//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   // ========== HANDLE SUBMIT ==========
//   /**
//    * Xử lý khi submit form
//    * - Validate toàn bộ form
//    * - Nếu có lỗi, hiển thị và scroll đến field lỗi đầu tiên
//    * - Nếu hợp lệ, gọi onSubmit
//    */
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate toàn bộ form
//     const { isValid, errors: formErrors } = validateForm(formData, eventRules);
//     setErrors(formErrors);
    
//     // Mark tất cả fields là touched
//     setTouched(
//       Object.keys(eventRules).reduce((acc, key) => ({ ...acc, [key]: true }), {})
//     );

//     if (!isValid) {
//       showError("Vui lòng kiểm tra lại thông tin!");
//       // Scroll đến field lỗi đầu tiên
//       const firstErrorField = Object.keys(formErrors).find((k) => formErrors[k]);
//       if (firstErrorField) {
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }
//       return;
//     }

//     // Gọi callback với data
//     const eventData: Partial<IEvent> = {
//       ...formData,
//       suKienId: initialData?.suKienId,
//       nguoiTaoId: initialData?.nguoiTaoId,
//     };

//     onSubmit(eventData);
//   };

//   // ========== HELPER: FORMAT DATE ==========
//   const formatDateForInput = (date: Date | string | undefined): string => {
//     if (!date) return "";
//     const d = new Date(date);
//     if (isNaN(d.getTime())) return "";
//     return d.toISOString().split("T")[0];
//   };

//   // ========== HELPER: FORMAT TIME ==========
//   const formatTimeForInput = (time: Date | string | undefined): string => {
//     if (!time) return "";
//     // Nếu đã là string dạng "HH:mm" thì trả về luôn
//     if (typeof time === "string" && /^\d{2}:\d{2}/.test(time)) {
//       return time.slice(0, 5);
//     }
//     // Nếu là Date object
//     const d = new Date(time);
//     if (isNaN(d.getTime())) return "";
//     const hours = d.getHours().toString().padStart(2, "0");
//     const minutes = d.getMinutes().toString().padStart(2, "0");
//     return `${hours}:${minutes}`;
//   };

//   // ========== RENDER ==========
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
//       <div className="bg-[#fffdf5] w-full max-w-2xl p-0 rounded-lg shadow-2xl border border-[#d4af37] overflow-hidden flex flex-col max-h-[90vh]">
        
//         {/* ========== HEADER ========== */}
//         <div className="bg-[#b91c1c] text-yellow-400 px-6 py-4 flex justify-between items-center">
//           <h3 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
//             <Calendar size={24} />
//             {initialData ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
//           </h3>
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="hover:text-white transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* ========== BODY - FORM ========== */}
//         <form
//           id="eventForm"
//           onSubmit={handleSubmit}
//           className="p-6 overflow-y-auto space-y-5"
//         >
//           {/* Row 1: Tên sự kiện */}
//           <InputField
//             label="Tên sự kiện"
//             name="tenSuKien"
//             required
//             value={formData.tenSuKien || ""}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.tenSuKien ? errors.tenSuKien : null}
//             placeholder="VD: Giỗ cụ Nguyễn Văn A"
//           />

//           {/* Row 2: Dòng họ + Loại sự kiện */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <SelectField
//               label="Dòng họ"
//               name="dongHoId"
//               required
//               value={formData.dongHoId || ""}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               options={dongHoList}
//               optionLabel="tenDongHo"
//               optionValue="dongHoId"
//               error={touched.dongHoId ? errors.dongHoId : null}
//             />

//             <SelectField
//               label="Loại sự kiện"
//               name="loaiSuKien"
//               value={formData.loaiSuKien ?? 1}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               options={EVENT_TYPES}
//               optionLabel="label"
//               optionValue="value"
//             />
//           </div>

//           {/* Row 3: Ngày + Giờ */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <InputField
//               label="Ngày diễn ra"
//               name="ngayDienRa"
//               type="date"
//               required
//               value={formatDateForInput(formData.ngayDienRa)}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.ngayDienRa ? errors.ngayDienRa : null}
//             />

//             {/* Input giờ với icon */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-[#8b5e3c] uppercase">
//                 Giờ diễn ra
//               </label>
//               <div className="relative flex items-center">
//                 <input
//                   type="time"
//                   name="gioDienRa"
//                   id="gioDienRaInput"
//                   value={formatTimeForInput(formData.gioDienRa)}
//                   onChange={(e) => {
//                     setFormData((prev) => ({ ...prev, gioDienRa: e.target.value as any }));
//                   }}
//                   className="w-full p-3 pr-12 bg-white border border-[#d4af37]/50 rounded shadow-inner focus:border-[#b91c1c] focus:outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const input = document.getElementById("gioDienRaInput") as HTMLInputElement;
//                     if (input) {
//                       input.showPicker?.();
//                       input.focus();
//                     }
//                   }}
//                   className="absolute right-2 p-2 text-[#8b5e3c] hover:text-[#b91c1c] transition-colors"
//                   title="Chọn giờ"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="10"/>
//                     <polyline points="12 6 12 12 16 14"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Row 4: Địa điểm */}
//           <InputField
//             label="Địa điểm"
//             name="diaDiem"
//             value={formData.diaDiem || ""}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.diaDiem ? errors.diaDiem : null}
//             placeholder="VD: Nhà thờ họ, xã ABC, huyện XYZ"
//           />

//           {/* Row 5: Ưu tiên + Lặp lại */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <SelectField
//               label="Mức độ ưu tiên"
//               name="uuTien"
//               value={formData.uuTien ?? 2}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               options={PRIORITY_LEVELS}
//               optionLabel="label"
//               optionValue="value"
//             />

//             <div className="space-y-2">
//               <label className="text-sm font-bold text-[#8b5e3c] uppercase">
//                 Lặp lại hàng năm
//               </label>
//               <label className="flex items-center gap-3 p-3 bg-white border border-[#d4af37]/50 rounded cursor-pointer hover:bg-[#fdf6e3]">
//                 <input
//                   type="checkbox"
//                   name="lapLai"
//                   checked={formData.lapLai === 1}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       lapLai: e.target.checked ? 1 : 0,
//                     }))
//                   }
//                   className="w-5 h-5 accent-[#b91c1c]"
//                 />
//                 <span className="text-[#5d4037]">
//                   {formData.lapLai === 1 ? "Có lặp lại" : "Không lặp lại"}
//                 </span>
//               </label>
//             </div>
//           </div>

//           {/* Row 6: Mô tả */}
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-[#8b5e3c] uppercase">
//               Mô tả
//             </label>
//             <textarea
//               name="moTa"
//               rows={3}
//               value={formData.moTa || ""}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Ghi chú thêm về sự kiện..."
//               className={`w-full p-3 bg-white border rounded shadow-inner focus:outline-none resize-none ${
//                 touched.moTa && errors.moTa
//                   ? "border-red-500"
//                   : "border-[#d4af37]/50 focus:border-[#b91c1c]"
//               }`}
//             />
//             {touched.moTa && errors.moTa && (
//               <p className="text-red-500 text-xs">{errors.moTa}</p>
//             )}
//           </div>
//         </form>

//         {/* ========== FOOTER ========== */}
//         <div className="p-6 bg-[#fdf6e3] border-t border-[#d4af37]/30 flex justify-end gap-4">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={isLoading}
//             className="px-6 py-2 text-[#5d4037] font-bold hover:text-[#b91c1c] transition-colors"
//           >
//             Đóng
//           </button>

//           <button
//             type="submit"
//             form="eventForm"
//             disabled={isLoading}
//             className="px-8 py-2 bg-[#b91c1c] text-white font-bold rounded shadow hover:bg-[#991b1b] flex items-center gap-2 disabled:opacity-50 transition-colors"
//           >
//             {isLoading ? (
//               <Loader2 className="animate-spin" size={18} />
//             ) : (
//               <Check size={18} />
//             )}
//             {isLoading ? "Đang lưu..." : "Lưu sự kiện"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ==========================================
//    REUSABLE COMPONENTS - Tách nhỏ để tái sử dụng
// ========================================== */

// // ========== INPUT FIELD ==========
// interface InputFieldProps {
//   label: string;
//   name: string;
//   type?: string;
//   required?: boolean;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
//   error?: string | null;
//   placeholder?: string;
//   readOnly?: boolean;
// }

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   name,
//   type = "text",
//   required,
//   value,
//   onChange,
//   onBlur,
//   error,
//   placeholder,
//   readOnly,
// }) => (
//   <div className="space-y-2">
//     <label className="text-sm font-bold text-[#8b5e3c] uppercase">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       onBlur={onBlur}
//       placeholder={placeholder}
//       readOnly={readOnly}
//       className={`w-full p-3 bg-white border rounded shadow-inner focus:outline-none transition-colors ${
//         error
//           ? "border-red-500 focus:border-red-500"
//           : "border-[#d4af37]/50 focus:border-[#b91c1c]"
//       } ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
//     />
//     {error && <p className="text-red-500 text-xs">{error}</p>}
//   </div>
// );

// // ========== SELECT FIELD ==========
// interface SelectFieldProps {
//   label: string;
//   name: string;
//   required?: boolean;
//   value: string | number;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
//   options: any[];
//   optionLabel: string;
//   optionValue: string;
//   error?: string | null;
//   disabled?: boolean;
// }

// const SelectField: React.FC<SelectFieldProps> = ({
//   label,
//   name,
//   required,
//   value,
//   onChange,
//   onBlur,
//   options,
//   optionLabel,
//   optionValue,
//   error,
//   disabled,
// }) => (
//   <div className="space-y-2">
//     <label className="text-sm font-bold text-[#8b5e3c] uppercase">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       onBlur={onBlur}
//       disabled={disabled}
//       className={`w-full p-3 bg-white border rounded shadow-inner focus:outline-none transition-colors ${
//         error
//           ? "border-red-500 focus:border-red-500"
//           : "border-[#d4af37]/50 focus:border-[#b91c1c]"
//       } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//     >
//       <option value="">-- Chọn --</option>
//       {options.map((item: any) => (
//         <option key={item[optionValue]} value={item[optionValue]}>
//           {item[optionLabel]}
//         </option>
//       ))}
//     </select>
//     {error && <p className="text-red-500 text-xs">{error}</p>}
//   </div>
// );
