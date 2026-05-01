/**
 * Xử lý lỗi API tập trung
 * Không throw error lên Next.js, chỉ return kết quả có cấu trúc
 */

import { AxiosError } from "axios";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  statusCode?: number;
}

export interface ApiErrorDetail {
  message: string;
  statusCode: number;
  errors?: string[];
}

/**
 * Parse lỗi từ Axios response
 */
export function parseApiError(error: unknown): ApiErrorDetail {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const data = error.response?.data;

    // Lấy message từ response
    let message = "Đã xảy ra lỗi không xác định";
    
    if (data?.message) {
      message = data.message;
    } else if (data?.error) {
      message = data.error;
    } else if (error.message) {
      message = error.message;
    }

    // Map status code sang message tiếng Việt
    if (status === 401) {
      message = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
    } else if (status === 403) {
      message = "Bạn không có quyền thực hiện thao tác này";
    } else if (status === 404) {
      message = "Không tìm thấy dữ liệu";
    } else if (status === 500) {
      // Giữ message từ server nếu có, không thì dùng message mặc định
      message = data?.message || "Lỗi máy chủ, vui lòng thử lại sau";
    }

    return {
      message,
      statusCode: status,
      errors: data?.errors || []
    };
  }

  // Lỗi không phải Axios
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500
    };
  }

  return {
    message: "Đã xảy ra lỗi không xác định",
    statusCode: 500
  };
}

/**
 * Wrapper cho API call - không throw, chỉ return kết quả
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  defaultValue: T | null = null
): Promise<ApiResponse<T>> {
  try {
    const data = await apiCall();
    return {
      success: true,
      data,
      message: "Thành công"
    };
  } catch (error) {
    const errorDetail = parseApiError(error);
    
    // Log lỗi ra console (không phải throw)
    console.error(`[API Error] ${errorDetail.statusCode}: ${errorDetail.message}`);
    
    return {
      success: false,
      data: defaultValue,
      message: errorDetail.message,
      statusCode: errorDetail.statusCode
    };
  }
}

/**
 * Wrapper cho API call - throw error với message đẹp
 * Dùng khi cần throw để React Query/mutation bắt
 */
export async function apiCallWithError<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    const errorDetail = parseApiError(error);
    
    // Throw error với message đã format
    const customError = new Error(errorDetail.message);
    (customError as any).statusCode = errorDetail.statusCode;
    (customError as any).errors = errorDetail.errors;
    
    throw customError;
  }
}
