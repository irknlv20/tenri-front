"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, ArrowRight, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CabinetService } from "@/services/cabinet-service"
import { toast } from "sonner"

// Updated interface to match server response
interface Apartment {
  id: string
  area: number
  floor: number
  price: number
  rooms: number
  building: string
  floorPlanImage: string
}

interface Project {
  id: string
  name: string
  image: string
  address: string
}

interface Booking {
  id: string
  status: string
  bookedAt: string
  apartment: Apartment
  project: Project
}

export default function BookingsPage() {
  const [activeBookings, setActiveBookings] = useState<Booking[]>([])
  const [expiredBookings, setExpiredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true)

        // Fetch active bookings
        const activeResponse = await CabinetService.getBookings("pending")
        setActiveBookings(activeResponse.data?.bookings || [])

        // Fetch expired bookings
        const expiredResponse = await CabinetService.getBookings("expired")
        setExpiredBookings(expiredResponse.data?.bookings || [])
      } catch (error) {
        console.error("Error fetching bookings:", error)
        toast.error("Не удалось загрузить список бронирований")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [router])

  const handleExtendBooking = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await CabinetService.extendBooking(id)
      toast.success("Бронирование успешно продлено")

      // Refresh bookings after extension
      const activeResponse = await CabinetService.getBookings("pending")
      setActiveBookings(activeResponse.bookings || [])
    } catch (error) {
      console.error("Error extending booking:", error)
      toast.error("Ошибка при продлении бронирования")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Вы уверены, что хотите отменить бронирование?")) {
      return
    }

    try {
      setIsLoading(true)
      await CabinetService.cancelBooking(id)
      toast.success("Бронирование отменено")

      // Move booking from active to expired
      const activeResponse = await CabinetService.getBookings("pending")
      const expiredResponse = await CabinetService.getBookings("expired")

      setActiveBookings(activeResponse.bookings || [])
      setExpiredBookings(expiredResponse.bookings || [])
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error("Ошибка при отмене бронирования")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "активно":
      case "pending":
        return "bg-green-500"
      case "expired":
      case "истекло":
        return "bg-gray-500"
      case "cancelled":
      case "отменено":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Активно"
      case "expired":
        return "Истекло"
      case "cancelled":
        return "Отменено"
      default:
        return status
    }
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

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="expired">Истекшие</TabsTrigger>
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
                                  src={booking.project.image || "/placeholder.svg"}
                                  alt={booking.project.name}
                                  fill
                                  className="object-cover"
                              />
                              <Badge className={`absolute top-2 left-2 ${getStatusColor(booking.status)} text-white border-0`}>
                                {getStatusText(booking.status)}
                              </Badge>
                            </div>

                            <div className="p-6 flex-1">
                              <h3 className="text-xl font-bold mb-2">{booking.project.name}</h3>

                              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.project.address}</span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Площадь</p>
                                  <p className="font-medium">{booking.apartment.area} м²</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Этаж</p>
                                  <p className="font-medium">{booking.apartment.floor}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Стоимость</p>
                                  <p className="font-medium">{booking.apartment.price?.toLocaleString()} ₸</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Корпус</p>
                                  <p className="font-medium">{booking.apartment.building}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-primary mb-4">
                                <Clock className="h-4 w-4" />
                                <span>Дата бронирования: {new Date(booking.bookedAt).toLocaleDateString()}</span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Link href={`/cabinet/bookings/${booking.id}`}>
                                  <Button variant="default" className="flex items-center gap-1">
                                    Подробнее
                                    <ArrowRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={() => handleExtendBooking(booking.id)}
                                    disabled={isLoading}
                                >
                                  Продлить бронь
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    disabled={isLoading}
                                >
                                  Отменить
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))
              ) : (
                  <div className="text-center py-8 text-muted-foreground">У вас пока нет активных бронирований</div>
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
                                  src={booking.project.image || "/placeholder.svg"}
                                  alt={booking.project.name}
                                  fill
                                  className="object-cover"
                              />
                              <Badge className={`absolute top-2 left-2 ${getStatusColor(booking.status)} text-white border-0`}>
                                {getStatusText(booking.status)}
                              </Badge>
                            </div>

                            <div className="p-6 flex-1">
                              <h3 className="text-xl font-bold mb-2">{booking.project.name}</h3>

                              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.project.address}</span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Площадь</p>
                                  <p className="font-medium">{booking.apartment.area} м²</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Этаж</p>
                                  <p className="font-medium">{booking.apartment.floor}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Стоимость</p>
                                  <p className="font-medium">{booking.apartment.price?.toLocaleString()} ₸</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Бронирование</p>
                                  <p className="font-medium">{new Date(booking.bookedAt).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-destructive mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <span>Статус бронирования: {getStatusText(booking.status)}</span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Link href={`/property/${booking.project.id}`}>
                                  <Button variant="default" className="flex items-center gap-1">
                                    Забронировать снова
                                    <ArrowRight className="h-4 w-4" />
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