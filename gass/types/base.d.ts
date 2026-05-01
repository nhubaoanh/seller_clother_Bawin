export interface IBaseData {
    active_flag?: number;
    lu_user_id?: string;
}

export type IBaseUpload = {
  result: boolean;
  path: string;
  message: string;
  success: boolean;
};

// Upload nhiều file
export type IBaseUploadMulti = {
  result: boolean;
  paths: string[];
  message: string;
  success: boolean;
};
