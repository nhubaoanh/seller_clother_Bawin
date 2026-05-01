export interface User {
  userId: string;
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role: number; // 0 = STAFF, 1 = CUSTOMER
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}