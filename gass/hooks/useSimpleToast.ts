"use client";

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export const useSimpleToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    addToast(message, 'success');
    console.log('✅ Success:', message); // Tạm thời log để debug
  }, [addToast]);

  const showError = useCallback((message: string) => {
    addToast(message, 'error');
    console.log('❌ Error:', message); // Tạm thời log để debug
  }, [addToast]);

  const showWarning = useCallback((message: string) => {
    addToast(message, 'warning');
    console.log('⚠️ Warning:', message); // Tạm thời log để debug
  }, [addToast]);

  const showInfo = useCallback((message: string) => {
    addToast(message, 'info');
    console.log('ℹ️ Info:', message); // Tạm thời log để debug
  }, [addToast]);

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  };
};