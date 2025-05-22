"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AuthService, type User } from "@/services/auth-service"
import { api } from "@/lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем наличие токена
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        // Получаем данные пользователя
        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.success) {
          // const userData = await response.json()
          // console.log("Response from /api/users/me:", response)

          setUser(response.data)
        } else {
          // Если токен недействителен, удаляем его
          localStorage.removeItem("token")
        }
      } catch (err) {
        console.error("Auth check error:", err)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Авторизация
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.login({ email, password })

      // Сохраняем токен
      localStorage.setItem("token", response?.data?.token)
      setUser(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Регистрация
  const register = async (firstName: string, lastName: string, email: string, phone: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.register({ firstName, lastName, email, phone, password })
      // Сохраняем токен
      localStorage.setItem("token", response?.data?.token)
      setUser(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Выход
  const logout = async () => {
    setLoading(true)

    try {
      await AuthService.logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      // Удаляем токен и данные пользователя
      localStorage.removeItem("token")
      setUser(null)
      setLoading(false)
    }
  }

  // Очистка ошибки
  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
