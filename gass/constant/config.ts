export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
export const API_CORE = "/api";

export const ERROR_TIMEOUT = "read ECONNRESET";
export const SEARCH_PAGE = "pageIndex";
export const SEARCH_SIZE = "pageSize";
export const SEARCH_CONTENT = "search_content";
export const SEARCH_CATEGORY = "categoryId";
export const SEARCH_STATUS = "activeFlag";

// Helper function để lấy URL ảnh đầy đủ
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl || imageUrl.trim() === "") return "/placeholder.svg";
  if (imageUrl.startsWith("http")) return imageUrl;
  
  // Chuẩn hóa đường dẫn: thay \ thành / và loại bỏ dấu / ở đầu
  const normalizedPath = imageUrl.replace(/\\/g, '/');
  const cleanPath = normalizedPath.startsWith("/") ? normalizedPath.slice(1) : normalizedPath;
  
  // Encode từng đoạn để xử lý khoảng trắng/ký tự đặc biệt
  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  
  // Đảm bảo có đúng 1 dấu / giữa BASE_URL và encodedPath
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${baseUrl}/${encodedPath}`;
};