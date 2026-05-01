import React from "react";

interface CommonModalProps {
  open: boolean;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  onCancel: () => void;
  onOk?: (...args: any[]) => void;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  className?: string;
  width?: number | string;
}

export const CommonModal: React.FC<CommonModalProps> = ({
  open,
  title,
  children,
  onCancel,
  onOk,
  okText = "Save",
  cancelText = "Cancel",
  confirmLoading = false,
  className = "",
  width = 600,
}) => {
  if (!open) return null;

  const isCenter = className?.includes("modal-center");

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-16 animate-fadeIn">
      {/* Modal Box */}
      <div
        className={`
          bg-white rounded-lg shadow-xl w-full max-h-[90vh] 
          overflow-hidden flex flex-col border border-[#d4af37]/30
          ${className}
        `}
        style={{ maxWidth: width }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-[#d4af37]/30 bg-gradient-to-r from-[#fef9e7] to-[#fef5e7]">
          <h2 className="text-lg font-semibold text-[#8b5e3c]">{title}</h2>
          <button
            onClick={onCancel}
            className="text-[#8b5e3c] hover:text-[#b91c1c] transition-transform hover:scale-110"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-white">{children}</div>

        {/* Footer */}
        <div
          className={`
            flex gap-3 px-5 py-3 border-t border-[#d4af37]/30 
            ${isCenter ? "justify-center" : "justify-end"}
            bg-gradient-to-r from-[#fef9e7]/80 to-[#fef5e7]/80
          `}
        >
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-[#d4af37]/50 bg-white text-[#8b5e3c] hover:bg-[#fff9e6] transition-colors"
          >
            {cancelText}
          </button>

          <button
            onClick={(e) => onOk?.(e)}
            disabled={confirmLoading}
            className="px-5 py-2 rounded bg-gradient-to-r from-[#d4af37] to-[#f1c40f] text-white font-medium 
                     hover:from-[#c19b2e] hover:to-[#d4ac0d] transition-all
                     flex items-center gap-2 disabled:opacity-50"
          >
            {confirmLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLoading ? "Đang xử lý..." : okText}
          </button>
        </div>
      </div>
    </div>
  );
};
