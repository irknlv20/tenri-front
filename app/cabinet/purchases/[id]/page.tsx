"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, Clock, FileText, CreditCard, PenTool, Key, MapPin, Calendar, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PurchasesService, type StoredPurchase } from "@/lib/localStorage"
import { toast } from "sonner"

interface PurchaseDetailPageProps {
    params: {
        id: string
    }
}

export default function PurchaseDetailPage({ params }: PurchaseDetailPageProps) {
    const [purchase, setPurchase] = useState<StoredPurchase | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        loadPurchase()
    }, [params.id])

    const loadPurchase = () => {
        try {
            const foundPurchase = PurchasesService.getById(params.id)
            if (!foundPurchase) {
                toast.error("Покупка не найдена")
                router.push("/cabinet")
                return
            }

            setPurchase(foundPurchase)
        } catch (error) {
            console.error("Error loading purchase:", error)
            toast.error("Ошибка при загрузке данных о покупке")
            router.push("/cabinet")
        } finally {
            setIsLoading(false)
        }
    }

    const getStepIcon = (stepId: number) => {
        switch (stepId) {
            case 1:
                return <CheckCircle className="h-5 w-5" />
            case 2:
                return <FileText className="h-5 w-5" />
            case 3:
                return <CreditCard className="h-5 w-5" />
            case 4:
            case 6:
                return <PenTool className="h-5 w-5" />
            case 5:
                return <CreditCard className="h-5 w-5" />
            case 7:
                return <Key className="h-5 w-5" />
            default:
                return <Clock className="h-5 w-5" />
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
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!purchase) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Покупка не найдена</h3>
                <Link href="/cabinet">
                    <Button>Вернуться в кабинет</Button>
                </Link>
            </div>
        )
    }

    const progress = (purchase.currentStep / purchase.totalSteps) * 100

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад
                </Button>
                <h2 className="text-2xl font-bold">Детали покупки</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Property Info */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto">
                                    <Image
                                        src={purchase.image || "/placeholder.svg"}
                                        alt={purchase.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <Badge className="absolute top-2 left-2 bg-blue-500 text-white border-0">В процессе</Badge>
                                </div>

                                <div className="p-6 flex-1">
                                    <h3 className="text-xl font-bold mb-2">{purchase.title}</h3>

                                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                        <MapPin className="h-4 w-4" />
                                        <span>{purchase.address}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-muted-foreground">Площадь</div>
                                            <div className="font-medium">{purchase.area} м²</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Этаж</div>
                                            <div className="font-medium">{purchase.floor}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Комнат</div>
                                            <div className="font-medium">{purchase.apartment.rooms}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Корпус</div>
                                            <div className="font-medium">{purchase.apartment.building}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Прогресс покупки</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>
                    Шаг {purchase.currentStep} из {purchase.totalSteps}
                  </span>
                                    <span>{Math.round(progress)}% завершено</span>
                                </div>
                                <Progress value={progress} className="h-3" />
                            </div>

                            <div className="space-y-4">
                                {purchase.steps.map((step) => (
                                    <div key={step.id} className="flex items-start gap-4">
                                        <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>{getStepIcon(step.id)}</div>

                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-medium">{step.title}</h4>
                                                <Badge variant="outline" className={getStatusColor(step.status)}>
                                                    {getStatusText(step.status)}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-2">{step.description}</p>

                                            {step.completedDate && (
                                                <p className="text-xs text-green-600">
                                                    Завершено: {new Date(step.completedDate).toLocaleDateString()}
                                                </p>
                                            )}

                                            {/* Quick actions for current step */}
                                            {step.status === "in_progress" && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {step.id === 2 && (
                                                        <Link href={`/cabinet/documents?purchaseId=${purchase.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                Управление документами
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {step.id === 3 && purchase.paymentMethod === "mortgage" && (
                                                        <Link href={`/cabinet/mortgage?purchaseId=${purchase.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                Ипотека
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {step.id === 5 && (
                                                        <Link href={`/cabinet/payments?purchaseId=${purchase.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                Платежи
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Purchase Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Сводка по покупке</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Стоимость квартиры:</span>
                                <span className="font-medium">{purchase.price.toLocaleString()} ₸</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Цена за м²:</span>
                                <span className="font-medium">{purchase.pricePerSqm.toLocaleString()} ₸</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Способ оплаты:</span>
                                <span className="font-medium">
                  {purchase.paymentMethod === "cash"
                      ? "Полная оплата"
                      : purchase.paymentMethod === "mortgage"
                          ? "Ипотека"
                          : "Рассрочка"}
                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Manager Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Менеджер</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="font-medium">{purchase.managerName}</div>
                                    <div className="text-sm text-muted-foreground">Персональный менеджер</div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                Связаться с менеджером
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Даты</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm text-muted-foreground">Начало процесса</div>
                                    <div className="font-medium">{new Date(purchase.startDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm text-muted-foreground">Ожидаемое завершение</div>
                                    <div className="font-medium">{new Date(purchase.estimatedCompletion).toLocaleDateString()}</div>
                                </div>
                            </div>
                            {purchase.completionDate && (
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Завершено</div>
                                        <div className="font-medium">{new Date(purchase.completionDate).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Next Action */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Следующий шаг</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{purchase.nextAction}</p>
                            <Link href={`/cabinet/purchase-process?purchaseId=${purchase.id}`}>
                                <Button className="w-full">Продолжить процесс</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
