'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Calendar, Home, MapPin } from "lucide-react"
import Image from "next/image"
import MortgageCalculator from "@/components/mortgage-calculator"
import ApartmentListings from "@/components/apartment-listings"
import MortgageModal from "@/components/mortgage-modal"
import CallbackModal from "@/components/callback-modal"
import { PropertyService } from "@/services/property-service"
import { notFound } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const [property, setProperty] = useState<any>()
  const unwrappedParams = use(params)

  useEffect(() => {
    const getProperty = async () => {
      try {
        const response = await PropertyService.getProperty(unwrappedParams.id)
        if (!response?.data) return notFound()
        console.log(response.data)  
        setProperty(response.data)
      } catch (error) {
        console.error("Ошибка при загрузке объекта:", error)
        notFound()
      }
    }

    getProperty()
  }, [unwrappedParams.id])

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
            {/* <MortgageCalculator /> */}
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
                <Button className="w-full">Забронировать</Button>
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
