"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Heart } from "lucide-react"
import Image from "next/image"
import ApartmentDetailModal from "./apartment-detail-modal"
import { PropertyService, type Apartment } from "@/services/property-service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface ApartmentType {
  type: string
  count: number
  minPrice: number
  apartments: Apartment[]
  isOpen: boolean
}

interface ApartmentListingsProps {
  propertyId: string
}

export default function ApartmentListings({ propertyId }: ApartmentListingsProps) {
  const [apartmentTypes, setApartmentTypes] = useState<ApartmentType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        // Получаем список квартир в ЖК
        const response = await PropertyService.getPropertyApartments(propertyId)
        // Correctly access the apartments array from the response
        const apartments = response?.data || []
        console.log("apartments", apartments)
        // Группируем квартиры по количеству комнат
        const groupedApartments = {}

        apartments.forEach((apartment) => {
          // Use the type property if it exists, otherwise construct from rooms
          const type = apartment.type
          console.log("type", type)
          if (!groupedApartments[type]) {
            groupedApartments[type] = []
          }
          groupedApartments[type].push(apartment)
        })

        console.log("groupedApartments", groupedApartments)
        // Формируем массив типов квартир
        const types: ApartmentType[] = Object.entries(groupedApartments).map(([type, apartments]) => {
          const minPrice = Math.min(...apartments.map((a) => a.price))
          return {
            type,
            count: apartments.length,
            minPrice,
            apartments,
            isOpen: true, // По умолчанию открываем 1-комнатные или если только один тип
          }
        })

        setApartmentTypes(types)
      } catch (error) {
        console.error("Error fetching apartments:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список квартир",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApartments()
  }, [propertyId, toast])

  const toggleApartmentType = (index: number) => {
    setApartmentTypes((prev) => prev.map((type, i) => (i === index ? { ...type, isOpen: !type.isOpen } : type)))
  }

  if (loading) {
    return (
        <div className="bg-background rounded-lg shadow-sm p-4">
          <h2 className="text-xl font-bold mb-4">Квартиры</h2>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
    )
  }

  if (apartmentTypes.length === 0) {
    return (
        <div className="bg-background rounded-lg shadow-sm p-4">
          <h2 className="text-xl font-bold mb-4">Квартиры</h2>
          <div className="text-center p-8 text-muted-foreground">Информация о квартирах пока недоступна</div>
        </div>
    )
  }

  return (
      <div className="bg-background rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 p-4">Квартиры</h2>

        {apartmentTypes.map((type, index) => (
            <div key={index} className="border-t">
              <button
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => toggleApartmentType(index)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{type.type}</span>
                  <span className="text-muted-foreground">({type.count})</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">от {type.minPrice.toLocaleString()} тенге</span>
                  {type.isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {type.isOpen && type.apartments.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-6 gap-4 text-sm text-muted-foreground mb-2 px-2">
                      <div>Площадь</div>
                      <div>Этаж</div>
                      <div>Сдача</div>
                      <div>Стоимость</div>
                      <div>Планировка</div>
                      <div></div>
                    </div>

                    {type.apartments.map((apt) => (
                        <div key={apt.id} className="grid grid-cols-6 gap-4 items-center py-3 px-2 border-t">
                          <div>
                            <span className="font-medium">{apt.area}</span> м²
                          </div>
                          <div>{apt.floor}</div>
                          <div>
                            <div className="text-sm">{apt.completionDate}</div>
                            <div className="text-xs text-muted-foreground">
                              {apt.building || (apt.number && `Корпус ${apt.number.split("-")[0]}`)}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{apt.price.toLocaleString()} тенге</div>
                            <div className="text-xs text-muted-foreground">{apt.pricePerSqm.toLocaleString()} тенге/м²</div>
                          </div>
                          <div className="relative h-16 w-16">
                            <Image
                                src={apt.layout || "/placeholder.svg"}
                                alt="План квартиры"
                                fill
                                className="object-contain"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <ApartmentDetailModal apartment={apt} />
                            <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        ))}
      </div>
  )
}