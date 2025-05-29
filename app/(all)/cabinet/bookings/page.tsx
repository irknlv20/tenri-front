"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, ArrowRight, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookingsService, type StoredBooking } from "@/lib/localStorage"
import { toast } from "sonner"

export default function BookingsPage() {
  const [activeBookings, setActiveBookings] = useState<StoredBooking[]>([])
  const [expiredBookings, setExpiredBookings] = useState<StoredBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBookings = () => {
      try {
        // Mark expired bookings first
        BookingsService.markExpired()

        const active = BookingsService.getByStatus("active")
        const expired = BookingsService.getByStatus("expired").concat(BookingsService.getByStatus("cancelled"))

        setActiveBookings(active)
        setExpiredBookings(expired)
      } catch (error) {
        console.error("Error loading bookings:", error)
        toast.error("Ошибка при загрузке бронирований")
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [])

  const handleExtendBooking = (id: string) => {
    try {
      BookingsService.extend(id)

      // Refresh bookings
      const active = BookingsService.getByStatus("active")
      setActiveBookings(active)

      toast.success("Бронирование продлено на 7 дней")
    } catch (error) {
      console.error("Error extending booking:", error)
      toast.error("Ошибка при продлении бронирования")
    }
  }

  const handleCancelBooking = (id: string) => {
    if (!window.confirm("Вы уверены, что хотите отменить бронирование?")) {
      return
    }

    try {
      BookingsService.cancel(id)

      // Move booking from active to expired
      const active = BookingsService.getByStatus("active")
      const expired = BookingsService.getByStatus("expired").concat(BookingsService.getByStatus("cancelled"))

      setActiveBookings(active)
      setExpiredBookings(expired)

      toast.success("Бронирование отменено")
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error("Ошибка при отмене бронирования")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "expired":
        return "bg-gray-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Активно"
      case "expired":
        return "Истекло"
      case "cancelled":
        return "Отменено"
      default:
        return status
    }
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const diffHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffHours <= 24 && diffHours > 0
  }

  if (isLoading) {
    return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Бронирования</h2>
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
    )
  }

  return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Бронирования</h2>

        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Активные ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="expired">Истекшие ({expiredBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-6">
              {activeBookings.length > 0 ? (
                  activeBookings.map((booking) => (
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
                              <Badge
                                  className={`absolute top-2 left-2 ${getStatusColor(booking.status)} text-white border-0`}
                              >
                                {getStatusText(booking.status)}
                              </Badge>
                              {isExpiringSoon(booking.expiryDate) && (
                                  <Badge className="absolute top-2 right-2 bg-orange-500 text-white border-0">
                                    Истекает скоро
                                  </Badge>
                              )}
                            </div>

                            <div className="p-6 flex-1">
                              <h3 className="text-xl font-bold mb-2">{booking.title}</h3>

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
                                  <div className="text-xs text-muted-foreground">
                                    {booking.pricePerSqm.toLocaleString()} ₸/м²
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">Бронь до</div>
                                  <div className="font-medium">{new Date(booking.expiryDate).toLocaleDateString()}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Оплачено: {booking.bookingFee.toLocaleString()} ₸
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-primary mb-4">
                                <Clock className="h-4 w-4" />
                                <span>Следующий шаг: {booking.nextStep}</span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Link href={`/cabinet/bookings/${booking.id}`}>
                                  <Button variant="default" size="sm" className="gap-1">
                                    Подробнее
                                    <ArrowRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => handleExtendBooking(booking.id)}>
                                  Продлить бронь
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                                  Отменить бронь
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))
              ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    У вас пока нет активных бронирований
                    <div className="mt-4">
                      <Link href="/novostroiki">
                        <Button>Посмотреть объекты</Button>
                      </Link>
                    </div>
                  </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="expired">
            <div className="space-y-6">
              {expiredBookings.length > 0 ? (
                  expiredBookings.map((booking) => (
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
                              <Badge
                                  className={`absolute top-2 left-2 ${getStatusColor(booking.status)} text-white border-0`}
                              >
                                {getStatusText(booking.status)}
                              </Badge>
                            </div>

                            <div className="p-6 flex-1">
                              <h3 className="text-xl font-bold mb-2">{booking.title}</h3>

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
                                  <div className="text-xs text-muted-foreground">
                                    {booking.pricePerSqm.toLocaleString()} ₸/м²
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">Дата бронирования</div>
                                  <div className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-destructive mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <span>{booking.nextStep}</span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Link href={`/property/${booking.propertyId}`}>
                                  <Button variant="default" size="sm" className="gap-1">
                                    Забронировать снова
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))
              ) : (
                  <div className="text-center py-8 text-muted-foreground">У вас нет истекших бронирований</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
