/**
 * Base Service - Lớp service chung cho tất cả modules
 * Xử lý error handling, logging, validation chung
 */
export abstract class BaseService {
  protected handleError(error: any, operation: string) {
    console.error(`❌ [${operation}] Error:`, error.message);
    return {
      success: false,
      data: null,
      message: error.message || `Lỗi khi ${operation}`,
      error_code: error.code || 'UNKNOWN_ERROR'
    };
  }

  protected handleSuccess(data: any, message: string, pagination?: any) {
    const result: any = {
      success: true,
      data,
      message
    };

    if (pagination) {
      result.totalItems = pagination.totalItems || 0;
      result.page = pagination.page || 1;
      result.pageSize = pagination.pageSize || 10;
      result.pageCount = pagination.pageCount || 0;
    }

    return result;
  }

  protected validatePagination(pageIndex: number, pageSize: number) {
    return {
      pageIndex: Math.max(1, pageIndex || 1),
      pageSize: Math.min(100, Math.max(1, pageSize || 10))
    };
  }
}