import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";

const prefix = `${API_CORE}/review`;

// Lấy tất cả đánh giá
export const getAllReviews = async (pageIndex: number = 1, pageSize: number = 20): Promise<any> => {
  try {
    const url = `${prefix}/all?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    console.log("Calling API:", url);
    const res = await apiClient.get(url);
    console.log("API Response:", res?.data);
    return res?.data;
  } catch (error: any) {
    console.error("Get all reviews error:", error);
    return { success: true, data: [], totalItems: 0 };
  }
};

// Phản hồi đánh giá
export const replyToReview = async (reviewId: string, staffId: string, replyContent: string): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/${reviewId}/reply`, {
      staff_id: staffId,
      reply_content: replyContent,
      lu_user_id: staffId,
    });
    return res?.data;
  } catch (error: any) {
    console.error("Reply to review error:", error);
    throw error;
  }
};
