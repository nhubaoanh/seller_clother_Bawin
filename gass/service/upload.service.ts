import { apiClient } from "@/lib/api";
import { parseApiError } from "@/lib/apiError";

import { API_CORE } from "@/constant/config";

const prefix = `${API_CORE}/upload`;

export const uploadSingleImage = async (file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const res = await apiClient.post(`${prefix}/single`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return res?.data || { success: false, message: "Upload failed" };
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[uploadSingleImage] ${err.message}`);
        return { success: false, message: err.message };
    }
}

export const uploadMultipleImages = async (files: File[]): Promise<any> => {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        
        const res = await apiClient.post(`${prefix}/multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[uploadMultipleImages] ${err.message}`);
        throw new Error(err.message);
    }
}

export const deleteImage = async (imagePath: string): Promise<any> => {
    try {
        const res = await apiClient.delete(`${prefix}/delete`, {
            data: { imagePath }
        });
        return res?.data;
    } catch (error: any) {
        const err = parseApiError(error);
        console.error(`[deleteImage] ${err.message}`);
        throw new Error(err.message);
    }
}

// Legacy functions for backward compatibility
export const uploadFile = async (data: FormData): Promise<any> => {
    const file = data.get('file') as File;
    if (file) {
        return uploadSingleImage(file);
    }
    throw new Error('No file provided');
}

export const uploadFiles = async (data: FormData): Promise<any> => {
    const files = data.getAll('files') as File[];
    if (files.length > 0) {
        return uploadMultipleImages(files);
    }
    throw new Error('No files provided');
}