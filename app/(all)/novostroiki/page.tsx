'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SearchSection from "@/components/search-section"
import { PropertyService, type PropertyFilters } from "@/services/property-service"
import { useEffect, useState } from "react"

export default function NewBuildingsPage() {
  // Получаем список объектов недвижимости
  const [properties, setProperties] = useState<any>([]);
    const filters: PropertyFilters = {
      sort: "views",
      order: "desc",
      status: "active",
    }
  
    useEffect(() => {
      const getProperties = async () => {
        try {
          const response = await PropertyService.getProperties(filters)
          console.log(response.data)
          setProperties(response?.data || [])
        } catch (error) {
          console.error("Ошибка при загрузке объектов:", error)
        }
      }
  
      getProperties()
    }, [])
  return (
    <div>
      <SearchSection />

      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Новостройки Кызылорды</h1>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Фильтры
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link key={property.id} href={`/property/${property.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                  {property.badge && (
                    <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">
                      {property.badge}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold">{property.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{property.address}</span>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{property.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Цена от</div>
                      <div className="font-bold text-primary">{property.price.toLocaleString()} ₸</div>
                      <div className="text-xs text-muted-foreground">{property.pricePerSqm.toLocaleString()} ₸/м²</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Срок сдачи</div>
                      <div className="font-medium">{new Date(property.endDate).toLocaleDateString("ru-RU")}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{property.developer.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Площадь: </span>
                      <span>
                        {property.minArea}-{property.maxArea} м²
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.rooms.map((room) => (
                      <Badge key={room} variant="outline" className="bg-muted/50">
                        {room}-комн
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
