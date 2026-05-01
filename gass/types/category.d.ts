export interface ICategory {
  category_id: string;
  category_code: string;
  category_name: string;
  description: string;
  active_flag: number;
  lu_updated: Date;
  lu_user_id: string;
}

export interface ICategorySearch {
  search_content?: string;
  pageIndex: number;
  pageSize: number;
}
