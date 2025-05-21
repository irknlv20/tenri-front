import { api } from "@/lib/api"

export interface Property {
  id: string
  title: string
  description: string
  type: string
  price: number
  pricePerSqm: number
  location: {
    id: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  developer: {
    id: string
    name: string
    description?: string
    logo?: string
  }
  completionDate: string
  status: string
  badge?: string
  rooms: number[]
  minArea: number
  maxArea: number
  images: string[]
  features: string[]
  buildingType?: string
  ceilingHeight?: number
  finishing?: string
  heating?: string
  parking?: string
  apartments?: {
    type: string
    area: string
    price: string
  }[]
  documents?: string[]
  promotions?: string[]
  createdAt: string
  updatedAt: string
}

export interface Apartment {
  id: string
  propertyId: string
  propertyName?: string
  number: string
  rooms: number
  area: number
  livingArea?: number
  kitchenArea?: number
  floor: number
  totalFloors: number
  price: number
  pricePerSqm: number
  status: string
  layout: string
  images: string[]
  features: string[]
  direction: string
  completionDate: string
  developer?: {
    id: string
    name: string
  }
  location?: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
}

export interface PropertyFilters {
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
  type?: string
  priceMin?: number
  priceMax?: number
  rooms?: string
  areaMin?: number
  areaMax?: number
  developer?: string
  location?: string
  status?: string
}

export interface ApartmentFilters {
  page?: number
  limit?: number
  rooms?: number
  areaMin?: number
  areaMax?: number
  priceMin?: number
  priceMax?: number
  floor?: string
  status?: string
}

export interface PaginatedResponse<T> {
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
  [key: string]: any // Для разных типов данных (properties, apartments и т.д.)
}

// Сервис для работы с объектами недвижимости
export const PropertyService = {
  // Получение списка объектов недвижимости
  getProperties: (filters: PropertyFilters = {}) => {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })

    return api.get<PaginatedResponse<Property[]>>(`/properties?${queryParams.toString()}`)
  },

  // Получение детальной информации об объекте
  getProperty: (id: string) => api.get<Property>(`/properties/${id}`),

  // Получение списка квартир в ЖК
  getPropertyApartments: (id: string, filters: ApartmentFilters = {}) => {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })

    return api.get<PaginatedResponse<Apartment[]>>(`/properties/${id}/apartments?${queryParams.toString()}`)
  },

  // Получение детальной информации о квартире
  getApartment: (id: string) => api.get<Apartment>(`/apartments/${id}`),
}
