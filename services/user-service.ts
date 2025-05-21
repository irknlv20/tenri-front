import { api } from "@/lib/api"
import type { User } from "./auth-service"

export interface UserProfile extends User {
  address?: string
  documents?: {
    passportNumber?: string
    passportIssueDate?: string
    passportIssuedBy?: string
    iin?: string
  }
}

export interface UpdateProfileData {
  name?: string
  phone?: string
  address?: string
  documents?: {
    passportNumber?: string
    passportIssueDate?: string
    passportIssuedBy?: string
    iin?: string
  }
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

// Сервис для работы с пользователями
export const UserService = {
  // Получение данных текущего пользователя
  getCurrentUser: () => api.get<UserProfile>("/users/me"),

  // Обновление профиля пользователя
  updateProfile: (data: UpdateProfileData) =>
    api.put<{ success: boolean; message: string; user: UserProfile }>("/users/me", data),

  // Изменение пароля
  changePassword: (data: ChangePasswordData) =>
    api.put<{ success: boolean; message: string }>("/users/me/password", data),
}
