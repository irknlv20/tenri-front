'use client'
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import PropertyCard from "./property-card"
import { PropertyService, type PropertyFilters } from "@/services/property-service"
import { useEffect, useState } from "react"

// Это серверный компонент, поэтому мы можем использовать async/await
export default function FeaturedSection() {
  // Получаем популярные объекты недвижимости
  const [properties, setProperties] = useState<any>([]);
  const filters: PropertyFilters = {
    limit: 6,
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
    <section className="py-12">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Популярные жилые комплексы</h2>
          <Link href="/novostroiki">
            <Button variant="ghost" className="gap-1">
              Все новостройки
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties && properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property?.id}
              title={property?.name}
              description={property?.description}
              price={property?.price || 0}
              pricePerSqm={property?.pricePerSqm || 0} 
              image={property?.image || "/placeholder.svg"}
              developer={property?.developer.name}
              location={property?.address}
              badge={property?.badge}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
