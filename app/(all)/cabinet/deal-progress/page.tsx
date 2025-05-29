"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, FileText, CreditCard, PenTool, Key } from "lucide-react"
import { BookingsService, DocumentsService, PaymentsService, type StoredDealProgress } from "@/lib/localStorage"
import Link from "next/link"

export default function DealProgressPage() {
    const [dealProgress, setDealProgress] = useState<StoredDealProgress | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        initializeDealProgress()
    }, [])

    const initializeDealProgress = () => {
        const activeBookings = BookingsService.getByStatus("active")

        if (activeBookings.length > 0) {
            const booking = activeBookings[0] // Берем первое активное бронирование

            // Создаем прогресс сделки
            const progress: StoredDealProgress = {
                id: `deal_${booking.id}`,
                bookingId: booking.id,
                propertyId: booking.propertyId,
                currentStage: "booking",
                stages: [
                    {
                        stage: "booking",
                        title: "Бронирование",
                        status: "completed",
                        completedDate: booking.bookingDate,
                        description: "Квартира забронирована",
                    },
                    {
                        stage: "documents",
                        title: "Документы",
                        status: "in_progress",
                        description: "Загрузка и проверка документов",
                        requiredDocuments: ["passport", "income", "other"],
                    },
                    {
                        stage: "mortgage",
                        title: "Ипотека",
                        status: "pending",
                        description: "Оформление ипотечного кредита",
                    },
                    {
                        stage: "payments",
                        title: "Платежи",
                        status: "pending",
                        description: "Внесение платежей по графику",
                        requiredPayments: ["initial_payment", "installment"],
                    },
                    {
                        stage: "signing",
                        title: "Подписание",
                        status: "pending",
                        description: "Подписание договора купли-продажи",
                    },
                    {
                        stage: "completion",
                        title: "Получение ключей",
                        status: "pending",
                        description: "Передача квартиры и ключей",
                    },
                ],
                nextAction: "Загрузите необходимые документы",
                managerName: "Алия Сериковна",
                estimatedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 дней
            }

            setDealProgress(progress)
            updateProgressBasedOnData(progress)
        }

        setIsLoading(false)
    }

    const updateProgressBasedOnData = (progress: StoredDealProgress) => {
        const documents = DocumentsService.getByBooking(progress.bookingId)
        const payments = PaymentsService.getByBooking(progress.bookingId)

        // Обновляем статус документов
        const requiredDocs = documents.filter((doc) => doc.status === "required")
        const uploadedDocs = documents.filter((doc) => ["uploaded", "verified", "signed"].includes(doc.status))

        if (requiredDocs.length === 0 && uploadedDocs.length > 0) {
            // Все документы загружены
            const documentStage = progress.stages.find((s) => s.stage === "documents")
            if (documentStage) {
                documentStage.status = "completed"
                documentStage.completedDate = new Date().toISOString()
                progress.currentStage = "mortgage"
                progress.nextAction = "Подайте заявку на ипотеку"
            }
        }

        // Обновляем статус платежей
        const paidPayments = payments.filter((p) => p.status === "paid")
        const pendingPayments = payments.filter((p) => p.status === "pending")

        if (paidPayments.length > 0 && pendingPayments.length === 0) {
            // Все платежи внесены
            const paymentStage = progress.stages.find((s) => s.stage === "payments")
            if (paymentStage) {
                paymentStage.status = "completed"
                paymentStage.completedDate = new Date().toISOString()
                progress.currentStage = "signing"
                progress.nextAction = "Подпишите договор купли-продажи"
            }
        }

        setDealProgress(progress)
    }

    const getStageIcon = (stage: string) => {
        switch (stage) {
            case "booking":
                return <CheckCircle className="h-6 w-6" />
            case "documents":
                return <FileText className="h-6 w-6" />
            case "mortgage":
                return <CreditCard className="h-6 w-6" />
            case "payments":
                return <CreditCard className="h-6 w-6" />
            case "signing":
                return <PenTool className="h-6 w-6" />
            case "completion":
                return <Key className="h-6 w-6" />
            default:
                return <Clock className="h-6 w-6" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "text-green-500 bg-green-100"
            case "in_progress":
                return "text-blue-500 bg-blue-100"
            case "pending":
                return "text-gray-500 bg-gray-100"
            case "blocked":
                return "text-red-500 bg-red-100"
            default:
                return "text-gray-500 bg-gray-100"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Завершено"
            case "in_progress":
                return "В процессе"
            case "pending":
                return "Ожидает"
            case "blocked":
                return "Заблокировано"
            default:
                return status
        }
    }

    if (isLoading) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-6">Прогресс сделки</h2>
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (!dealProgress) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-6">Прогресс сделки</h2>
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">У вас нет активных сделок</p>
                        <Link href="/novostroiki">
                            <Button className="mt-4">Выбрать квартиру</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Прогресс сделки</h2>

            {/* Общая информация */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Информация о сделке</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Менеджер</p>
                            <p className="font-medium">{dealProgress.managerName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Текущий этап</p>
                            <p className="font-medium">
                                {dealProgress.stages.find((s) => s.stage === dealProgress.currentStage)?.title}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Ожидаемое завершение</p>
                            <p className="font-medium">{new Date(dealProgress.estimatedCompletion).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                            <p className="font-medium text-blue-700">Следующий шаг:</p>
                        </div>
                        <p className="text-blue-600 mt-1">{dealProgress.nextAction}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Этапы сделки */}
            <div className="space-y-4">
                {dealProgress.stages.map((stage, index) => (
                    <Card key={stage.stage}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${getStatusColor(stage.status)}`}>{getStageIcon(stage.stage)}</div>

                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-medium">{stage.title}</h3>
                                        <Badge variant="outline" className={getStatusColor(stage.status)}>
                                            {getStatusText(stage.status)}
                                        </Badge>
                                    </div>

                                    <p className="text-muted-foreground mb-3">{stage.description}</p>

                                    {stage.completedDate && (
                                        <p className="text-sm text-green-600">
                                            Завершено: {new Date(stage.completedDate).toLocaleDateString()}
                                        </p>
                                    )}

                                    {/* Действия для текущего этапа */}
                                    {stage.status === "in_progress" && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {stage.stage === "documents" && (
                                                <Link href="/cabinet/documents">
                                                    <Button size="sm">Управление документами</Button>
                                                </Link>
                                            )}
                                            {stage.stage === "mortgage" && (
                                                <Link href="/cabinet/mortgage">
                                                    <Button size="sm">Подать заявку на ипотеку</Button>
                                                </Link>
                                            )}
                                            {stage.stage === "payments" && (
                                                <Link href="/cabinet/payments">
                                                    <Button size="sm">Просмотреть платежи</Button>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Индикатор прогресса */}
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-muted-foreground">{index + 1}</div>
                                    <div className="text-sm text-muted-foreground">из {dealProgress.stages.length}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
