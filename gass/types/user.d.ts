import { IBaseData } from "./base";
export interface IUser extends UserProfile, Role, Permission, IBaseData {
  user_id: string;
  username: string;
  password_hash: string;
  role_id: string;
  active_flag: number;
  lu_updated: Date;
  lu_user_id: string;
  online_flag: number;
  create_user_id: string;
}

export interface Role {
  role_id: string;
  role_code: string;
  role_name: string;
  description: string;
  active_flag: number;
  lu_updated: Date;
  lu_user_id: string;
}
export interface UserProfile {
  profile_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  birthday: Date;
  gender: string;
  img_ure: string;
  active_flag: number;
  lu_updated: Date;
  lu_user_id: string;
}

export interface IUserSearch {
  search_content?: string;
  pageIndex: number;
  pageSize: number;
  role_id?: string;
}




// ================= Additional Types ================= //


export interface IMessage {
  tinNhanId: string;
  nguoiGui: string;
  nguoiGuiId: string;
  noiDung: string;
  ngayGui: string;
}

// export interface IUserSearch {
//   search_content?: string;
//   pageIndex: number;
//   pageSize: number;
//   dongHoId?: string;
// }

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}
