import { API_CORE } from "../constant/config";
import { apiClient } from "@/lib/api";

const prefix = `${API_CORE}/ai`;

export interface AIChatRequest {
  message: string;
  dongHoId?: string;
}

export interface AIChatResponse {
  success: boolean;
  data?: string;
  message?: string;
}

export const chatWithAI = async (message: string, dongHoId?: string): Promise<AIChatResponse> => {
  try {
    const res = await apiClient.post(`${prefix}/chat`, { message, dongHoId });
    return res.data;
  } catch (error: any) {
    console.error("[chatWithAI]", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Lỗi kết nối AI"
    };
  }
};
