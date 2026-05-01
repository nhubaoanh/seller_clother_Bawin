/**
 * Custom hook để validate form
 * Hỗ trợ: validate realtime, chặn nhập ký tự không hợp lệ
 */

import { useState, useCallback } from "react";
import { validateForm as validateFormUtil, validateField, FormRules } from "./validator";

export interface UseFormValidationOptions<T> {
  initialValues: T;
  rules: FormRules;
}

// Kiểm tra rule có chặn số không
const shouldBlockNumbers = (rules: FormRules, fieldName: string): boolean => {
  const config = rules[fieldName];
  if (!config) return false;
  return config.rules.some(r => 
    r === "alpha" || r === "noNumber" || r === "fullName"
  );
};

// Kiểm tra rule có chặn chữ không (chỉ cho nhập số)
const shouldBlockLetters = (rules: FormRules, fieldName: string): boolean => {
  const config = rules[fieldName];
  if (!config) return false;
  return config.rules.some(r => 
    r === "number" || r === "integer" || r === "positive" || 
    r === "nonNegative" || r === "age" || r === "year" || r === "phone" || r === "idCard"
  );
};

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  rules,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>(
    () => Object.keys(initialValues).reduce((acc, key) => ({ ...acc, [key]: null }), {} as Record<keyof T, string | null>)
  );
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    () => Object.keys(initialValues).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<keyof T, boolean>)
  );

  // Xử lý thay đổi giá trị - có chặn ký tự không hợp lệ
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    // Chặn nhập số vào field chữ
    if (typeof newValue === "string" && shouldBlockNumbers(rules, name)) {
      newValue = newValue.replace(/\d/g, "");
    }

    // Chặn nhập chữ vào field số (chỉ cho số, dấu chấm, dấu trừ)
    if (typeof newValue === "string" && shouldBlockLetters(rules, name)) {
      // Cho phép số, dấu chấm (decimal), dấu trừ (số âm), dấu cộng (phone)
      newValue = newValue.replace(/[^0-9.\-+]/g, "");
    }

    setValues(prev => ({ ...prev, [name]: newValue }));

    // Validate lại nếu đã touched
    if (touched[name as keyof T] && errors[name as keyof T]) {
      const fieldError = validateField(name, newValue, rules, { ...values, [name]: newValue });
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [touched, errors, rules, values]);

  // Xử lý blur - validate field
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value, rules, values);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  }, [rules, values]);

  // Validate toàn bộ form
  const validateAll = useCallback((): boolean => {
    const { isValid, errors: formErrors } = validateFormUtil(values, rules);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<keyof T, boolean>)
    );
    setErrors(formErrors as Record<keyof T, string | null>);
    return isValid;
  }, [values, rules]);

  // Set giá trị cho 1 field
  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set nhiều giá trị cùng lúc
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Set error cho 1 field
  const setError = useCallback((name: keyof T, error: string | null) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Reset form
  const reset = useCallback((newValues?: T) => {
    setValues(newValues || initialValues);
    setErrors(Object.keys(initialValues).reduce((acc, key) => ({ ...acc, [key]: null }), {} as Record<keyof T, string | null>));
    setTouched(Object.keys(initialValues).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<keyof T, boolean>));
  }, [initialValues]);

  // Kiểm tra form có valid không
  const isValid = Object.values(errors).every(e => e === null);

  // Lấy props cho input
  const getFieldProps = (name: keyof T) => ({
    name,
    value: values[name] ?? "",
    onChange: handleChange,
    onBlur: handleBlur,
  });

  // Lấy error message (chỉ khi touched)
  const getError = (name: keyof T) => touched[name] ? errors[name] : null;

  // Kiểm tra field có lỗi không
  const hasError = (name: keyof T) => touched[name] && errors[name] !== null;

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValue,
    setMultipleValues,
    setError,
    reset,
    isValid,
    getFieldProps,
    getError,
    hasError,
  };
}
