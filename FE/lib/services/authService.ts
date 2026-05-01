/**
 * authService.ts
 * Gọi Next.js API routes: /api/auth/...
 * (Next.js xử lý JWT cookie, không gọi thẳng BE)
 */

import { localClient } from './apiClient';

export const authService = {
  /** Lấy thông tin user đang login */
  me() {
    return localClient.get('/auth/me');
  },

  login(email: string, password: string) {
    return localClient.post('/auth/login', { email, password });
  },

  register(data: { name: string; email: string; password: string; phone?: string }) {
    return localClient.post('/auth/register', data);
  },

  logout() {
    return localClient.post('/auth/logout', {});
  },
};
