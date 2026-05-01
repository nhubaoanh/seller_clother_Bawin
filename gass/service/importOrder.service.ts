import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";

const prefix = `${API_CORE}/inventory`;

export const searchImportOrder = async (params: { q?: string; pageIndex: number; pageSize: number }): Promise<any> => {
  try {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    query.set('pageIndex', String(params.pageIndex));
    query.set('pageSize', String(params.pageSize));
    
    const res = await apiClient.get(`${prefix}/history?${query}`);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

export const createImportOrder = async (data: {
  variantId: string;
  quantity: number;
  purchasePrice: number;
  supplier: string;
  notes: string;
  adminId: string;
}): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/import`, data);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

export const getStockReport = async (): Promise<any> => {
  try {
    const res = await apiClient.get(`${prefix}/report`);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

// Aliases for compatibility
export const deleteImportOrder = async (id: string): Promise<any> => {
    // Inventory imports logic usually doesn't delete, but we keep it for now
    return { success: false, message: 'Deleting import history is not recommended' };
};

export const updateImportOrder = async (id: string, data: any): Promise<any> => {
    return { success: false, message: 'Import history cannot be updated' };
};
