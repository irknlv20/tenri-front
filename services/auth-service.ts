import { api } from "@/lib/api"

// Типы для аутентификации
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user: User
  token: string
  message?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  createdAt: string
}

// Сервис для работы с аутентификацией
export const AuthService = {
  // Регистрация пользователя
  register: (data: RegisterData) => api.post<AuthResponse>("/auth/register", data),

  // Авторизация пользователя
  login: (data: LoginData) => api.post<AuthResponse>("/auth/login", data),

  // Выход из системы
  logout: () => api.post<{ success: boolean; message: string }>("/auth/logout"),

  // Запрос на сброс пароля
  requestPasswordReset: (email: string) =>
    api.post<{ success: boolean; message: string }>("/auth/reset-password/request", { email }),

  // Сброс пароля
  resetPassword: (token: string, newPassword: string) =>
    api.post<{ success: boolean; message: string }>("/auth/reset-password/confirm", {
      token,
      newPassword,
    }),
}
