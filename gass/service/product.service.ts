import { apiClient } from "@/lib/api";
import { IProductSearch } from "@/types/product";
import { parseApiError } from "@/lib/apiError";

import { API_CORE } from "@/constant/config";

const API_PREFIX = `${API_CORE}/products`;

/**
 * Lấy danh sách tất cả sản phẩm với phân trang
 * @param pageIndex - Trang hiện tại (mặc định: 1)
 * @param pageSize - Số lượng sản phẩm mỗi trang (mặc định: 10)
 */
export const getProducts = async (pageIndex: number = 1, pageSize: number = 10): Promise<any> => {
    try {
        const url = `${API_PREFIX}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        const res = await apiClient.get(url);
        const data = res?.data || { success: false, data: [], message: "No data" };
        
        // Transform images string to array and include thumbnail
        if (data.success && Array.isArray(data.data)) {
            data.data = data.data.map((p: any) => {
                let images = typeof p.images === 'string' ? p.images.split(',').filter(Boolean) : (p.images || []);
                if (p.thumbnail && !images.includes(p.thumbnail)) {
                    images = [p.thumbnail, ...images];
                }
                return { ...p, images };
            });
        }
        
        return data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[getProducts] ${err.message}`);
        return { 
            success: false, 
            data: [], 
            message: err.message,
            totalItems: 0,
            pageCount: 0
        };
    }
}

/**
 * Lấy thông tin chi tiết sản phẩm theo ID
 * @param id - ID của sản phẩm
 */
export const getProductById = async (id: string): Promise<any> => {
    try {
        const res = await apiClient.get(`${API_PREFIX}/${id}`);
        const data = res?.data || { success: false, data: null, message: "Product not found" };
        
        // Transform images string to array and include thumbnail
        if (data.success && data.data) {
            const p = data.data;
            let images = typeof p.images === 'string' ? p.images.split(',').filter(Boolean) : (p.images || []);
            if (p.thumbnail && !images.includes(p.thumbnail)) {
                images = [p.thumbnail, ...images];
            }
            data.data = { ...p, images };
        }
        
        return data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[getProductById] ${err.message}`);
        return { success: false, data: null, message: err.message };
    }
}

/**
 * Tìm kiếm sản phẩm với các bộ lọc
 * @param searchParams - Tham số tìm kiếm (search_content, categoryId, pageIndex, pageSize)
 */
export const searchProduct = async (searchParams: IProductSearch): Promise<any> => {
    try {
        // Chuẩn bị payload cho API
        const payload = {
            search_content: searchParams.search_content || "",
            categoryId: searchParams.categoryId || undefined,
            pageIndex: searchParams.pageIndex || 1,
            pageSize: searchParams.pageSize || 10
        };

        console.log('🔍 [searchProduct] Calling API with payload:', payload);
        
        const res = await apiClient.post(`${API_PREFIX}/search`, payload);
        
        console.log('✅ [searchProduct] API Response:', res?.data);
        
        return res?.data || { 
            success: false, 
            data: [], 
            message: "No results found",
            totalItems: 0,
            pageCount: 0
        };
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`❌ [searchProduct] ${err.message}`, error);
        return { 
            success: false, 
            data: [], 
            message: err.message, 
            totalItems: 0, 
            pageCount: 0 
        };
    }
}

/**
 * Lấy danh sách sản phẩm theo danh mục
 * @param categoryId - ID của danh mục
 * @param pageIndex - Trang hiện tại
 * @param pageSize - Số lượng sản phẩm mỗi trang
 */
export const getProductsByCategory = async (
    categoryId: string, 
    pageIndex: number = 1, 
    pageSize: number = 10
): Promise<any> => {
    try {
        const url = `${API_PREFIX}/category/${categoryId}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        const res = await apiClient.get(url);
        return res?.data || { success: false, data: [], message: "No products found" };
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[getProductsByCategory] ${err.message}`);
        return { 
            success: false, 
            data: [], 
            message: err.message,
            totalItems: 0,
            pageCount: 0
        };
    }
}

/**
 * Lấy danh sách biến thể của sản phẩm (size, color, price, stock)
 * @param productId - ID của sản phẩm
 */
export const getProductVariants = async (productId: string): Promise<any> => {
    try {
        const res = await apiClient.get(`${API_PREFIX}/${productId}/variants`);
        return res?.data || { success: false, data: [], message: "No variants found" };
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[getProductVariants] ${err.message}`);
        return { success: false, data: [], message: err.message };
    }
}

/**
 * Tạo sản phẩm mới (Admin only)
 * @param productData - Dữ liệu sản phẩm
 */
export const createProduct = async (productData: any): Promise<any> => {
    try {
        const res = await apiClient.post(API_PREFIX, productData);
        console.log("✅ [createProduct] Success:", res?.data);
        return res?.data || { success: false, data: null, message: "Failed to create product" };
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`❌ [createProduct] ${err.message}`);
        throw new Error(err.message);
    }
}

/**
 * Cập nhật thông tin sản phẩm (Admin only)
 * @param productData - Dữ liệu sản phẩm cần cập nhật
 */
export const updateProduct = async (productData: any): Promise<any> => {
    try {
        const id = productData.productId || productData.id;
        const res = await apiClient.put(`${API_PREFIX}/${id}`, productData);
        return res?.data || { success: false, data: null, message: "Failed to update product" };
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`❌ [updateProduct] ${err.message}`);
        throw new Error(err.message);
    }
};

/**
 * Xóa sản phẩm (Admin only)
 * @param productId - ID sản phẩm cần xóa
 * @param deletedBy - ID người thực hiện xóa
 */
export const deleteProduct = async (productId: string, deletedBy: string): Promise<any> => {
    try {
        const res = await apiClient.delete(`${API_PREFIX}/${productId}`, { 
            data: { adminId: deletedBy }
        });
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`❌ [deleteProduct] ${err.message}`);
        throw new Error(err.message);
    }
};

// Alias cho tương thích ngược
export const searchProducts = searchProduct;