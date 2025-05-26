"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, ArrowRight, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PurchasesService, type StoredPurchase } from "@/lib/localStorage"

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<StoredPurchase[]>([])
    const [inProgressPurchases, setInProgressPurchases] = useState<StoredPurchase[]>([])
    const [completedPurchases, setCompletedPurchases] = useState<StoredPurchase[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadPurchases()
    }, [])

    const loadPurchases = () => {
        try {
            const allPurchases = PurchasesService.getAll()
            const inProgress = allPurchases.filter((p) => p.status === "in_progress")
            const completed = allPurchases.filter((p) => p.status === "completed")

            setPurchases(allPurchases)
            setInProgressPurchases(inProgress)
            setCompletedPurchases(completed)
        } catch (error) {
            console.error("Error loading purchases:", error)
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
            default:
                return status
        }
    }

    if (isLoading) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-6">Покупки</h2>
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Покупки</h2>

            <Tabs defaultValue="in_progress">
                <TabsList className="mb-6">
                    <TabsTrigger value="in_progress">В процессе ({inProgressPurchases.length})</TabsTrigger>
                    <TabsTrigger value="completed">Завершенные ({completedPurchases.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="in_progress">
                    <div className="space-y-6">
                        {inProgressPurchases.length > 0 ? (
                            inProgressPurchases.map((purchase) => (
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
                                                <Badge
                                                    className={`absolute top-2 left-2 ${getStatusColor(purchase.status)} text-white border-0`}
                                                >
                                                    {getStatusText(purchase.status)}
                                                </Badge>
                                            </div>

                                            <div className="p-6 flex-1">
                                                <h3 className="text-xl font-bold mb-2">{purchase.title}</h3>

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
                                                    <Link href={`/cabinet/purchase-process?purchaseId=${purchase.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Продолжить процесс
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
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                У вас пока нет покупок в процессе
                                <div className="mt-4">
                                    <Link href="/cabinet/bookings">
                                        <Button>Посмотреть бронирования</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="completed">
                    <div className="space-y-6">
                        {completedPurchases.length > 0 ? (
                            completedPurchases.map((purchase) => (
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
                                                <Badge
                                                    className={`absolute top-2 left-2 ${getStatusColor(purchase.status)} text-white border-0`}
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    {getStatusText(purchase.status)}
                                                </Badge>
                                            </div>

                                            <div className="p-6 flex-1">
                                                <h3 className="text-xl font-bold mb-2">{purchase.title}</h3>

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
                                                        <div className="text-sm text-muted-foreground">Завершено</div>
                                                        <div className="font-medium">
                                                            {purchase.completionDate ? new Date(purchase.completionDate).toLocaleDateString() : "—"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Покупка завершена успешно</span>
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
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">У вас пока нет завершенных покупок</div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
