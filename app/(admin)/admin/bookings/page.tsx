"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, Building, MapPin, ArrowRight, CheckCircle, XCircle } from "lucide-react"

// Пример данных бронирований
const bookings = [
  {
    id: "1",
    property: "ЖК «Кызылорда-Сити»",
    unit: "2-комнатная квартира, 65.8 м²",
    client: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 (747) 123-45-67",
    status: "active",
    bookingDate: "2025-05-10T00:00:00Z",
    expiryDate: "2025-05-17T00:00:00Z",
    bookingFee: 50000,
    location: "мкр. Центральный, ул. Абая, д. 5, кв. 42",
    floor: 7,
    price: 24500000,
  },
  {
    id: "2",
    property: "ЖК «Жайлы»",
    unit: "3-комнатная квартира, 85.2 м²",
    client: "Алия Сериковна",
    email: "aliya@example.com",
    phone: "+7 (747) 234-56-78",
    status: "pending",
    bookingDate: "2025-05-12T00:00:00Z",
    expiryDate: "2025-05-19T00:00:00Z",
    bookingFee: 50000,
    location: "мкр. Шымбулак, ул. Казыбек би, д. 12, кв. 35",
    floor: 5,
    price: 32800000,
  },
  {
    id: "3",
    property: "ЖК «Арман»",
    unit: "1-комнатная квартира, 42.8 м²",
    client: "Серик Алматов",
    email: "serik@example.com",
    phone: "+7 (747) 345-67-89",
    status: "confirmed",
    bookingDate: "2025-05-08T00:00:00Z",
    expiryDate: "2025-05-15T00:00:00Z",
    bookingFee: 50000,
    location: "мкр. Сырдарья, ул. Токмагамбетова, д. 8, кв. 12",
    floor: 3,
    price: 16264000,
  },
  {
    id: "4",
    property: "ЖК «Мерей»",
    unit: "2-комнатная квартира, 68.5 м²",
    client: "Айгуль Нурланова",
    email: "aigul@example.com",
    phone: "+7 (747) 456-78-90",
    status: "expired",
    bookingDate: "2025-04-25T00:00:00Z",
    expiryDate: "2025-05-02T00:00:00Z",
    bookingFee: 50000,
    location: "мкр. Ақмешіт, ул. Жібек жолы, д. 15, кв. 28",
    floor: 4,
    price: 25800000,
  },
  {
    id: "5",
    property: "ЖК «Нұрлы»",
    unit: "1-комнатная квартира, 38.2 м²",
    client: "Нурлан Сагынбаев",
    email: "nurlan@example.com",
    phone: "+7 (747) 567-89-01",
    status: "cancelled",
    bookingDate: "2025-05-05T00:00:00Z",
    expiryDate: "2025-05-12T00:00:00Z",
    bookingFee: 50000,
    location: "мкр. Тасбөгет, ул. Абылай хана, д. 7, кв. 15",
    floor: 2,
    price: 14500000,
  },
]

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Фильтрация бронирований
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Функция для отображения статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Активно</span>
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Ожидает подтверждения</span>
        )
      case "confirmed":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Подтверждено</span>
      case "expired":
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Истекло</span>
      case "cancelled":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Отменено</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Бронирования</h1>
        <p className="text-muted-foreground mt-2">Управление бронированиями объектов недвижимости</p>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Все бронирования</TabsTrigger>
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="pending">Ожидающие</TabsTrigger>
            <TabsTrigger value="expired">Истекшие</TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск бронирований..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="pending">Ожидающие</SelectItem>
                    <SelectItem value="confirmed">Подтвержденные</SelectItem>
                    <SelectItem value="expired">Истекшие</SelectItem>
                    <SelectItem value="cancelled">Отмененные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Объект</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Дата бронирования</TableHead>
                    <TableHead>Действует до</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{booking.property}</div>
                            <div className="text-sm text-muted-foreground">{booking.unit}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div>{booking.client}</div>
                              <div className="text-xs text-muted-foreground">{booking.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(booking.bookingDate).toLocaleDateString("ru-RU")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(booking.expiryDate).toLocaleDateString("ru-RU")}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setIsDialogOpen(true)
                            }}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Подробнее
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Бронирования не найдены
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Показано {filteredBookings.length} из {bookings.length} бронирований
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Диалог просмотра бронирования */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Детали бронирования</DialogTitle>
            <DialogDescription>
              {selectedBooking?.property} • {selectedBooking?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Информация об объекте</h4>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{selectedBooking?.property}</div>
                      <div className="text-sm">{selectedBooking?.unit}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">{selectedBooking?.location}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Этаж:</span> {selectedBooking?.floor}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Стоимость:</span> {selectedBooking?.price.toLocaleString()}{" "}
                    ₸
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Информация о клиенте</h4>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{selectedBooking?.client}</div>
                      <div className="text-sm">{selectedBooking?.email}</div>
                      <div className="text-sm">{selectedBooking?.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Детали бронирования</h4>
              <div className="bg-muted p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Статус:</span> {selectedBooking?.status}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Сумма бронирования:</span>{" "}
                    {selectedBooking?.bookingFee.toLocaleString()} ₸
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Дата бронирования:</span>{" "}
                    {new Date(selectedBooking?.bookingDate || "").toLocaleDateString("ru-RU")}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Действует до:</span>{" "}
                    {new Date(selectedBooking?.expiryDate || "").toLocaleDateString("ru-RU")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Подтвердить
              </Button>
              <Button variant="outline" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Отменить
              </Button>
            </div>
            <Button type="submit">Продлить бронь</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
