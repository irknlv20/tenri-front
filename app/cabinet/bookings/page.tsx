import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, ArrowRight, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BookingsPage() {
  const activeBookings = [
    {
      id: "1",
      title: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      status: "Активно",
      statusColor: "bg-green-500",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Центральный, ул. Абая, д. 5, кв. 42",
      area: 65.8,
      floor: 7,
      price: 24500000,
      pricePerSqm: 372340,
      bookingDate: "10.05.2025",
      expiryDate: "17.05.2025",
      bookingFee: 50000,
      nextStep: "Заключение договора купли-продажи",
    },
  ]

  const expiredBookings = [
    {
      id: "2",
      title: "1-комнатная квартира в ЖК «Арман»",
      status: "Истекло",
      statusColor: "bg-gray-500",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Сырдарья, ул. Токмагамбетова, д. 8, кв. 12",
      area: 42.8,
      floor: 3,
      price: 16264000,
      pricePerSqm: 380000,
      bookingDate: "01.04.2025",
      expiryDate: "08.04.2025",
      bookingFee: 50000,
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Бронирования</h2>

      <Tabs defaultValue="active">
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
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className={`absolute top-2 left-2 ${booking.statusColor} text-white border-0`}>
                          {booking.status}
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
                            <div className="text-sm text-muted-foreground">Бронь до</div>
                            <div className="font-medium">{booking.expiryDate}</div>
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
                            <Button variant="outline" size="sm" className="gap-1">
                              Подробнее
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="gap-1">
                            Продлить бронь
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            Отменить бронь
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
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className={`absolute top-2 left-2 ${booking.statusColor} text-white border-0`}>
                          {booking.status}
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
                            <div className="text-sm text-muted-foreground">Бронь истекла</div>
                            <div className="font-medium">{booking.expiryDate}</div>
                            <div className="text-xs text-muted-foreground">
                              Оплачено: {booking.bookingFee.toLocaleString()} ₸
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-destructive mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <span>Бронирование истекло</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link href={`/property/${booking.id.split("-")[0]}`}>
                            <Button variant="outline" size="sm" className="gap-1">
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
