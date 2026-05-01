import axios from "axios";
import { BASE_URL } from "@/constant/config";
import { LOGIN_URL } from "@/urls";
import storage from "@/utils/storage";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 1000 * 60 * 30 * 3, // 3 phút
});

console.log('🌐 API Client baseURL:', BASE_URL);


// add token to header automatically
apiClient.interceptors.request.use(
    function (config){
        config.headers.Authorization = "Bearer " + storage.getToken();
        return config;
    }
)

// Response interceptor - xử lý lỗi 401, 403
apiClient.interceptors.response.use(
    function (response) {
        // Trả về response, để từng service tự xử lý success/fail
        return response;
    },
    function (error) {
        const status = error?.response?.status;
        
        // 401 - Unauthorized: chưa đăng nhập hoặc token hết hạn
        if (status === 401) {
            storage.clearToken();
            if (typeof window !== "undefined" && !window.location.pathname.includes(LOGIN_URL)) {
                window.location.href = LOGIN_URL;
            }
        }
        
        // 403 - Forbidden: không có quyền truy cập
        if (status === 403) {
            if (typeof window !== "undefined" && !window.location.pathname.includes("/403")) {
                window.location.href = "/403";
            }
        }
        
        return Promise.reject(error);
    }
)

export const filterEmptyString = (params: Record<string, any>) => {
  const result: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "") {
      result[key] = value;
    }
  });

  return result;
};
