"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Clock, ArrowLeft, Download, CreditCard, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookingsService, type StoredBooking } from "@/lib/localStorage"
import { toast } from "sonner"
import {createPurchase} from "@/services/cabinet-service";

interface BookingDetailPageProps {
    params: {
        id: string
    }
}

export default function BookingDetailPage() {
    const [booking, setBooking] = useState<StoredBooking | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const {id} = useParams();

    useEffect(() => {
        const loadBooking = () => {
            try {
                // Mark expired bookings first
                BookingsService.markExpired()

                const foundBooking = BookingsService.getById(id)
                if (!foundBooking) {
                    toast.error("Бронирование не найдено")
                    router.push("/cabinet/bookings")
                    return
                }

                setBooking(foundBooking)
            } catch (error) {
                console.error("Error loading booking:", error)
                toast.error("Ошибка при загрузке бронирования")
                router.push("/cabinet/bookings")
            } finally {
                setIsLoading(false)
            }
        }

        loadBooking()
    }, [id, router])

    const handleExtendBooking = () => {
        if (!booking) return

        try {
            BookingsService.extend(booking.id)

            // Refresh booking data
            const updatedBooking = BookingsService.getById(booking.id)
            setBooking(updatedBooking)

            toast.success("Бронирование продлено на 7 дней")
        } catch (error) {
            console.error("Error extending booking:", error)
            toast.error("Ошибка при продлении бронирования")
        }
    }

    const handlePurchase = async () => {
        if (!booking) return

        try {
            await createPurchase(booking.id).then(()=> {
                router.push(`/cabinet/purchase-process?bookingId=${booking.id}`)
            });
        } catch (error) {
            console.error("Error starting purchase process:", error)
            toast.error("Ошибка при переходе к покупке")
        }
    }
    const handleCancelBooking = () => {
        if (!booking) return

        if (!window.confirm("Вы уверены, что хотите отменить бронирование?")) {
            return
        }

        try {
            BookingsService.cancel(booking.id)
            toast.success("Бронирование отменено")
            router.push("/cabinet/bookings")
        } catch (error) {
            console.error("Error cancelling booking:", error)
            toast.error("Ошибка при отмене бронирования")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-500"
            case "completed":
                return "bg-green-500"
            case "expired":
                return "bg-gray-500"
            case "cancelled":
                return "bg-red-500"
            case "in_progress":
                return "bg-blue-500"
            default:
                return "bg-blue-500"
        }
    }

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "Активно"
            case "completed":
                return "Завершено"
            case "expired":
                return "Истекло"
            case "in_progress":
                return "В процессе"
            case "cancelled":
                return "Отменено"
            default:
                return status
        }
    }

    const getDaysRemaining = (expiryDate: string) => {
        const expiry = new Date(expiryDate)
        const now = new Date()
        const diffTime = expiry.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!booking) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Бронирование не найдено</h3>
                <Link href="/cabinet/bookings">
                    <Button>Вернуться к бронированиям</Button>
                </Link>
            </div>
        )
    }

    const daysRemaining = getDaysRemaining(booking.expiryDate)
    const isExpiringSoon = daysRemaining <= 1 && daysRemaining > 0
    const isExpired = daysRemaining <= 0

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад
                </Button>
                <h2 className="text-2xl font-bold">Детали бронирования</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Property Info */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto">
                                    <Image src={booking.image || "/placeholder.svg"} alt={booking.title} fill className="object-cover" />
                                    <Badge className={`absolute top-2 left-2 ${getStatusColor(booking.status)} text-white border-0`}>
                                        {getStatusText(booking.status)}
                                    </Badge>
                                    {isExpiringSoon && booking.status === "active" && (
                                        <Badge className="absolute top-2 right-2 bg-orange-500 text-white border-0">Истекает скоро</Badge>
                                    )}
                                </div>

                                <div className="p-6 flex-1">
                                    <h3 className="text-xl font-bold mb-2">{booking.title}</h3>

                                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                        <MapPin className="h-4 w-4" />
                                        <span>{booking.address}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-muted-foreground">Площадь</div>
                                            <div className="font-medium">{booking.area} м²</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Этаж</div>
                                            <div className="font-medium">{booking.floor}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Комнат</div>
                                            <div className="font-medium">{booking.apartment.rooms}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Корпус</div>
                                            <div className="font-medium">{booking.apartment.building}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>История бронирования</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <div className="flex-1">
                                        <div className="font-medium">Бронирование создано</div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(booking.bookingDate).toLocaleDateString()} в{" "}
                                            {new Date(booking.bookingDate).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>

                                {booking.status === "active" && (
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <div className="flex-1">
                                            <div className="font-medium">Следующий шаг</div>
                                            <div className="text-sm text-muted-foreground">{booking.nextStep}</div>
                                        </div>
                                    </div>
                                )}

                                {booking.status === "cancelled" && (
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        <div className="flex-1">
                                            <div className="font-medium">Бронирование отменено</div>
                                            <div className="text-sm text-muted-foreground">Бронирование было отменено</div>
                                        </div>
                                    </div>
                                )}

                                {booking.status === "expired" && (
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                                        <div className="flex-1">
                                            <div className="font-medium">Бронирование истекло</div>
                                            <div className="text-sm text-muted-foreground">
                                                Истекло {new Date(booking.expiryDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Booking Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Сводка по бронированию</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Стоимость квартиры:</span>
                                <span className="font-medium">{booking.price.toLocaleString()} ₸</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Цена за м²:</span>
                                <span className="font-medium">{booking.pricePerSqm.toLocaleString()} ₸</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Даты</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm text-muted-foreground">Дата бронирования</div>
                                    <div className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm text-muted-foreground">Действует до</div>
                                    <div className="font-medium">{new Date(booking.expiryDate).toLocaleDateString()}</div>
                                    {booking.status === "active" && (
                                        <div className={`text-xs ${isExpiringSoon ? "text-orange-600" : "text-muted-foreground"}`}>
                                            {daysRemaining > 0 ? `Осталось ${daysRemaining} дн.` : "Истекло"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {booking.status === "active" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Действия</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={`/cabinet/purchase-process?bookingId=${booking.id}`}>
                                    <Button className="w-full" size="lg" onClick={handlePurchase}>
                                        <CheckCircle className="h-4 w-4 mr-2" />Перейти к покупке
                                    </Button>
                                </Link>
                                <Button className="w-full" onClick={handleExtendBooking}>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Продлить бронь
                                </Button>
                                <Button variant="outline" className="w-full" onClick={handleCancelBooking}>
                                    Отменить бронирование
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {booking.status === "in_progress" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Действия</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={`/cabinet/purchase-process?bookingId=${booking.id}`}>
                                    <Button className="w-full" size="lg" onClick={handlePurchase}>
                                        <CheckCircle className="h-4 w-4 mr-2" />Продолжить покупку
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full" onClick={handleCancelBooking}>
                                    Отменить процесс
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {(booking.status !== "active" && booking.status !== "in_progress") && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Действия</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/property/${booking.propertyId}`}>
                                    <Button className="w-full">Забронировать снова</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
