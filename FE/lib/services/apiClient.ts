export const BE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResult<T>> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        credentials: 'include',
        ...options,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return { 
          success: false, 
          error: data?.message || data?.error || `Lỗi máy chủ: ${response.status}` 
        };
      }

      // Backend returns { success: true, data: [...] }
      // So if data already has success and data fields, return it directly
      if (data && typeof data === 'object' && 'success' in data) {
        return data as ApiResult<T>;
      }

      return { success: true, data: data, message: data?.message };
    } catch (error: any) {
      return { success: false, error: error.message || 'Không thể kết nối đến server' };
    }
  }

  get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put<T = any>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  delete<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Client gọi trực tiếp Backend Express (cổng 3000)
export const beClient = new ApiClient(BE_BASE_URL);

// Client gọi Next.js API Routes nội bộ (/api)
export const localClient = new ApiClient('/api');
