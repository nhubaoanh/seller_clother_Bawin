import { API_CORE } from "../constant/config";
import { apiClient } from "@/lib/api";
import { IUser, IUserSearch } from "@/types/user";
import { parseApiError } from "@/lib/apiError";

const prefix = `${API_CORE}/user`;

interface LoginProps {
  username: string;
  password: string;
}

export const loginService = async (data: LoginProps): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/login`, data);
    console.log("Login response:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("Login error full:", error);
    console.log("Login error response:", error.response?.data);
    const err = parseApiError(error);
    console.error(`[loginService] ${err.message}`);
    throw new Error(err.message);
  }
};

export const autherization = async (token: string): Promise<any> => {
  try {
    const res = await apiClient.get(`${prefix}/authorize/${token}`);
    return res?.data;
  } catch (error: any) {
    const err = parseApiError(error);
    console.error(`[autherization] ${err.message}`);
    throw new Error(err.message);
  }
};

export const getUsers = async (data: IUserSearch): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/search`, data);
    // Nếu không có kết quả, trả về mảng rỗng thay vì throw error
    if (res?.data?.success === false || !res?.data?.data) {
      return { success: true, data: [], totalItems: 0, pageCount: 0 };
    }
    return res?.data;
  } catch (error: any) {
    const err = parseApiError(error);
    // Không log error cho trường hợp không có kết quả tìm kiếm (đây là bình thường)
    const isEmptyResult = err.message?.includes("Không tồn tại kết quả") || 
                          err.message?.includes("không tìm thấy");
    if (!isEmptyResult) {
      console.error(`[getUsers] ${err.message}`);
    }
    return { success: true, data: [], totalItems: 0, pageCount: 0 };
  }
};

export const createUser = async (data: Partial<IUser>): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/create`, data);
    return res?.data;
  } catch (error: any) {
    const err = parseApiError(error);
    console.error(`[createUser] ${err.message}`);
    throw new Error(err.message);
  }
};

export const updateUser = async (data: Partial<IUser>): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/update`, data);
    return res?.data;
  } catch (error: any) {
    const err = parseApiError(error);
    console.error(`[updateUser] ${err.message}`);
    throw new Error(err.message);
  }
};

export const UpdateMyProfile = async (data: IUser): Promise<any> => {
  try {
    const res = await apiClient.post(`${prefix}/update`, data);
    return res?.data;
  } catch (error: any) {
    const err = parseApiError(error);
    console.error(`[updateUser] ${err.message}`);
    throw new Error(err.message);
  }
};

export const deleteUser = async (userIds: string[], updatedById?: string): Promise<any> => {
  try {
    // Backend expects: { list_json: [{nguoiDungId: "..."}], updated_by_id: "..." }
    const list_json = userIds.map(id => ({ user_id: id }));
    const res = await apiClient.post(`${prefix}/delete`, { 
      list_json, 
      updated_by_id: updatedById || "system" 
    });
    return res?.data;
  } catch (error: any) {
    const err = parseApiError(error);
    console.error(`[deleteUser] ${err.message}`);
    throw new Error(err.message);
  }
};

export const sighInService = async (data: { username: string; password: string }): Promise<any> => {
  try {
    // Map sang field name backend expect
    const payload = {
      username: data.username,
      password_hash: data.password,
    };
    const res = await apiClient.post(`${prefix}/signup`, payload);
    return res.data;
  } catch (error: any) {
    const err = parseApiError(error);
    console.error(`[sighInService] ${err.message}`);
    throw new Error(err.message);
  }
};

export const resetPasswordUser = async (data: IUser): Promise<any> => {
  try {
    const res = await apiClient?.post(`${prefix}/reset-password`, data);
    return res?.data;
  } catch (error: any) {
    const err = parseApiError(error);
    console.error(`[resetPasswordUser] ${err.message}`);
    throw new Error(err.message);
  }
};

export const checkUsernameExist = async (value: string): Promise<any> => {
  if (!value || !value.trim()) {
    return { success: false, exists: false };
  }
  try {
    const res = await apiClient.post(`${prefix}/checkuser`, { username: value });
    return res.data;
  } catch (error: any) {
    // Không log error - chỉ return false để không block flow
    return { success: false, exists: false };
  }
};
