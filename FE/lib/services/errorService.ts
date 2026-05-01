/**
 * Error Service - Centralized error handling
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class ErrorService {
  static handleApiError(error: any): ApiError {
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        code: 'NETWORK_ERROR',
        status: 0,
      };
    }

    // HTTP errors
    if (error.status) {
      switch (error.status) {
        case 400:
          return {
            message: error.message || 'Dữ liệu không hợp lệ',
            code: 'BAD_REQUEST',
            status: 400,
          };
        case 401:
          return {
            message: 'Vui lòng đăng nhập để tiếp tục',
            code: 'UNAUTHORIZED',
            status: 401,
          };
        case 403:
          return {
            message: 'Bạn không có quyền thực hiện thao tác này',
            code: 'FORBIDDEN',
            status: 403,
          };
        case 404:
          return {
            message: 'Không tìm thấy dữ liệu yêu cầu',
            code: 'NOT_FOUND',
            status: 404,
          };
        case 409:
          return {
            message: 'Dữ liệu đã tồn tại hoặc xung đột',
            code: 'CONFLICT',
            status: 409,
          };
        case 422:
          return {
            message: 'Dữ liệu không đúng định dạng',
            code: 'VALIDATION_ERROR',
            status: 422,
          };
        case 429:
          return {
            message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau',
            code: 'RATE_LIMIT',
            status: 429,
          };
        case 500:
          return {
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau',
            code: 'INTERNAL_ERROR',
            status: 500,
          };
        case 502:
        case 503:
        case 504:
          return {
            message: 'Server đang bảo trì. Vui lòng thử lại sau',
            code: 'SERVER_UNAVAILABLE',
            status: error.status,
          };
        default:
          return {
            message: error.message || 'Có lỗi xảy ra',
            code: 'UNKNOWN_ERROR',
            status: error.status,
          };
      }
    }

    // Generic errors
    return {
      message: error.message || 'Có lỗi không xác định xảy ra',
      code: 'UNKNOWN_ERROR',
    };
  }

  static getErrorMessage(error: any): string {
    return this.handleApiError(error).message;
  }

  static isAuthError(error: any): boolean {
    const apiError = this.handleApiError(error);
    return apiError.status === 401;
  }

  static isNetworkError(error: any): boolean {
    const apiError = this.handleApiError(error);
    return apiError.code === 'NETWORK_ERROR';
  }

  static shouldRetry(error: any): boolean {
    const apiError = this.handleApiError(error);
    // Retry on network errors and server errors (5xx)
    return apiError.code === 'NETWORK_ERROR' || 
           (apiError.status && apiError.status >= 500);
  }
}

// Error logging service
export class ErrorLogger {
  static log(error: any, context?: string) {
    const apiError = ErrorService.handleApiError(error);
    
    console.error(`[${context || 'Error'}]`, {
      message: apiError.message,
      code: apiError.code,
      status: apiError.status,
      details: apiError.details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: { context, apiError } });
    }
  }
}