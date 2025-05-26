// Utility functions for localStorage operations
export const LocalStorageKeys = {
    FAVORITES: "tenri_favorites",
    COMPARISON: "tenri_comparison",
    BOOKINGS: "tenri_bookings",
    PURCHASES: "tenri_purchases", // Новое - отслеживание покупок
    DOCUMENTS: "tenri_documents",
    PAYMENTS: "tenri_payments",
    MORTGAGE_APPLICATIONS: "tenri_mortgage_applications",
} as const

export interface StoredFavorite {
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
}

export interface StoredComparison {
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
    addedDate: string
}

export interface StoredBooking {
    id: string
    propertyId: string
    apartmentId: string
    title: string
    status: "active" | "expired" | "cancelled" | "converted" // добавили converted
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
    apartment: {
        id: string
        rooms: number
        building: string
    }
}

// Новый интерфейс для покупок
export interface StoredPurchase {
    id: string
    bookingId: string
    propertyId: string
    apartmentId: string
    title: string
    image: string
    address: string
    area: number
    floor: number
    price: number
    pricePerSqm: number
    apartment: {
        id: string
        rooms: number
        building: string
    }
    status: "in_progress" | "completed" | "cancelled"
    currentStep: number
    totalSteps: number
    paymentMethod: "cash" | "mortgage" | "installment"
    startDate: string
    completionDate?: string
    managerName: string
    estimatedCompletion: string
    steps: {
        id: number
        title: string
        status: "pending" | "in_progress" | "completed" | "blocked"
        completedDate?: string
        description: string
    }[]
    nextAction: string
}

export interface StoredDocument {
    id: string
    title: string
    type: "passport" | "income" | "contract" | "mortgage" | "insurance" | "other"
    purchaseId?: string // изменили с bookingId на purchaseId
    propertyId?: string
    status: "required" | "uploaded" | "verified" | "signed" | "rejected"
    uploadDate?: string
    verificationDate?: string
    signDate?: string
    deadline?: string
    description: string
    fileName?: string
    fileSize?: number
    rejectionReason?: string
}

export interface StoredPayment {
    id: string
    purchaseId?: string // сделаем опциональным
    bookingId?: string // добавим для обратной совместимости
    propertyId: string
    type: "booking_fee" | "initial_payment" | "installment" | "mortgage" | "final_payment"
    amount: number
    dueDate: string
    paidDate?: string
    status: "pending" | "paid" | "overdue" | "cancelled"
    description: string
    paymentMethod?: string
    transactionId?: string
}

export interface StoredMortgageApplication {
    id: string
    propertyId: string
    purchaseId: string // изменили с bookingId на purchaseId
    bankId: string
    bankName: string
    program: string
    amount: number
    initialPayment: number
    term: number
    rate: number
    monthlyPayment: number
    monthlyIncome: number
    status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
    submissionDate?: string
    approvalDate?: string
    rejectionReason?: string
    documents: string[] // document IDs
}

// Generic localStorage operations
export const localStorage = {
    get: <T>(key: string): T[] => {
        if (typeof window === 'undefined') return []
        try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : []
        } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error)
            return []
        }
    },

  set: <T>(key: string, value: T[]): void => {
    if (typeof window === 'undefined') return
      try {
      window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error)
      }
  },

  add: <T extends { id: string }>(key: string, item: T): void => {
    const items = localStorage.get<T>(key)
    const exists = items.find(existing => existing.id === item.id)
      if (!exists) {
      items.push(item)
          localStorage.set(key, items)
      }
  },

  remove: <T extends { id: string }>(key: string, id: string): void => {
    const items = localStorage.get<T>(key)
    const filtered = items.filter(item => item.id !== id)
    localStorage.set(key, filtered)
  },

      update: <T extends { id: string }>(key: string, id: string, updates: Partial<T>): void => {
    const items = localStorage.get<T>(key)
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...updates }
        localStorage.set(key, items)
    }
},

  clear: (key: string): void => {
    if (typeof window === 'undefined') return
      try {
      window.localStorage.removeItem(key)
      } catch (error) {
      console.error(`Error clearing localStorage key ${key}:`, error)
    }
  }
}

// Existing services (FavoritesService, ComparisonService, BookingsService remain the same)
export const FavoritesService = {
  getAll: (): StoredFavorite[] => localStorage.get<StoredFavorite>(LocalStorageKeys.FAVORITES),

  add: (property: any): string => {
    const id = `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const favorite: StoredFavorite = {
      id,
      propertyId: property.id,
      title: property.name || property.title,
      image: property.image,
      address: property.address,
      area: property.area || 0,
      floor: property.floor || 0,
      price: property.price,
      pricePerSqm: property.pricePerSqm,
      completionDate: property.endDate || property.completionDate,
      developer: property.developer?.name || property.developer,
      addedDate: new Date().toISOString(),
      badge: property.badge
    }
    localStorage.add(LocalStorageKeys.FAVORITES, favorite)
    return id
  },

  remove: (id: string): void => {
    localStorage.remove<StoredFavorite>(LocalStorageKeys.FAVORITES, id)
  },

  removeByPropertyId: (propertyId: string): void => {
    const favorites = localStorage.get<StoredFavorite>(LocalStorageKeys.FAVORITES)
    const filtered = favorites.filter(fav => fav.propertyId !== propertyId)
    localStorage.set(LocalStorageKeys.FAVORITES, filtered)
  },

  isInFavorites: (propertyId: string): boolean => {
    const favorites = localStorage.get<StoredFavorite>(LocalStorageKeys.FAVORITES)
    return favorites.some(fav => fav.propertyId === propertyId)
  },

  getFavoriteByPropertyId: (propertyId: string): StoredFavorite | null => {
    const favorites = localStorage.get<StoredFavorite>(LocalStorageKeys.FAVORITES)
    return favorites.find(fav => fav.propertyId === propertyId) || null
  }
}

export const ComparisonService = {
  getAll: (): StoredComparison[] => localStorage.get<StoredComparison>(LocalStorageKeys.COMPARISON),

  add: (property: any): string => {
    const items = localStorage.get<StoredComparison>(LocalStorageKeys.COMPARISON)
    if (items.length >= 4) {
      throw new Error('Максимум 4 объекта для сравнения')
    }
    
    const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          const comparison: StoredComparison = {
              id,
              propertyId: property.id,
              title: property.name || property.title,
              image: property.image,
      address: property.address,
      area: property.area || 0,
          floor: property.floor || 0,
              price: property.price,
              pricePerSqm: property.pricePerSqm,
              completionDate: property.endDate || property.completionDate,
              developer: property.developer?.name || property.developer,
              ceilingHeight: property.ceilingHeight || 2.7,
              finishing: property.finishing || 'Без отделки',
              windowView: property.windowView || 'Во двор',
              parking: property.parking || 'Нет',
              heating: property.heating || 'Центральное',
              buildingType: property.buildingType || 'Монолит',
              addedDate: new Date().toISOString()
      }
          localStorage.add(LocalStorageKeys.COMPARISON, comparison)
          return id
      },

      remove: (id: string): void => {
          localStorage.remove<StoredComparison>(LocalStorageKeys.COMPARISON, id)
      },

          removeByPropertyId: (propertyId: string): void => {
          const items = localStorage.get<StoredComparison>(LocalStorageKeys.COMPARISON)
          const filtered = items.filter(item => item.propertyId !== propertyId)
    localStorage.set(LocalStorageKeys.COMPARISON, filtered)
      },

          isInComparison: (propertyId: string): boolean => {
          const items = localStorage.get<StoredComparison>(LocalStorageKeys.COMPARISON)
          return items.some(item => item.propertyId === propertyId)
      },

  clear: (): void => {
    localStorage.clear(LocalStorageKeys.COMPARISON)
  }
  }

export const BookingsService = {
    getAll: (): StoredBooking[] => localStorage.get<StoredBooking>(LocalStorageKeys.BOOKINGS),

  getByStatus: (status: 'active' | 'expired' | 'cancelled' | 'converted'): StoredBooking[] => {
    const bookings = localStorage.get<StoredBooking>(LocalStorageKeys.BOOKINGS)
    return bookings.filter(booking => booking.status === status)
},

  add: (property: any, apartment: any): string => {
      const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const bookingDate = new Date()
    const expiryDate = new Date(bookingDate.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

      const booking: StoredBooking = {
          id,
          propertyId: property.id,
          apartmentId: apartment.id,
          title: property.name || property.title,
          status: 'active',
          image: property.image,
          address: property.address,
      area: apartment.area,
          floor: apartment.floor,
          price: apartment.price,
          pricePerSqm: apartment.pricePerSqm,
          bookingDate: bookingDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          bookingFee: 50000,
          nextStep: 'Просмотр квартиры и принятие решения о покупке',
          apartment: {
          id: apartment.id,
              rooms: apartment.rooms,
              building: apartment.building || 'A'
      }
  }
      localStorage.add(LocalStorageKeys.BOOKINGS, booking)
      return id
  },

      cancel: (id: string): void => {
    localStorage.update<StoredBooking>(LocalStorageKeys.BOOKINGS, id, {
        status: 'cancelled',
        nextStep: 'Бронирование отменено'
    })
},

    extend: (id: string): void => {
    const newExpiryDate = new Date()
    newExpiryDate.setDate(newExpiryDate.getDate() + 7)
    localStorage.update<StoredBooking>(LocalStorageKeys.BOOKINGS, id, {
        expiryDate: newExpiryDate.toISOString()
    })
},

  convertToPurchase: (id: string): void => {
      localStorage.update<StoredBooking>(LocalStorageKeys.BOOKINGS, id, {
          status: 'converted',
          nextStep: 'Бронирование конвертировано в процесс покупки'
      })
  },

      markExpired: (): void => {
    const bookings = localStorage.get<StoredBooking>(LocalStorageKeys.BOOKINGS)
    const now = new Date()

    bookings.forEach(booking => {
        if (booking.status === 'active' && new Date(booking.expiryDate) < now) {
            localStorage.update<StoredBooking>(LocalStorageKeys.BOOKINGS, booking.id, {
                status: 'expired',
                nextStep: 'Бронирование истекло'
            })
        }
    })
},

    getById: (id: string): StoredBooking | null => {
    const bookings = localStorage.get<StoredBooking>(LocalStorageKeys.BOOKINGS)
    return bookings.find(booking => booking.id === id) || null
}
}

// Новый сервис для покупок
export const PurchasesService = {
    getAll: (): StoredPurchase[] => localStorage.get<StoredPurchase>(LocalStorageKeys.PURCHASES),

    getByStatus: (status: 'in_progress' | 'completed' | 'cancelled'): StoredPurchase[] => {
        const purchases = localStorage.get<StoredPurchase>(LocalStorageKeys.PURCHASES)
        return purchases.filter(purchase => purchase.status === status)
    },

    createFromBooking: (booking: StoredBooking, paymentMethod: 'cash' | 'mortgage' | 'installment'): string => {
        const id = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        const purchase: StoredPurchase = {
            id,
            bookingId: booking.id,
            propertyId: booking.propertyId,
            apartmentId: booking.apartmentId,
            title: booking.title,
            image: booking.image,
            address: booking.address,
            area: booking.area,
            floor: booking.floor,
            price: booking.price,
            pricePerSqm: booking.pricePerSqm,
            apartment: booking.apartment,
            status: 'in_progress',
            currentStep: 1,
            totalSteps: 7,
            paymentMethod,
            startDate: new Date().toISOString(),
            managerName: 'Алия Сериковна',
            estimatedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            steps: [
                { id: 1, title: 'Подтверждение', status: 'completed', completedDate: new Date().toISOString(), description: 'Намерения подтверждены' },
                { id: 2, title: 'Документы', status: 'in_progress', description: 'Загрузка и проверка документов' },
                { id: 3, title: 'Ипотека', status: 'pending', description: 'Оформление ипотечного кредита' },
                { id: 4, title: 'Предварительный договор', status: 'pending', description: 'Подписание предварительного договора' },
                { id: 5, title: 'Платежи', status: 'pending', description: 'Внесение платежей по графику' },
                { id: 6, title: 'Основной договор', status: 'pending', description: 'Подписание основного договора' },
                { id: 7, title: 'Получение ключей', status: 'pending', description: 'Передача квартиры и ключей' }
            ],
            nextAction: 'Загрузите необходимые документы'
        }

        localStorage.add(LocalStorageKeys.PURCHASES, purchase)

        // Конвертируем бронирование
        BookingsService.convertToPurchase(booking.id)

        return id
    },

    updateStep: (id: string, stepId: number, status: 'pending' | 'in_progress' | 'completed' | 'blocked'): void => {
        const purchases = localStorage.get<StoredPurchase>(LocalStorageKeys.PURCHASES)
        const purchase = purchases.find(p => p.id === id)

        if (purchase) {
            const step = purchase.steps.find(s => s.id === stepId)
            if (step) {
                step.status = status
                if (status === 'completed') {
                    step.completedDate = new Date().toISOString()
                    purchase.currentStep = Math.min(stepId + 1, purchase.totalSteps)

                    // Обновляем следующее действие
                    const nextStep = purchase.steps.find(s => s.status === 'pending')
                    if (nextStep) {
                        nextStep.status = 'in_progress'
                        purchase.nextAction = `Выполните: ${nextStep.title}`
                    } else {
                        purchase.status = 'completed'
                        purchase.completionDate = new Date().toISOString()
                        purchase.nextAction = 'Процесс покупки завершен'
                    }
                }
            }
            localStorage.set(LocalStorageKeys.PURCHASES, purchases)
        }
    },

    getById: (id: string): StoredPurchase | null => {
        const purchases = localStorage.get<StoredPurchase>(LocalStorageKeys.PURCHASES)
        return purchases.find(purchase => purchase.id === id) || null
    },

    getByBookingId: (bookingId: string): StoredPurchase | null => {
        const purchases = localStorage.get<StoredPurchase>(LocalStorageKeys.PURCHASES)
        return purchases.find(purchase => purchase.bookingId === bookingId) || null
    }
}

export const DocumentsService = {
    getAll: (): StoredDocument[] => localStorage.get<StoredDocument>(LocalStorageKeys.DOCUMENTS),

    getByPurchase: (purchaseId: string): StoredDocument[] => {
        const docs = localStorage.get<StoredDocument>(LocalStorageKeys.DOCUMENTS)
        return docs.filter(doc => doc.purchaseId === purchaseId)
    },

    // Добавляем для обратной совместимости
    getByBooking: (bookingId: string): StoredDocument[] => {
        const docs = localStorage.get<StoredDocument>(LocalStorageKeys.DOCUMENTS)
        return docs.filter(doc => doc.bookingId === bookingId)
    },

    getByStatus: (status: StoredDocument['status']): StoredDocument[] => {
        const docs = localStorage.get<StoredDocument>(LocalStorageKeys.DOCUMENTS)
        return docs.filter(doc => doc.status === status)
    },

    add: (document: Omit<StoredDocument, 'id'>): string => {
        const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newDoc: StoredDocument = { ...document, id }
        localStorage.add(LocalStorageKeys.DOCUMENTS, newDoc)
        return id
    },

    updateStatus: (id: string, status: StoredDocument['status'], additionalData?: Partial<StoredDocument>): void => {
        const updateData: Partial<StoredDocument> = { status, ...additionalData }

        if (status === 'uploaded') updateData.uploadDate = new Date().toISOString()
        if (status === 'verified') updateData.verificationDate = new Date().toISOString()
        if (status === 'signed') updateData.signDate = new Date().toISOString()

        localStorage.update<StoredDocument>(LocalStorageKeys.DOCUMENTS, id, updateData)
    },

    uploadDocument: (id: string, file: File): void => {
        localStorage.update<StoredDocument>(LocalStorageKeys.DOCUMENTS, id, {
            status: 'uploaded',
            uploadDate: new Date().toISOString(),
            fileName: file.name,
            fileSize: file.size
        })
    },

    generateTemplate: (type: string, title: string): Blob => {
        const content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(${title}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`

        return new Blob([content], { type: 'application/pdf' })
    }
}

export const PaymentsService = {
    getAll: (): StoredPayment[] => localStorage.get<StoredPayment>(LocalStorageKeys.PAYMENTS),

    getByPurchase: (purchaseId: string): StoredPayment[] => {
        const payments = localStorage.get<StoredPayment>(LocalStorageKeys.PAYMENTS)
        return payments.filter(payment => payment.purchaseId === purchaseId)
    },

    // Добавляем для обратной совместимости
    getByBooking: (bookingId: string): StoredPayment[] => {
        const payments = localStorage.get<StoredPayment>(LocalStorageKeys.PAYMENTS)
        return payments.filter(payment => payment.bookingId === bookingId)
    },

    getByStatus: (status: StoredPayment['status']): StoredPayment[] => {
        const payments = localStorage.get<StoredPayment>(LocalStorageKeys.PAYMENTS)
        return payments.filter(payment => payment.status === status)
    },

    add: (payment: Omit<StoredPayment, 'id'>): string => {
        const id = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newPayment: StoredPayment = { ...payment, id }
        localStorage.add(LocalStorageKeys.PAYMENTS, newPayment)
        return id
    },

    markAsPaid: (id: string, paymentMethod: string, transactionId: string): void => {
        localStorage.update<StoredPayment>(LocalStorageKeys.PAYMENTS, id, {
            status: 'paid',
            paidDate: new Date().toISOString(),
            paymentMethod,
            transactionId
        })
    },

    createPaymentSchedule: (purchaseIdOrBookingId: string, propertyId: string, totalAmount: number, initialPayment: number, paymentMethod: 'cash' | 'mortgage' | 'installment' = 'installment'): void => {
        if (paymentMethod === 'cash') {
            PaymentsService.add({
                purchaseId: purchaseIdOrBookingId.startsWith('purchase_') ? purchaseIdOrBookingId : undefined,
                bookingId: purchaseIdOrBookingId.startsWith('booking_') ? purchaseIdOrBookingId : undefined,
                propertyId,
                type: 'initial_payment',
                amount: totalAmount,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending',
                description: 'Полная оплата квартиры'
            })
        } else if (paymentMethod === 'installment') {
            const remainingAmount = totalAmount - initialPayment
            const installmentAmount = remainingAmount / 12

            // Первоначальный взнос
            PaymentsService.add({
                purchaseId: purchaseIdOrBookingId.startsWith('purchase_') ? purchaseIdOrBookingId : undefined,
                bookingId: purchaseIdOrBookingId.startsWith('booking_') ? purchaseIdOrBookingId : undefined,
                propertyId,
                type: 'initial_payment',
                amount: initialPayment,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending',
                description: 'Первоначальный взнос'
            })

            // Рассрочка на 12 месяцев
            for (let i = 1; i <= 12; i++) {
                const dueDate = new Date()
                dueDate.setMonth(dueDate.getMonth() + i)

                PaymentsService.add({
                    purchaseId: purchaseIdOrBookingId.startsWith('purchase_') ? purchaseIdOrBookingId : undefined,
                    bookingId: purchaseIdOrBookingId.startsWith('booking_') ? purchaseIdOrBookingId : undefined,
                    propertyId,
                    type: 'installment',
                    amount: installmentAmount,
                    dueDate: dueDate.toISOString(),
                    status: 'pending',
                    description: `Рассрочка ${i}/12`
                })
            }
        } else if (paymentMethod === 'mortgage') {
            // Первоначальный взнос
            PaymentsService.add({
                purchaseId: purchaseIdOrBookingId.startsWith('purchase_') ? purchaseIdOrBookingId : undefined,
                bookingId: purchaseIdOrBookingId.startsWith('booking_') ? purchaseIdOrBookingId : undefined,
                propertyId,
                type: 'initial_payment',
                amount: initialPayment,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending',
                description: 'Первоначальный взнос по ипотеке'
            })
        }
    }
}
