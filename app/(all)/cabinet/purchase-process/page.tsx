"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    CheckCircle,
    FileText,
    PenTool,
    Key,
    ArrowRight,
    ArrowLeft,
    Upload,
    Download, MapPin
} from "lucide-react"
import {
    BookingsService,
    DocumentsService,
    type StoredBooking,
} from "@/lib/localStorage"
import { getCurrentPurchaseStep, updatePurchaseStep, getDocumentStatus } from "@/services/cabinet-service"
import { toast } from "sonner"
import Image from "next/image"

const STEPS = [
    { id: 1, title: "Подтверждение", icon: CheckCircle },
    { id: 2, title: "Документы", icon: FileText },
    { id: 3, title: "Предварительный договор", icon: PenTool },
    { id: 4, title: "Основной договор", icon: PenTool },
    { id: 5, title: "Получение ключей", icon: Key },
]

const STATIC_DOCUMENTS = [
    {
        id: "passport",
        title: "Паспорт гражданина РК",
        description: "Скан-копия паспорта (все страницы)",
        status: "required",
    },
    {
        id: "statement",
        title: "Заявление на покупку",
        description: "Подписанное заявление о намерении приобрести квартиру",
        status: "required",
    }
]

export default function PurchaseProcessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const propertyId = searchParams.get("bookingId") || ""
    const [currentStep, setCurrentStep] = useState(1)
    const [booking, setBooking] = useState<StoredBooking | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [contractSigned, setContractSigned] = useState(false)
    const [documents, setDocuments] = useState(STATIC_DOCUMENTS)
    const [documentStatus, setDocumentStatus] = useState(null)

    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 2:
                return documents.every((doc) => doc.status !== "required")
            case 4:
                return contractSigned
            default:
                return true
        }
    }

    useEffect(() => {
        const loadStep = async () => {
            setIsLoading(true)
            try {
                const step = await getCurrentPurchaseStep(propertyId)
                const stepNumber = Number(step.replace("step-", ""))
                setCurrentStep(stepNumber)

                const docStatus = await getDocumentStatus(propertyId)
                setDocumentStatus(docStatus)

                const updatedDocuments = STATIC_DOCUMENTS.map((doc) => ({
                    ...doc,
                    status: docStatus || "required",
                }))
                setDocuments(updatedDocuments)

                const raw = localStorage.getItem("tenri_bookings")
                if (raw) {
                    const bookings = JSON.parse(raw)
                    const updated = bookings.map((b: any) => {
                        if (b.id === propertyId && stepNumber < 5) {
                            return {
                                ...b,
                                status: "in_progress",
                                nextStep: "Оформление в процессе",
                            }
                        }
                        return b
                    })
                    localStorage.setItem("tenri_bookings", JSON.stringify(updated))
                }
            } catch (err) {
                toast.error("Ошибка загрузки данных")
            } finally {
                setIsLoading(false)
            }
        }

        if (propertyId) {
            const foundBooking = BookingsService.getById(propertyId)
            if (foundBooking) setBooking(foundBooking)
            loadStep()
        }
    }, [propertyId])

    const handleNextStep = async () => {
        try {
            setIsLoading(true)
            await updatePurchaseStep(propertyId, `step-${currentStep}`)

            if (currentStep === STEPS.length) {
                const raw = localStorage.getItem("tenri_bookings")
                if (raw) {
                    const bookings = JSON.parse(raw)
                    const updated = bookings.map((b: any) =>
                        b.id === propertyId
                            ? {
                                ...b,
                                status: "completed",
                                nextStep: "Оформление завершено",
                            }
                            : b
                    )
                    localStorage.setItem("tenri_bookings", JSON.stringify(updated))
                    toast.success("Статус обновлён: Завершено")
                }

                router.push("/cabinet")
            } else {
                setCurrentStep((prev) => prev + 1)
            }
        } catch (err) {
            console.error(err)
            toast.error("Ошибка при обновлении шага")
        } finally {
            setIsLoading(false)
        }
    }


    const handleFileUpload = async (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        toast.success("Документ загружен. Проверка начнется скоро.")

        // Получаем и применяем общий статус
        const docStatus = await getDocumentStatus(propertyId)
        setDocumentStatus(docStatus)

        const updatedDocuments = STATIC_DOCUMENTS.map((doc) => ({
            ...doc,
            status: docStatus || "required",
        }))
        setDocuments(updatedDocuments)
    }


    const handleDownloadTemplate = (document: any) => {
        toast("Загружается шаблон для: " + document.title)
    }

    const Icon = STEPS[currentStep - 1]?.icon
    const progress = (currentStep / STEPS.length) * 100

    return isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
        </div>
    ) : (
        <div className="container py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {Icon && <Icon className="h-6 w-6" />} {STEPS[currentStep - 1]?.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Progress value={progress} className="mb-6" />

                    {currentStep === 1 && booking && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Начало оформления</h3>

                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    Вы начинаете процесс оформления выбранного вами объекта недвижимости. Пожалуйста, последовательно пройдите все этапы,
                                    чтобы успешно завершить сделку.
                                </p>
                            </div>

                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="relative w-full md:w-1/4 aspect-video md:aspect-auto">
                                            <Image
                                                src={booking.image || "/placeholder.svg"}
                                                alt={booking.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="p-6 flex-1 space-y-3">
                                            <h4 className="text-xl font-bold">{booking.title}</h4>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {booking.address}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Корпус</div>
                                                    <div className="font-medium">{booking.apartment?.building || "-"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}


                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Загрузите необходимые документы</h3>
                            {documents.map((document) => {
                                let badgeColor = "bg-yellow-500"
                                let badgeText = "Требуется"

                                if (document.status === "verified") {
                                    badgeColor = "bg-green-500"
                                    badgeText = "Проверен"
                                } else if (document.status === "waiting") {
                                    badgeColor = "bg-blue-500"
                                    badgeText = "На проверке"
                                }

                                return (
                                    <Card key={document.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium">{document.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{document.description}</p>
                                                    <Badge className={`mt-2 ${badgeColor}`}>{badgeText}</Badge>
                                                </div>
                                                <div className="flex gap-2">
                                                    {document.status === "required" && (
                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                id={`upload-${document.id}`}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={(e) => handleFileUpload(document.id, e)}
                                                            />
                                                            <Button size="sm">
                                                                <Upload className="h-4 w-4 mr-1" /> Загрузить
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Предварительный договор купли-продажи</h3>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm">
                                    Предварительный договор закрепляет ваши намерения о покупке квартиры и основные условия сделки.
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="preliminaryContract"
                                    checked={contractSigned}
                                    onCheckedChange={(checked) => setContractSigned(checked)}
                                />
                                <Label htmlFor="preliminaryContract">
                                    Я ознакомился с условиями и готов подписать предварительный договор
                                </Label>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Основной договор купли-продажи</h3>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm">
                                    Основной договор купли-продажи - это финальный документ, который оформляет переход права собственности
                                    на квартиру к вам.
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="finalContract"
                                    checked={contractSigned}
                                    onCheckedChange={(checked) => setContractSigned(checked)}
                                />
                                <Label htmlFor="finalContract">
                                    Я ознакомился с условиями и готов подписать основной договор купли-продажи
                                </Label>
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Key className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold">Поздравляем!</h3>
                            <p className="text-muted-foreground">
                                Все документы оформлены!
                            </p>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-700">
                                    Обратитесь в офис продаж для получения дополнительно информации.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                            disabled={currentStep === 1}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Назад
                        </Button>

                        <Button
                            onClick={handleNextStep}
                            disabled={!canProceedToNextStep() || isLoading}
                            className={currentStep === STEPS.length ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                            {isLoading ? (
                                "Обработка..."
                            ) : currentStep === STEPS.length ? (
                                "Завершить"
                            ) : (
                                <>
                                    Далее <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
