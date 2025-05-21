import { api } from "@/lib/api"

export interface Developer {
  id: string
  name: string
  logo: string
  description: string
  projects: number
  completedProjects: number
  inProgressProjects: number
  establishedYear: number
  address?: string
  phone?: string
  email?: string
  website?: string
  properties?: {
    id: string
    title: string
    status: string
    completionDate: string
    image: string
  }[]
}

export interface DeveloperFilters {
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
  [key: string]: any
}

// Сервис для работы с застройщиками
export const DeveloperService = {
  // Получение списка застройщиков
  getDevelopers: (filters: DeveloperFilters = {}) => {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })

    return api.get<PaginatedResponse<Developer[]>>(`/developers?${queryParams.toString()}`)
  },

  // Получение детальной информации о застройщике
  getDeveloper: (id: string) => api.get<Developer>(`/developers/${id}`),
}
