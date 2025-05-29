"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Calendar, AlertCircle, CheckCircle, Clock, Download } from "lucide-react"
import { PaymentsService, type StoredPayment, BookingsService } from "@/lib/localStorage"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

export default function PaymentsPage() {
    const [payments, setPayments] = useState<StoredPayment[]>([])
    const [pendingPayments, setPendingPayments] = useState<StoredPayment[]>([])
    const [paidPayments, setPaidPayments] = useState<StoredPayment[]>([])
    const [overduePayments, setOverduePayments] = useState<StoredPayment[]>([])
    const searchParams = useSearchParams()

    useEffect(() => {
        const purchaseId = searchParams.get("purchaseId")
        if (purchaseId) {
            loadPaymentsForPurchase(purchaseId)
        } else {
            loadPayments()
        }
        initializePayments()
    }, [])

    const loadPayments = () => {
        const allPayments = PaymentsService.getAll()
        setPayments(allPayments)
        setPendingPayments(allPayments.filter((p) => p.status === "pending"))
        setPaidPayments(allPayments.filter((p) => p.status === "paid"))

        // Проверяем просроченные платежи
        const now = new Date()
        const overdue = allPayments.filter((p) => p.status === "pending" && new Date(p.dueDate) < now)
        setOverduePayments(overdue)
    }

    const loadPaymentsForPurchase = (purchaseId: string) => {
        const allPayments = PaymentsService.getByPurchase(purchaseId)
        setPayments(allPayments)
        setPendingPayments(allPayments.filter((p) => p.status === "pending"))
        setPaidPayments(allPayments.filter((p) => p.status === "paid"))

        // Проверяем просроченные платежи
        const now = new Date()
        const overdue = allPayments.filter((p) => p.status === "pending" && new Date(p.dueDate) < now)
        setOverduePayments(overdue)
    }

    const initializePayments = () => {
        const existingPayments = PaymentsService.getAll()
        const bookings = BookingsService.getByStatus("active")

        // Если нет платежей, но есть активные бронирования, создаем платежи
        if (existingPayments.length === 0 && bookings.length > 0) {
            bookings.forEach((booking) => {
                // Создаем график платежей для каждого бронирования
                PaymentsService.createPaymentSchedule(
                    booking.id,
                    booking.propertyId,
                    booking.price,
                    booking.price * 0.3, // 30% первоначальный взнос
                )
            })
            loadPayments()
        }
    }

    const handlePayment = (paymentId: string) => {
        // Имитация платежа
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        PaymentsService.markAsPaid(paymentId, "card", transactionId)

        // Перезагружаем данные
        loadPayments()

        toast.success("Платеж успешно проведен")
    }

    const getStatusColor = (status: StoredPayment["status"]) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500"
            case "paid":
                return "bg-green-500"
            case "overdue":
                return "bg-red-500"
            case "cancelled":
                return "bg-gray-500"
            default:
                return "bg-blue-500"
        }
    }

    const getStatusText = (status: StoredPayment["status"]) => {
        switch (status) {
            case "pending":
                return "Ожидает оплаты"
            case "paid":
                return "Оплачен"
            case "overdue":
                return "Просрочен"
            case "cancelled":
                return "Отменен"
            default:
                return status
        }
    }

    const getPaymentTypeText = (type: StoredPayment["type"]) => {
        switch (type) {
            case "booking_fee":
                return "Бронирование"
            case "initial_payment":
                return "Первоначальный взнос"
            case "installment":
                return "Рассрочка"
            case "mortgage":
                return "Ипотека"
            case "final_payment":
                return "Окончательный расчет"
            default:
                return type
        }
    }

    const isPaymentOverdue = (payment: StoredPayment) => {
        return payment.status === "pending" && new Date(payment.dueDate) < new Date()
    }

    const generateReceipt = (payment: StoredPayment) => {
        const receiptContent = `
КВИТАНЦИЯ ОБ ОПЛАТЕ
№ ${payment.transactionId || payment.id}

Дата: ${payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "Не оплачен"}
Сумма: ${payment.amount.toLocaleString()} ₸
Тип платежа: ${getPaymentTypeText(payment.type)}
Описание: ${payment.description}
Статус: ${getStatusText(payment.status)}

TENRI HOME
Кызылорда, Казахстан
    `

        const blob = new Blob([receiptContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `receipt_${payment.id}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Квитанция скачана")
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Платежи</h2>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-yellow-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">К оплате</p>
                                <p className="text-xl font-bold">{pendingPayments.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Оплачено</p>
                                <p className="text-xl font-bold">{paidPayments.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Просрочено</p>
                                <p className="text-xl font-bold">{overduePayments.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Общая сумма</p>
                                <p className="text-xl font-bold">
                                    {paidPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ₸
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="pending">
                <TabsList className="mb-6">
                    <TabsTrigger value="pending">К оплате ({pendingPayments.length})</TabsTrigger>
                    <TabsTrigger value="paid">Оплаченные ({paidPayments.length})</TabsTrigger>
                    <TabsTrigger value="overdue">Просроченные ({overduePayments.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    <div className="space-y-4">
                        {pendingPayments.map((payment) => (
                            <Card key={payment.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-grow">
                                            <div className="bg-muted p-3 rounded-md">
                                                <CreditCard className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{payment.description}</h3>
                                                <p className="text-sm text-muted-foreground">{getPaymentTypeText(payment.type)}</p>
                                                <div
                                                    className={`flex items-center gap-1 text-xs mt-1 ${
                                                        isPaymentOverdue(payment) ? "text-red-500" : "text-muted-foreground"
                                                    }`}
                                                >
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                            Срок оплаты: {new Date(payment.dueDate).toLocaleDateString()}
                                                        {isPaymentOverdue(payment) && " (просрочен)"}
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="text-right">
                                                <p className="text-xl font-bold">{payment.amount.toLocaleString()} ₸</p>
                                                <Badge className={`${getStatusColor(payment.status)} text-white border-0`}>
                                                    {getStatusText(payment.status)}
                                                </Badge>
                                            </div>

                                            <Button onClick={() => handlePayment(payment.id)} className="gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                Оплатить
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {pendingPayments.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">Нет платежей к оплате</div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="paid">
                    <div className="space-y-4">
                        {paidPayments.map((payment) => (
                            <Card key={payment.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-grow">
                                            <div className="bg-muted p-3 rounded-md">
                                                <CheckCircle className="h-6 w-6 text-green-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{payment.description}</h3>
                                                <p className="text-sm text-muted-foreground">{getPaymentTypeText(payment.type)}</p>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                            Оплачен: {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "Неизвестно"}
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="text-right">
                                                <p className="text-xl font-bold">{payment.amount.toLocaleString()} ₸</p>
                                                <Badge className={`${getStatusColor(payment.status)} text-white border-0`}>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    {getStatusText(payment.status)}
                                                </Badge>
                                            </div>

                                            <Button variant="outline" onClick={() => generateReceipt(payment)} className="gap-2">
                                                <Download className="h-4 w-4" />
                                                Квитанция
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="overdue">
                    <div className="space-y-4">
                        {overduePayments.map((payment) => (
                            <Card key={payment.id} className="border-red-200">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-grow">
                                            <div className="bg-red-100 p-3 rounded-md">
                                                <AlertCircle className="h-6 w-6 text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{payment.description}</h3>
                                                <p className="text-sm text-muted-foreground">{getPaymentTypeText(payment.type)}</p>
                                                <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    <span>Просрочен с: {new Date(payment.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-red-600">{payment.amount.toLocaleString()} ₸</p>
                                                <Badge className="bg-red-500 text-white border-0">Просрочен</Badge>
                                            </div>

                                            <Button onClick={() => handlePayment(payment.id)} className="gap-2 bg-red-600 hover:bg-red-700">
                                                <CreditCard className="h-4 w-4" />
                                                Срочно оплатить
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {overduePayments.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">Нет просроченных платежей</div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
