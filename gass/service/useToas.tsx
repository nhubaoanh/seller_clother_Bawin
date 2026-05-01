"use client";
// toastContext.js hoặc useToast.js
import ToastComponent from "@/components/ui/ToastComponent";
import React, { createContext, useContext, useState, useCallback, FC } from "react";

type ToasTypes = "info" | 'error' | 'success' | 'warning';

interface toastState {
    message: string;
    type: ToasTypes;
    isVisible: boolean;
}

// Interface cho các giá trị và hàm được cung cấp qua Context
interface ToastContextValue {
    toastState: toastState;
    showError: (message?:string) => void;
    showSuccess: (message: string) => void;
    showInfo: (messgae : string) => void;
    showWarning: (message: string) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Custom Hook để sử dụng Toast Notification trong các Component.
 * Báo lỗi nếu Hook được gọi bên ngoài ToastProvider.
 */
export const useToast = () : ToastContextValue => {
    const context = useContext(ToastContext);
    if(context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

// Định nghĩa props cho Provider
interface ToastProviderProps {
    children: React.ReactNode;
    duration?: number; // Thời gian hiển thị mặc định (ms)
}
// boc component

export const ToastProvider: FC<ToastProviderProps> = ({children, duration = 3000}) => {
  const [toaststate, setToastState] = useState<toastState>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // ham an
  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // funsion show
  const showToast = useCallback(
    (message: string, type: ToasTypes) => {
      setToastState({
        message,
        type,
        isVisible: true,
      });

      setTimeout(() => {
        hideToast();
      }, duration);
    },
    [duration, hideToast]
  );

  // Các hàm gọi nhanh cho từng loại Toast
  const showError = useCallback(
    (message?: string) => {
      showToast(message || "Đã xảy ra lỗi không xác định.", "error");
    },
    [showToast]
  );

  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => {
      showToast(message, "info");
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string) => {
      showToast(message, "warning");
    },
    [showToast]
  );

  const value: ToastContextValue = {
    toastState: toaststate,
    showError,
    showSuccess,
    showInfo,
    showWarning,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Đặt Component hiển thị ở đây để nó có thể truy cập trạng thái */}
      <ToastComponent />
    </ToastContext.Provider>
  );
}