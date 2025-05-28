"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {Building, Calendar, Home, MapPin, Heart, BarChart3} from "lucide-react"
import Image from "next/image"
import MortgageCalculator from "@/components/mortgage-calculator"
import ApartmentListings from "@/components/apartment-listings"
import MortgageModal from "@/components/mortgage-modal"
import CallbackModal from "@/components/callback-modal"
import { PropertyService } from "@/services/property-service"
import { CabinetService } from "@/services/cabinet-service"
import { notFound, useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { toast } from "sonner"
import { FavoritesService, ComparisonService } from "@/lib/localStorage"

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const [property, setProperty] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInCompare, setIsInCompare] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const unwrappedParams = use(params)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)

    const getProperty = async () => {
      try {
        setIsLoading(true)
        const response = await PropertyService.getProperty(unwrappedParams.id)
        if (!response?.data) return notFound()
        setProperty(response.data)

        // If user is authenticated, check if property is in favorites
        if (token) {
          try {
            const favoritesResponse = await CabinetService.getFavorites()
            const favorites = favoritesResponse?.data?.favorites || []
            setIsFavorite(favorites.some(fav => fav.propertyId === unwrappedParams.id))
          } catch (error) {
            console.error("Error checking favorites:", error)
          }
        }
      } catch (error) {
        console.error("Error loading property:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    setIsInCompare(ComparisonService.isInComparison(unwrappedParams.id))
    setIsFavorite(FavoritesService.isInFavorites(unwrappedParams.id))
    getProperty()
  }, [unwrappedParams.id, isFavorite, isInCompare])

  const handleAddToComparison = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=" + encodeURIComponent(`/property/${unwrappedParams.id}`))
      return
    }

    try {
      if (ComparisonService.isInComparison(unwrappedParams.id)) {
        toast.info("Объект уже добавлен в сравнение")
        return
      }

      ComparisonService.add(property)
      toast.success("Объект добавлен в сравнение")
      setIsInCompare(true)
    } catch (error) {
      console.error("Error adding to comparison:", error)
      toast.error(error instanceof Error ? error.message : "Ошибка при добавлении в сравнение")
    }
  }

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=" + encodeURIComponent(`/property/${unwrappedParams.id}`))
      return
    }

    try {
      if (isFavorite) {
        FavoritesService.removeByPropertyId(unwrappedParams.id)
        toast.success("Удалено из избранного")
      } else {
        FavoritesService.add(property)
        toast.success("Добавлено в избранное")
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("Ошибка при обновлении избранного")
    }
  }

  const handleBooking = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push("/login?redirect=" + encodeURIComponent(`/property/${unwrappedParams.id}`))
      return
    }

    // Navigate to booking page/modal
    router.push(`/booking?propertyId=${unwrappedParams.id}`)
  }

  if (!property) return null

  return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.address}</span>
          </div>
        </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={property.image || "/placeholder.svg"}
              alt={property.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">О жилом комплексе</h2>
            <p className="text-muted-foreground">{property.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Особенности</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.features?.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <ApartmentListings propertyId={property.id} />

          <div className="mt-8">
            <MortgageCalculator property={property}/>
          </div>
        </div>

          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Цена от</p>
                  <p className="text-3xl font-bold text-primary">{property.price?.toLocaleString()} ₸</p>
                  <p className="text-sm text-muted-foreground">от {property.pricePerSqm?.toLocaleString()} ₸/м²</p>
                </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Застройщик</p>
                    <p className="text-sm text-muted-foreground">{property.developer?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Срок сдачи</p>
                    <p className="text-sm text-muted-foreground">{new Date(property.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Класс жилья</p>
                    <p className="text-sm text-muted-foreground">{property?.buildingType || "Комфорт"}</p>
                  </div>
                </div>
              </div>

                <div className="space-y-3">
                  <Button
                      className="w-full"
                      onClick={handleBooking}
                      disabled={isLoading}
                  >
                    Забронировать
                  </Button>

                  {isAuthenticated && (
                      <>
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
                            onClick={toggleFavorite}
                            disabled={isLoading}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary" : ""}`} />
                          {isFavorite ? "В избранном" : "В избранное"}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
                            onClick={handleAddToComparison}
                            disabled={isInCompare}
                        >
                          <BarChart3 className="h-4 w-4" />
                          {isInCompare ? "В сравнении" : "Сравнить"}
                        </Button>
                      </>
                  )}

                  <MortgageModal propertyId={property.id} />
                  <CallbackModal propertyId={property.id} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}