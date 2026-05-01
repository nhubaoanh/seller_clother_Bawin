import { IBaseData } from "./base";

export interface IRole extends IBaseData {
  roleId: string;
  roleCode: string;
  roleName: string;
  active_flag: number;
  createDate: Date;
  nguoiTaoId: string;
  lu_updated: Date;
  lu_user_id: string;
}