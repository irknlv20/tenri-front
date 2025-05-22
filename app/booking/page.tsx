"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PropertyService } from "@/services/property-service"
import { CabinetService } from "@/services/cabinet-service"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function BookingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const propertyId = searchParams.get("propertyId")

    const [property, setProperty] = useState<any>(null)
    const [selectedApartment, setSelectedApartment] = useState<string | null>(null)
    const [apartments, setApartments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.replace("/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search))
            return
        }

        if (!propertyId) {
            router.replace("/")
            return
        }

        const loadData = async () => {
            try {
                setIsLoading(true)
                // Load property details
                const propertyResponse = await PropertyService.getProperty(propertyId)
                setProperty(propertyResponse.data)

                // Load available apartments
                const apartmentsResponse = await PropertyService.getPropertyApartments(propertyId, {
                    status: "available" // Assuming you have a status filter
                })
                setApartments(apartmentsResponse.data || [])
            } catch (error) {
                console.error("Error loading data:", error)
                toast.error("Не удалось загрузить данные")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [propertyId, router])

    const handleBooking = async () => {
        if (!selectedApartment) {
            toast.error("Выберите квартиру для бронирования")
            return
        }

        setIsLoading(true)
        try {
            const response = await CabinetService.createBooking(propertyId!, selectedApartment)
            toast.success("Бронирование успешно создано")

            // Redirect to booking details or cabinet
            router.push(`/cabinet/bookings/${response.data.booking.id}`)
        } catch (error) {
            console.error("Booking error:", error)
            toast.error("Ошибка при бронировании")
        } finally {
            setIsLoading(false)
        }
    }

    if (!property || isLoading) {
        return <div className="container py-8">Загрузка...</div>
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Бронирование</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Выберите квартиру</CardTitle>
                            <CardDescription>
                                Доступные квартиры в ЖК "{property.name}"
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {apartments.length === 0 ? (
                                <p className="text-center py-4 text-muted-foreground">
                                    Нет доступных квартир для бронирования
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {apartments.map((apartment) => (
                                        <div
                                            key={apartment.id}
                                            className={`p-4 border rounded-lg cursor-pointer ${
                                                selectedApartment === apartment.id ? "border-primary bg-primary/5" : ""
                                            }`}
                                            onClick={() => setSelectedApartment(apartment.id)}
                                        >
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-medium">{apartment.rooms}-комнатная, {apartment.area} м²</h3>
                                                    <p className="text-sm text-muted-foreground">Этаж {apartment.floor} из {apartment.totalFloors}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{apartment.price.toLocaleString()} ₸</p>
                                                    <p className="text-sm text-muted-foreground">{apartment.pricePerSqm.toLocaleString()} ₸/м²</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Информация о бронировании</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Объект</p>
                                    <p className="font-medium">{property.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Адрес</p>
                                    <p className="font-medium">{property.address}</p>
                                </div>

                                {selectedApartment && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Выбранная квартира</p>
                                            <p className="font-medium">
                                                {apartments.find(a => a.id === selectedApartment)?.rooms}-комнатная,
                                                {apartments.find(a => a.id === selectedApartment)?.area} м²
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Стоимость</p>
                                            <p className="font-bold text-xl">
                                                {apartments.find(a => a.id === selectedApartment)?.price.toLocaleString()} ₸
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Бронирование действует</p>
                                            <p className="font-medium">3 дня</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={handleBooking}
                                disabled={!selectedApartment || isLoading}
                            >
                                Забронировать
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}