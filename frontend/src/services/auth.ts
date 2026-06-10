import { api } from "./api";

export type AdminUser = { login: string };

export const authService = {
  login: (login: string, password: string) =>
    api.post<AdminUser>("/auth/login", { login, password }),
  logout: () => api.post<void>("/auth/logout"),
  me: () => api.get<AdminUser>("/auth/me"),
};
