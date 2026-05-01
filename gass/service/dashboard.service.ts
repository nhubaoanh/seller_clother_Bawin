import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IDashboardParams, IDashboardResponse } from "@/types/dashboard";

const prefix = `${API_CORE}/dashboard`;

export const getDashboardStatistics = async (params: IDashboardParams): Promise<IDashboardResponse> => {
  try {
    const res = await apiClient.post(`${prefix}/statistics`, params);
    console.log("API Response:", res);
    console.log("API Response data:", res?.data);
    // Nếu data nằm trong res.data.data thì lấy res.data.data, không thì lấy res.data
    const result = res?.data?.data || res?.data;
    return result;
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};
