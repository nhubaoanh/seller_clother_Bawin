export interface AuditLog {
  logId: string;
  tableName?: string;
  recordId?: string;
  actionType?: number; // 0 = CREATE, 1 = UPDATE, 2 = DELETE
  description?: string;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  createdAt?: Date;
}