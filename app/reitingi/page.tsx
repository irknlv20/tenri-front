'use client'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PropertyFilters, PropertyService } from "@/services/property-service"
import { Star, ThumbsUp, Users, Building, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function RatingsPage() {
  const [residentialComplexes, setResidentialComplexes] = useState<any>([]);
  const filters: PropertyFilters = {
    sort: "views",
    order: "desc",
    status: "active",
  }
  // {
  //       id: "1",
  //       name: "ЖК «Кызылорда-Сити»",
  //       image: "/placeholder.svg?height=200&width=300",
  //       location: "мкр. Центральный, ул. Абая",
  //       developer: "TENRI Development",
  //       rating: 4.8,
  //       reviews: 124,
  //       likes: 98,
  //       categories: {
  //         location: 4.9,
  //         quality: 4.7,
  //         infrastructure: 4.8,
  //         transport: 4.6,
  //         ecology: 4.5,
  //       },
  //     },
  useEffect(() => {
    const getProperties = async () => {
      try {
        const response = await PropertyService.getProperties(filters)

        const sorted = (response?.data || []).sort(
          (a, b) => b.averageRating - a.averageRating
        )

        console.log(sorted)
        setResidentialComplexes(sorted)
      } catch (error) {
        console.error("Ошибка при загрузке объектов:", error)
      }
    }

    getProperties()
  }, [])


  const categoryLabels = {
    location: "Расположение",
    quality: "Качество строительства",
    infrastructure: "Инфраструктура",
    transport: "Транспортная доступность",
    ecology: "Экология",
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Рейтинг новостроек Кызылорды</h1>

      <div className="space-y-8">
        {residentialComplexes.map((complex, index) => (
          <Card key={complex.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/3 aspect-[4/3]">
                <Image src={complex.image || "/placeholder.svg"} alt={complex.name} fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  #{index + 1}
                </div>
              </div>

              <div className="p-6 flex-1">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <Link href={`/property/${complex.id}`}>
                      <h2 className="text-2xl font-bold hover:text-primary transition-colors">{complex.name}</h2>
                    </Link>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{complex.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Building className="h-4 w-4" />
                      <span>{complex.developer?.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end mt-4 md:mt-0">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">{complex.averageRating}</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{complex.reviews} отзывов</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{complex.likes} рекомендаций</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                  {Object.entries(complex.categoryRatings).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-sm min-w-[180px]">
                        {categoryLabels[key as keyof typeof categoryLabels]}
                      </span>
                      <Progress value={value * 20} className="h-2 flex-1" />
                      <span className="text-sm font-medium min-w-[30px]">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Link href={`/property/${complex.id}`}>
                    <Button variant="outline" className="w-full">
                      Подробнее о ЖК
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
