import { api } from "@/lib/api"

export interface UserProperty {
  id: string
  title: string
  status: string
  image: string
  address: string
  area: number
  floor: number
  completionDate: string
  documents: number
  payments: number
  price?: number
  pricePerSqm?: number
  developer?: {
    id: string
    name: string
  }
}

export interface UserPropertyDetail extends UserProperty {
  documents: {
    id: string
    title: string
    type: string
    date: string
    status: string
    url: string
  }[]
  payments: {
    id: string
    date: string
    amount: number
    type: string
    status: string
  }[]
  timeline: {
    date: string
    event: string
    description: string
    status: string
  }[]
}

export interface Favorite {
  id: string
  propertyId: string
  title: string
  image: string
  address: string
  area: number
  floor: number
  price: number
  pricePerSqm: number
  completionDate: string
  developer: string
  addedDate: string
  badge?: string
  data: any
}

export interface ComparisonItem {
  id: string
  propertyId: string
  title: string
  image: string
  address: string
  area: number
  floor: number
  price: number
  pricePerSqm: number
  completionDate: string
  developer: string
  ceilingHeight: number
  finishing: string
  windowView: string
  parking: string
  heating: string
  buildingType: string
}

export interface Booking {
  id: string
  propertyId: string
  title: string
  status: string
  image: string
  address: string
  area: number
  floor: number
  price: number
  pricePerSqm: number
  bookingDate: string
  expiryDate: string
  bookingFee: number
  nextStep: string
}

export interface Mortgage {
  id: string
  propertyId: string
  title: string
  status: string
  image: string
  address: string
  bank: string
  program: string
  amount: number
  term: number
  rate: number
  monthlyPayment: number
  startDate: string
  documents: number
}

export interface MortgageSchedule {
  mortgageId: string
  amount: number
  term: number
  rate: number
  monthlyPayment: number
  totalPayment: number
  overpayment: number
  schedule: {
    month: number
    date: string
    payment: number
    principalPayment: number
    interestPayment: number
    remainingDebt: number
  }[]
}

export interface SupportRequest {
  id: string
  title: string
  status: string
  property: {
    id: string
    title: string
    image: string
    address: string
  }
  createdDate: string
  lastUpdate: string
  manager: string
  messages: number
  nextAction: string
}

export interface SupportMessage {
  id: string
  sender: {
    id: string
    name: string
    role: string
  }
  text: string
  date: string
  attachments: {
    id: string
    name: string
    url: string
    size: string
  }[]
}

export interface Document {
  id: string
  title: string
  type: string
  property: {
    id: string
    title: string
  }
  date: string
  status: string
  size: string
  format: string
  url: string
}

export interface RequiredDocument {
  id: string
  title: string
  type: string
  property: {
    id: string
    title: string
  }
  deadline: string
  status: string
  description: string
}

export interface SignatureInfo {
  hasSignature: boolean
  signatureInfo?: {
    id: string
    issuer: string
    validFrom: string
    validTo: string
    status: string
  }
  signedDocuments: number
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  category: string
  providers: {
    id: string
    name: string
    phone: string
    website: string
  }[]
}

export interface ServiceDetail extends Service {
  content: string
  providers: {
    id: string
    name: string
    description: string
    phone: string
    email: string
    website: string
    address: string
    logo: string
  }[]
}

export interface ServiceOrder {
  serviceId: string
  providerId: string
  propertyId?: string
  description?: string
  preferredDate?: string
}

const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Helper to create auth header
const getAuthHeader = (): Record<string, string> => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Сервис для работы с личным кабинетом
export const CabinetService = {
  // Получение списка объектов пользователя
  getUserProperties: () => api.get<{ properties: UserProperty[] }>("/users/me/properties", { headers: getAuthHeader() }),

  // Получение детальной информации об объекте пользователя
  getUserProperty: (id: string) => api.get<UserPropertyDetail>(`/users/me/properties/${id}`),

  // Получение списка избранных объектов
  getFavorites: () => api.get<{ favorites: Favorite[] }>("/users/me/favorites"),

  // Добавление объекта в избранное
  addToFavorites: (propertyId: string) =>
    api.post<{ success: boolean; message: string; favoriteId: string }>("/users/me/favorites", { propertyId }),

  // Удаление объекта из избранного
  removeFromFavorites: (id: string) => api.delete<{ success: boolean; message: string }>(`/users/me/favorites/${id}`),

  // Получение списка объектов для сравнения
  getComparison: () => api.get<{ comparison: ComparisonItem[] }>("/users/me/comparison"),

  // Добавление объекта в сравнение
  addToComparison: (propertyId: string) =>
    api.post<{ success: boolean; message: string; comparisonId: string }>("/users/me/comparison", { propertyId }),

  // Удаление объекта из сравнения
  removeFromComparison: (id: string) => api.delete<{ success: boolean; message: string }>(`/users/me/comparison/${id}`),

  // Получение списка бронирований
  getBookings: (status?: string) => {
    const queryParams = new URLSearchParams()

    if (status) {
      queryParams.append("status", status)
    }

    return api.get<{ bookings: Booking[] }>(`/users/me/bookings?${queryParams.toString()}`)
  },

  // Создание бронирования
  createBooking: (propertyId: string, apartmentId: string) =>
    api.post<{ success: boolean; message: string; booking: Booking }>("/users/me/bookings", {
      propertyId,
      apartmentId,
    }, { headers: getAuthHeader() }),

  // Отмена бронирования
  cancelBooking: (id: string) => api.put<{ success: boolean; message: string }>(`/users/me/bookings/${id}/cancel`),

  // Продление бронирования
  extendBooking: (id: string) =>
    api.put<{ success: boolean; message: string; newExpiryDate: string; paymentLink: string }>(
      `/users/me/bookings/${id}/extend`,
    ),

  // Получение списка ипотечных заявок
  getMortgages: (status?: string) => {
    const queryParams = new URLSearchParams()

    if (status) {
      queryParams.append("status", status)
    }

    return api.get<{ mortgages: Mortgage[] }>(`/users/me/mortgages?${queryParams.toString()}`)
  },

  // Создание ипотечной заявки
  createMortgage: (data: {
    propertyId: string
    apartmentId: string
    bankId: string
    programId: string
    amount: number
    initialPayment: number
    term: number
    monthlyIncome: number
  }) => api.post<{ success: boolean; message: string; mortgageId: string }>("/users/me/mortgages", data),

  // Получение графика платежей по ипотеке
  getMortgageSchedule: (id: string) => api.get<MortgageSchedule>(`/users/me/mortgages/${id}/schedule`),

  // Получение списка запросов поддержки
  getSupportRequests: (status?: string) => {
    const queryParams = new URLSearchParams()

    if (status) {
      queryParams.append("status", status)
    }

    return api.get<{ requests: SupportRequest[] }>(`/users/me/support?${queryParams.toString()}`)
  },

  // Создание запроса поддержки
  createSupportRequest: (data: {
    title: string
    propertyId?: string
    message: string
  }) => api.post<{ success: boolean; message: string; requestId: string }>("/users/me/support", data),

  // Получение сообщений запроса поддержки
  getSupportMessages: (id: string) =>
    api.get<{ requestId: string; title: string; status: string; messages: SupportMessage[] }>(
      `/users/me/support/${id}/messages`,
    ),

  // Отправка сообщения в запрос поддержки
  sendSupportMessage: (id: string, text: string, attachments?: File[]) => {
    const formData = new FormData()
    formData.append("text", text)

    if (attachments) {
      attachments.forEach((file) => {
        formData.append("attachments", file)
      })
    }

    return api.uploadForm<{ success: boolean; message: string; messageId: string }>(
      `/users/me/support/${id}/messages`,
      formData,
    )
  },

  // Получение списка документов
  getDocuments: (
    filters: {
      type?: string
      status?: string
      propertyId?: string
    } = {},
  ) => {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })

    return api.get<{ documents: Document[]; requiredDocuments: RequiredDocument[] }>(
      `/users/me/documents?${queryParams.toString()}`,
    )
  },

  // Загрузка документа
  uploadDocument: (data: {
    title: string
    type: string
    propertyId?: string
    requiredDocumentId?: string
    file: File
  }) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("type", data.type)

    if (data.propertyId) {
      formData.append("propertyId", data.propertyId)
    }

    if (data.requiredDocumentId) {
      formData.append("requiredDocumentId", data.requiredDocumentId)
    }

    formData.append("file", data.file)

    return api.uploadForm<{ success: boolean; message: string; documentId: string }>("/users/me/documents", formData)
  },

  // Подписание документа
  signDocument: (id: string) =>
    api.put<{ success: boolean; message: string; signatureId: string; signatureDate: string }>(
      `/users/me/documents/${id}/sign`,
    ),

  // Получение информации об электронной подписи
  getSignatureInfo: () => api.get<SignatureInfo>("/users/me/signature"),

  // Получение списка полезных сервисов
  getServices: (category?: string) => {
    const queryParams = new URLSearchParams()

    if (category) {
      queryParams.append("category", category)
    }

    return api.get<{ services: Service[] }>(`/services?${queryParams.toString()}`)
  },

  // Получение детальной информации о сервисе
  getService: (id: string) => api.get<ServiceDetail>(`/services/${id}`),

  // Заказ сервиса
  orderService: (data: ServiceOrder) =>
    api.post<{ success: boolean; message: string; serviceOrderId: string }>("/users/me/services", data),
}

export const updatePurchaseStep = async (propertyId: string, step: string) => {
  return api.post("/users/me/purchases/update-step", {
    propertyId,
    step,
  }, { headers: getAuthHeader() });
};

export const createPurchase = async (propertyId: string) => {
  return api.post("/users/me/purchases/create", { propertyId }, { headers: getAuthHeader() });
};

export const getCurrentPurchaseStep = async (propertyId: string): Promise<string> => {
  const response = await api.post("/users/me/purchases/current-step", { propertyId }, { headers: getAuthHeader() });
  // @ts-ignore
  return response.data.step;
};

export const getDocumentStatus = async (propertyId: string): Promise<string> => {
  const response = await api.post("/users/me/purchases/document-status", { propertyId }, { headers: getAuthHeader() });
  // @ts-ignore
  return response.data.documentStatus; // "waiting", "uploaded", "verified"
};

