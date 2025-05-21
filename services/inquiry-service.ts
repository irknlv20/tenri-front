import { api } from "@/lib/api"

export interface CallbackInquiry {
  name: string
  phone: string
  propertyId?: string
  message?: string
}

export interface MortgageInquiry {
  name: string
  phone: string
  email?: string
  propertyId?: string
  apartmentId?: string
  price?: number
  initialPayment?: number
  term?: number
  monthlyPayment?: number
  message?: string
}

export interface MortgageCalculation {
  price: number
  initialPayment: number
  term: number
  rate: number
}

export interface MortgageResult {
  monthlyPayment: number
  totalPayment: number
  overpayment: number
  loanAmount: number
  initialPaymentPercent: number
  schedule: {
    month: number
    payment: number
    principalPayment: number
    interestPayment: number
    remainingDebt: number
  }[]
}

export interface Bank {
  id: string
  name: string
  logo: string
  programs: {
    id: string
    name: string
    description: string
    rate: number
    minInitialPayment: number
    maxTerm: number
    maxAmount: number
  }[]
}

// Сервис для работы с запросами клиентов
export const InquiryService = {
  // Отправка заявки на обратный звонок
  sendCallbackInquiry: (data: CallbackInquiry) =>
    api.post<{ success: boolean; message: string; inquiryId: string }>("/inquiries/callback", data),

  // Отправка заявки на ипотеку
  sendMortgageInquiry: (data: MortgageInquiry) =>
    api.post<{ success: boolean; message: string; inquiryId: string }>("/inquiries/mortgage", data),

  // Расчет ипотеки
  calculateMortgage: (data: MortgageCalculation) => api.post<MortgageResult>("/mortgage/calculate", data),

  // Получение списка банков и ипотечных программ
  getBanks: (propertyId?: string) => {
    const queryParams = new URLSearchParams()

    if (propertyId) {
      queryParams.append("propertyId", propertyId)
    }

    return api.get<{ banks: Bank[] }>(`/mortgage/banks?${queryParams.toString()}`)
  },
}
