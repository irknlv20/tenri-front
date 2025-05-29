"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {MapPin, ArrowRight, Clock, CheckCircle, AlertCircle, CirclePlay} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {redirect, useRouter} from "next/navigation"

import { PurchasesService, BookingsService, type StoredPurchase, type StoredBooking } from "@/lib/localStorage"

export default function CabinetPage() {
  const [purchases, setPurchases] = useState<StoredPurchase[]>([])
  const [bookings, setBookings] = useState<StoredBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we have a token
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login?redirect=/cabinet")
      return
    }
    loadData()
  }, [])

  const loadData = () => {
    try {
      const allPurchases = PurchasesService.getAll()
      const allBookings = BookingsService.getAll()

      // Показываем только активные и в процессе бронирования
      const relevantBookings = allBookings.filter((b) =>
          ["active", "in_progress", "completed"].includes(b.status)
      )

      setPurchases(allPurchases)
      setBookings(relevantBookings)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      case "active":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "В процессе"
      case "completed":
        return "Завершено"
      case "cancelled":
        return "Отменено"
      case "active":
        return "Активно"
      default:
        return status
    }
  }


  if (isLoading) {
    return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Мой кабинет</h2>
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
    )
  }

  return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Мой кабинет</h2>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CirclePlay className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Покупки в процессе</p>
                  <p className="text-xl font-bold">{bookings.filter((p) => p.status === "in_progress").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Активные брони</p>
                  <p className="text-xl font-bold">{bookings.filter((p) => p.status === "active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Завершенные</p>
                  <p className="text-xl font-bold">
                    {bookings.filter((p) => p.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Покупки в процессе */}
        {purchases.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Покупки в процессе</h3>
              <div className="space-y-4">
                {purchases.map((purchase) => (
                    <Card key={purchase.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-1/4 aspect-video md:aspect-auto">
                            <Image
                                src={purchase.image || "/placeholder.svg"}
                                alt={purchase.title}
                                fill
                                className="object-cover"
                            />
                            <Badge className={`absolute top-2 left-2 ${getStatusColor(purchase.status)} text-white border-0`}>
                              {getStatusText(purchase.status)}
                            </Badge>
                          </div>

                          <div className="p-6 flex-1">
                            <h4 className="text-xl font-bold mb-2">{purchase.title}</h4>

                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                              <MapPin className="h-4 w-4" />
                              <span>{purchase.address}</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Площадь</div>
                                <div className="font-medium">{purchase.area} м²</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Этаж</div>
                                <div className="font-medium">{purchase.floor}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Стоимость</div>
                                <div className="font-medium">{purchase.price.toLocaleString()} ₸</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Менеджер</div>
                                <div className="font-medium">{purchase.managerName}</div>
                              </div>
                            </div>

                            {/* Прогресс */}
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>
                            Прогресс: {purchase.currentStep}/{purchase.totalSteps}
                          </span>
                                <span>{Math.round((purchase.currentStep / purchase.totalSteps) * 100)}%</span>
                              </div>
                              <Progress value={(purchase.currentStep / purchase.totalSteps) * 100} className="h-2" />
                            </div>

                            <div className="flex items-center gap-2 text-sm text-primary mb-4">
                              <Clock className="h-4 w-4" />
                              <span>Следующий шаг: {purchase.nextAction}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Link href={`/cabinet/purchases/${purchase.id}`}>
                                <Button size="sm" className="gap-1">
                                  Подробнее
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/cabinet/documents?purchaseId=${purchase.id}`}>
                                <Button variant="outline" size="sm">
                                  Документы
                                </Button>
                              </Link>
                              <Link href={`/cabinet/payments?purchaseId=${purchase.id}`}>
                                <Button variant="outline" size="sm">
                                  Платежи
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
        )}

        {/* Активные бронирования */}
        {bookings.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Активные объекты</h3>
              <div className="space-y-4">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-1/4 aspect-video md:aspect-auto">
                            <Image
                                src={booking.image || "/placeholder.svg"}
                                alt={booking.title}
                                fill
                                className="object-cover"
                            />
                            <Badge className={`absolute top-2 left-2 ${getStatusColor(booking.status)} text-white border-0`}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>

                          <div className="p-6 flex-1">
                            <h4 className="text-xl font-bold mb-2">{booking.title}</h4>

                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.address}</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Площадь</div>
                                <div className="font-medium">{booking.area} м²</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Этаж</div>
                                <div className="font-medium">{booking.floor}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Стоимость</div>
                                <div className="font-medium">{booking.price.toLocaleString()} ₸</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Действует до</div>
                                <div className="font-medium">{new Date(booking.expiryDate).toLocaleDateString()}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-primary mb-4">
                              {booking.status === "completed" ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-green-600">{booking.nextStep}</span>
                                  </>
                              ) : (
                                  <>
                                    <Clock className="h-4 w-4" />
                                    <span>{booking.nextStep}</span>
                                  </>
                              )}
                            </div>


                            <div className="flex flex-wrap gap-2">
                              <Link href={`/cabinet/bookings/${booking.id}`}>
                                <Button size="sm" className="gap-1">
                                  Подробнее
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
        )}

        {/* Пустое состояние */}
        {purchases.length === 0 && bookings.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">У вас пока нет активных объектов</h3>
              <p className="text-muted-foreground mb-4">Начните с поиска и бронирования квартиры</p>
              <Link href="/novostroiki">
                <Button>Выбрать квартиру</Button>
              </Link>
            </div>
        )}
      </div>
  )
}
