import { clear } from "console";
import { LOGIN_URL } from "@/urls";
import { User } from "lucide-react";

interface UserData {
// Quyền thao tác
  user_id: string;
  username: string;
  online_flag: number;
  full_name: string;
  email: string;
  phone:string;
  address: string;
  birthday: Date;
  gender: string;
  img_ure: string;
  role_id: number;
  role_code: string;
  role_name: string;
  permission_code: string;
  permission_name: string;
}

const storagePrefix = "SA_";
const storage = {
  getToken: () => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}token`) as string
    );
  },

  setToken: (token: string) => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },

  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },

  setUser: (userData: UserData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${storagePrefix}user`, JSON.stringify(userData));
    }
  },

  getUser: (): UserData | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(`${storagePrefix}user`);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${storagePrefix}user`);
    }
  },
  clearAll: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${storagePrefix}token`);
    }
  }, // GET FUNCTIONS (Menu Tree)
};

export default storage;

export const clearLogout = () => {
  storage.clearToken();
};
