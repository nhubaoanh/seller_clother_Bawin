import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { parseApiError } from "@/lib/apiError";

const prefix = `${API_CORE}/categories`;

export const getCategories = async (): Promise<any> => {
    try {
        const res = await apiClient.get(`${prefix}`);
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[getCategories] ${err.message}`);
        return { success: false, data: [], message: err.message };
    }
}

export const getCategoryById = async (id: string): Promise<any> => {
    try {
        const res = await apiClient.get(`${prefix}/${id}`);
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[getCategoryById] ${err.message}`);
        return { success: false, data: null, message: err.message };
    }
}

export const createCategory = async (data: any): Promise<any> => {
    try {
        const res = await apiClient.post(`${prefix}`, data);
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[createCategory] ${err.message}`);
        throw new Error(err.message);
    }
}

export const updateCategory = async (data: any): Promise<any> => {
    try {
        const res = await apiClient.put(`${prefix}`, data);
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[updateCategory] ${err.message}`);
        throw new Error(err.message);
    }
}

export const deleteCategory = async (categoryId: string, deletedBy: string = "admin"): Promise<any> => {
    try {
        const res = await apiClient.delete(`${prefix}`, {
            data: { categoryId, deletedBy }
        });
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[deleteCategory] ${err.message}`);
        throw new Error(err.message);
    }
}

export const searchCategory = async (params: { pageIndex: number; pageSize: number; search_content?: string }): Promise<any> => {
    try {
        const res = await apiClient.get(`${prefix}?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}${params.search_content ? `&search=${params.search_content}` : ''}`);
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[searchCategory] ${err.message}`);
        return { success: false, data: [], message: err.message, totalItems: 0, pageCount: 0 };
    }
}