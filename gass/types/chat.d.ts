export interface IChat {
  chat_id: string;
  customer_id: string;
  staff_id: string | null;
  started_at: Date | string;
  closed_at: Date | string | null;
  active_flag: number;
  lu_updated: Date | string;
  lu_user_id: string;
  // Joined fields
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  staff_name?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

export interface IChatMessage {
  message_id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  sent_at: Date | string;
  active_flag: number;
  lu_updated: Date | string;
  lu_user_id: string;
  // Joined fields
  sender_name?: string;
  sender_role?: "staff" | "customer";
}

export interface IChatSearch {
  pageIndex: number;
  pageSize: number;
  search_content?: string;
  status?: "open" | "closed" | "all";
}
