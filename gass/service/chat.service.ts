import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IChatSearch } from "@/types/chat";

const prefix = `${API_CORE}/chat`;

// Lấy danh sách chat
export const searchChats = async (data: IChatSearch): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/search`, data);
    return res?.data;
  } catch (error: any) {
    console.error("Search chats error:", error);
    return { success: true, data: [], totalItems: 0, pageCount: 0 };
  }
};

// Lấy tin nhắn của một chat
export const getChatMessages = async (chatId: string): Promise<any> => {
  try {
    const res = await apiClient.get(`${prefix}/${chatId}/messages`);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

// Gửi tin nhắn (qua API - backup cho socket)
export const sendMessageAPI = async (data: {
  chat_id: string;
  sender_id: string;
  message: string;
  lu_user_id?: string;
}): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/send`, data);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

// Tạo phòng chat mới
export const createChat = async (data: {
  customer_id: string;
  staff_id?: string;
  lu_user_id?: string;
}): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/create`, data);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

// Đóng chat
export const closeChat = async (chatId: string, luUserId?: string): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/${chatId}/close`, { lu_user_id: luUserId });
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

// Nhận chat (staff nhận tư vấn)
export const assignChat = async (chatId: string, staffId: string, luUserId?: string): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/${chatId}/assign`, { 
      staff_id: staffId,
      lu_user_id: luUserId || staffId,
    });
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};

// Lấy chat đang mở của khách hàng
export const getCustomerActiveChat = async (customerId: string): Promise<any> => {
  try {
    const res = await apiClient.get(`${prefix}/customer/${customerId}/active`);
    return res?.data;
  } catch (error: any) {
    throw error;
  }
};
