import React from "react";
import { Trash2, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fffdf5] w-full max-w-md p-6 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-[#b91c1c]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isLoading ? (
              <Loader2 className="text-[#b91c1c] w-8 h-8 animate-spin" />
            ) : (
              <Trash2 className="text-[#b91c1c] w-8 h-8" />
            )}
          </div>
          <h3 className="text-xl font-bold text-[#5d4037] mb-2 font-display">
            Xác nhận xóa?
          </h3>
          <p className="text-stone-600 mb-6">
            Bạn có chắc chắn muốn xóa thành viên{" "}
            <span className="font-bold text-[#b91c1c]">{itemName}</span>?
            <br />
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-stone-300 rounded text-stone-600 hover:bg-stone-100 font-bold transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-2 bg-[#b91c1c] text-white rounded hover:bg-[#991b1b] font-bold shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Đang xóa..." : "Xóa ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
