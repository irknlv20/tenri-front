"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Home, CreditCard } from "lucide-react"
import Link from "next/link"

export default function BookingConfirmationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const bookingId = searchParams.get("bookingId")

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.replace("/login")
            return
        }

        if (!bookingId) {
            router.replace("/cabinet/bookings")
            return
        }
    }, [bookingId, router])

    return (
        <div className="container py-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Бронирование успешно создано!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center text-muted-foreground">
                            <p>Ваше бронирование было успешно создано.</p>
                            <p>
                                Номер бронирования: <span className="font-medium">#{bookingId}</span>
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Следующий шаг</p>
                                    <p className="text-sm text-muted-foreground">Оплатите бронирование в течение 24 часов</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                                <CreditCard className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <p className="font-medium">Важно</p>
                                    <p className="text-sm text-muted-foreground">Без оплаты бронирование будет автоматически отменено</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                                <Home className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Поддержка</p>
                                    <p className="text-sm text-muted-foreground">Наши менеджеры свяжутся с вами в ближайшее время</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link href={`/cabinet/bookings/${bookingId}`} className="flex-1">
                                <Button className="w-full">Перейти к оплате</Button>
                            </Link>
                            <Link href="/cabinet/bookings" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Мои бронирования
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
