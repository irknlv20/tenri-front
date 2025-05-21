import { api } from "@/lib/api"

export interface Promotion {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  developer: {
    id: string
    name: string
    logo?: string
  }
  property: {
    id: string
    title: string
    image?: string
  }
  image: string
  discountPercent: number
  conditions: string
  terms?: string
  contactPhone?: string
  contactEmail?: string
}

export interface PromotionFilters {
  page?: number
  limit?: number
  developer?: string
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

// Сервис для работы с акциями и скидками
export const PromotionService = {
  // Получение списка акций и скидок
  getPromotions: (filters: PromotionFilters = {}) => {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })

    return api.get<PaginatedResponse<Promotion[]>>(`/promotions?${queryParams.toString()}`)
  },

  // Получение детальной информации об акции
  getPromotion: (id: string) => api.get<Promotion>(`/promotions/${id}`),
}
