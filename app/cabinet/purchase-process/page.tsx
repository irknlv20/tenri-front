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
    CreditCard,
    PenTool,
    Key,
    ArrowRight,
    ArrowLeft,
    Upload,
    Download,
    DollarSign,
} from "lucide-react"
import {
    BookingsService,
    DocumentsService,
    PaymentsService,
    PurchasesService,
    type StoredBooking,
    type StoredDocument,
    type StoredPayment,
} from "@/lib/localStorage"
import { toast } from "sonner"
import Image from "next/image"

const STEPS = [
    { id: 1, title: "Подтверждение", icon: CheckCircle },
    { id: 2, title: "Документы", icon: FileText },
    { id: 3, title: "Ипотека", icon: CreditCard },
    { id: 4, title: "Предварительный договор", icon: PenTool },
    { id: 5, title: "Платежи", icon: DollarSign },
    { id: 6, title: "Основной договор", icon: PenTool },
    { id: 7, title: "Получение ключей", icon: Key },
]

export default function PurchaseProcessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const bookingId = searchParams.get("bookingId")
    const purchaseId = searchParams.get("purchaseId")

    const [currentStep, setCurrentStep] = useState(1)
    const [booking, setBooking] = useState<StoredBooking | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Step 1 - Confirmation
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "mortgage" | "installment">("cash")
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    // Step 2 - Documents
    const [documents, setDocuments] = useState<StoredDocument[]>([])

    // Step 3 - Mortgage
    const [mortgageAmount, setMortgageAmount] = useState("")
    const [monthlyIncome, setMonthlyIncome] = useState("")
    const [selectedBank, setSelectedBank] = useState("")

    // Step 4 & 6 - Contracts
    const [contractSigned, setContractSigned] = useState(false)

    useEffect(() => {
        const purchaseIdFromUrl = searchParams.get("purchaseId")
        const bookingIdFromUrl = searchParams.get("bookingId")

        if (purchaseIdFromUrl) {
            // Загружаем существующую покупку
            const existingPurchase = PurchasesService.getById(purchaseIdFromUrl)
            if (existingPurchase) {
                setCurrentStep(existingPurchase.currentStep)
                // Загружаем данные покупки
            }
        } else if (bookingIdFromUrl) {
            // Создаем новую покупку из бронирования
            const foundBooking = BookingsService.getById(bookingIdFromUrl)
            if (foundBooking) {
                setBooking(foundBooking)
                loadDocuments()
            }
        }
    }, [searchParams])

    const loadDocuments = () => {
        const purchaseIdFromUrl = searchParams.get("purchaseId")
        const bookingIdFromUrl = searchParams.get("bookingId")

        if (purchaseIdFromUrl) {
            const docs = DocumentsService.getByPurchase(purchaseIdFromUrl)
            setDocuments(docs)
        } else if (bookingIdFromUrl) {
            // Для обратной совместимости, если еще используется bookingId
            const docs = DocumentsService.getAll().filter((doc) => doc.bookingId === bookingIdFromUrl)
            setDocuments(docs)
        }
    }

    const handleNextStep = async () => {
        setIsLoading(true)

        try {
            switch (currentStep) {
                case 1:
                    await handleConfirmationStep()
                    break
                case 2:
                    await handleDocumentsStep()
                    break
                case 3:
                    await handleMortgageStep()
                    break
                case 4:
                    await handlePreliminaryContractStep()
                    break
                case 5:
                    await handlePaymentsStep()
                    break
                case 6:
                    await handleFinalContractStep()
                    break
                case 7:
                    await handleCompletionStep()
                    break
            }

            if (currentStep < STEPS.length) {
                setCurrentStep(currentStep + 1)
                toast.success(`Шаг ${currentStep} завершен`)
            }
        } catch (error) {
            console.error("Error in step:", error)
            toast.error("Ошибка при выполнении шага")
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmationStep = async () => {
        if (!agreedToTerms) {
            throw new Error("Необходимо согласиться с условиями")
        }

        // Создаем график платежей в зависимости от выбранного способа
        if (booking) {
            if (paymentMethod === "installment") {
                PaymentsService.createPaymentSchedule(booking.id, booking.propertyId, booking.price, booking.price * 0.3)
            } else if (paymentMethod === "cash") {
                PaymentsService.add({
                    bookingId: booking.id,
                    propertyId: booking.propertyId,
                    type: "initial_payment",
                    amount: booking.price,
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "pending",
                    description: "Полная оплата квартиры",
                })
            }
        }
    }

    const handleDocumentsStep = async () => {
        const purchaseIdFromUrl = searchParams.get("purchaseId")
        const bookingIdFromUrl = searchParams.get("bookingId")

        let existingDocs: StoredDocument[] = []

        if (purchaseIdFromUrl) {
            existingDocs = DocumentsService.getByPurchase(purchaseIdFromUrl)
        } else if (bookingIdFromUrl) {
            existingDocs = DocumentsService.getAll().filter((doc) => doc.bookingId === bookingIdFromUrl)
        }

        if (existingDocs.length === 0) {
            const requiredDocs = [
                {
                    title: "Паспорт гражданина РК",
                    type: "passport" as const,
                    purchaseId: purchaseIdFromUrl || undefined,
                    bookingId: bookingIdFromUrl || undefined,
                    propertyId: booking!.propertyId,
                    status: "required" as const,
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    description: "Скан-копия паспорта (все страницы)",
                },
                {
                    title: "Справка о доходах",
                    type: "income" as const,
                    purchaseId: purchaseIdFromUrl || undefined,
                    bookingId: bookingIdFromUrl || undefined,
                    propertyId: booking!.propertyId,
                    status: "required" as const,
                    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    description: "Справка с места работы за последние 6 месяцев",
                },
            ]

            requiredDocs.forEach((doc) => DocumentsService.add(doc))
            loadDocuments()
        }

        // Проверяем, что все документы загружены
        const requiredDocs = documents.filter((doc) => doc.status === "required")
        if (requiredDocs.length > 0) {
            throw new Error("Необходимо загрузить все документы")
        }
    }

    const handleMortgageStep = async () => {
        if (paymentMethod === "mortgage") {
            if (!mortgageAmount || !monthlyIncome || !selectedBank) {
                throw new Error("Заполните все поля для ипотеки")
            }
            // Здесь можно добавить логику подачи заявки на ипотеку
            toast.success("Заявка на ипотеку подана")
        }
        // Если не ипотека, пропускаем этот шаг
    }

    const handlePreliminaryContractStep = async () => {
        if (!contractSigned) {
            throw new Error("Необходимо подписать предварительный договор")
        }

        // Создаем документ предварительного договора
        DocumentsService.add({
            title: "Предварительный договор купли-продажи",
            type: "contract",
            bookingId: bookingId!,
            propertyId: booking!.propertyId,
            status: "signed",
            description: "Предварительный договор купли-продажи квартиры",
        })
    }

    const handlePaymentsStep = async () => {
        const purchaseIdFromUrl = searchParams.get("purchaseId")
        const bookingIdFromUrl = searchParams.get("bookingId")

        let payments: StoredPayment[] = []

        if (purchaseIdFromUrl) {
            payments = PaymentsService.getByPurchase(purchaseIdFromUrl)
        } else if (bookingIdFromUrl) {
            payments = PaymentsService.getAll().filter((p) => p.bookingId === bookingIdFromUrl)
        }

        const pendingPayments = payments.filter((p) => p.status === "pending")

        if (pendingPayments.length > 0) {
            throw new Error("Необходимо внести все платежи")
        }
    }

    const handleFinalContractStep = async () => {
        if (!contractSigned) {
            throw new Error("Необходимо подписать основной договор")
        }

        // Создаем документ основного договора
        DocumentsService.add({
            title: "Договор купли-продажи",
            type: "contract",
            bookingId: bookingId!,
            propertyId: booking!.propertyId,
            status: "signed",
            description: "Основной договор купли-продажи квартиры",
        })
    }

    const handleCompletionStep = async () => {
        // Завершаем процесс покупки
        toast.success("Поздравляем! Квартира ваша!")
        setTimeout(() => {
            router.push("/cabinet")
        }, 2000)
    }

    const handleFileUpload = (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        DocumentsService.uploadDocument(documentId, file)
        // Автоматически помечаем как проверенный для демо
        setTimeout(() => {
            DocumentsService.updateStatus(documentId, "verified")
            loadDocuments()
            toast.success("Документ загружен и проверен")
        }, 1000)
    }

    const handleDownloadTemplate = (document: StoredDocument) => {
        const blob = DocumentsService.generateTemplate(document.type, document.title)
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${document.title.replace(/\s+/g, "_")}_template.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Шаблон документа скачан")
    }

    const simulatePayment = (paymentId: string) => {
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        PaymentsService.markAsPaid(paymentId, "card", transactionId)

        // Обновляем локальное состояние
        loadDocuments()

        toast.success("Платеж проведен")
    }

    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 1:
                return agreedToTerms
            case 2:
                return documents.every((doc) => doc.status !== "required")
            case 3:
                return paymentMethod !== "mortgage" || (mortgageAmount && monthlyIncome && selectedBank)
            case 4:
            case 6:
                return contractSigned
            case 5:
                const payments = PaymentsService.getByBooking(bookingId!)
                return payments.every((p) => p.status === "paid")
            default:
                return true
        }
    }

    if (!booking) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    const progress = (currentStep / STEPS.length) * 100
    const Icon = STEPS[currentStep - 1].icon;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Назад
                    </Button>
                    <h1 className="text-3xl font-bold">Процесс покупки</h1>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Шаг {currentStep} из {STEPS.length}
            </span>
                        <span>{Math.round(progress)}% завершено</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Steps Navigation */}
                <div className="flex justify-between mb-8">
                    {STEPS.map((step) => (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center ${
                                step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                    step.id < currentStep
                                        ? "bg-primary text-white"
                                        : step.id === currentStep
                                            ? "bg-primary/20 text-primary border-2 border-primary"
                                            : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {step.id < currentStep ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                            </div>
                            <span className="text-xs text-center">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Property Info */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20">
                            <Image
                                src={booking.image || "/placeholder.svg"}
                                alt={booking.title}
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold">{booking.title}</h3>
                            <p className="text-muted-foreground">{booking.address}</p>
                            <p className="text-lg font-bold">{booking.price.toLocaleString()} ₸</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Step Content */}
            <Card>
                <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {Icon && <Icon className="h-6 w-6" />}
                            {STEPS[currentStep - 1].title}
                        </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1: Confirmation */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Выберите способ оплаты</h3>
                                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="cash" id="cash" />
                                        <Label htmlFor="cash">Полная оплата</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="installment" id="installment" />
                                        <Label htmlFor="installment">Рассрочка от застройщика</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="mortgage" id="mortgage" />
                                        <Label htmlFor="mortgage\">Ипотека</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Separator />

                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked)} />
                                <Label htmlFor="terms">Я согласен с условиями покупки и готов приступить к оформлению</Label>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Documents */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Загрузите необходимые документы</h3>
                            {documents.map((document) => (
                                <Card key={document.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">{document.title}</h4>
                                                <p className="text-sm text-muted-foreground">{document.description}</p>
                                                <Badge className={`mt-2 ${document.status === "verified" ? "bg-green-500" : "bg-yellow-500"}`}>
                                                    {document.status === "verified" ? "Проверен" : "Требуется"}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate(document)}>
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Шаблон
                                                </Button>
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
                                                            <Upload className="h-4 w-4 mr-1" />
                                                            Загрузить
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Mortgage */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            {paymentMethod === "mortgage" ? (
                                <>
                                    <h3 className="text-lg font-medium">Заявка на ипотеку</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="mortgageAmount">Сумма ипотеки (₸)</Label>
                                            <Input
                                                id="mortgageAmount"
                                                value={mortgageAmount}
                                                onChange={(e) => setMortgageAmount(e.target.value)}
                                                placeholder="Введите сумму"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="monthlyIncome">Ежемесячный доход (₸)</Label>
                                            <Input
                                                id="monthlyIncome"
                                                value={monthlyIncome}
                                                onChange={(e) => setMonthlyIncome(e.target.value)}
                                                placeholder="Введите доход"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="bank">Выберите банк</Label>
                                        <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="kaspi" id="kaspi" />
                                                <Label htmlFor="kaspi">Kaspi Bank</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="halyk" id="halyk" />
                                                <Label htmlFor="halyk">Halyk Bank</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="forte" id="forte" />
                                                <Label htmlFor="forte">Forte Bank</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">Ипотека не требуется для выбранного способа оплаты</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Preliminary Contract */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Предварительный договор купли-продажи</h3>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm">
                                    Предварительный договор закрепляет ваши намерения о покупке квартиры и основные условия сделки. После
                                    подписания вы сможете перейти к внесению платежей.
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

                    {/* Step 5: Payments */}
                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Внесение платежей</h3>
                            {(() => {
                                const purchaseIdFromUrl = searchParams.get("purchaseId")
                                const bookingIdFromUrl = searchParams.get("bookingId")

                                let payments: StoredPayment[] = []

                                if (purchaseIdFromUrl) {
                                    payments = PaymentsService.getByPurchase(purchaseIdFromUrl)
                                } else if (bookingIdFromUrl) {
                                    payments = PaymentsService.getAll().filter((p) => p.bookingId === bookingIdFromUrl)
                                }

                                return payments
                            })().map((payment) => (
                                <Card key={payment.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">{payment.description}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Срок: {new Date(payment.dueDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-lg font-bold">{payment.amount.toLocaleString()} ₸</p>
                                            </div>
                                            <div>
                                                {payment.status === "paid" ? (
                                                    <Badge className="bg-green-500">Оплачен</Badge>
                                                ) : (
                                                    <Button onClick={() => simulatePayment(payment.id)}>Оплатить</Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Step 6: Final Contract */}
                    {currentStep === 6 && (
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

                    {/* Step 7: Completion */}
                    {currentStep === 7 && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Key className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold">Поздравляем!</h3>
                            <p className="text-muted-foreground">
                                Все документы оформлены, платежи внесены. Вы можете получить ключи от вашей новой квартиры!
                            </p>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-700">
                                    Обратитесь в офис продаж для получения ключей и документов на квартиру.
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
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Назад
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
                                    Далее
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
