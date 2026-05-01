import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IInvoice, IInvoiceSearch } from "@/types/order";

const prefix = `${API_CORE}/orders`;

export const searchInvoice = async (data: IInvoiceSearch): Promise<any> => {
  try {
    // JM Fashion admin API uses GET /admin/all
    const res = await apiClient.get(`${prefix}/admin/all`);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateInvoiceStatus = async (data: { 
  orderId: string; 
  status: number;
  adminId: string;
}): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/admin/update-status`, data);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteInvoice = async (id: string): Promise<any> => {
  try {
    const res = await apiClient.delete(`${prefix}/${id}`);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};