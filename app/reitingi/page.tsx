import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, ThumbsUp, Users, Building, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function RatingsPage() {
  const residentialComplexes = [
    {
      id: "1",
      name: "ЖК «Кызылорда-Сити»",
      image: "/placeholder.svg?height=200&width=300",
      location: "мкр. Центральный, ул. Абая",
      developer: "TENRI Development",
      rating: 4.8,
      reviews: 124,
      likes: 98,
      categories: {
        location: 4.9,
        quality: 4.7,
        infrastructure: 4.8,
        transport: 4.6,
        ecology: 4.5,
      },
    },
    {
      id: "2",
      name: "ЖК «Жайлы»",
      image: "/placeholder.svg?height=200&width=300",
      location: "мкр. Шымбулак, ул. Казыбек би",
      developer: "Строй Инвест",
      rating: 4.6,
      reviews: 87,
      likes: 76,
      categories: {
        location: 4.5,
        quality: 4.8,
        infrastructure: 4.4,
        transport: 4.3,
        ecology: 4.7,
      },
    },
    {
      id: "3",
      name: "ЖК «Арман»",
      image: "/placeholder.svg?height=200&width=300",
      location: "мкр. Сырдарья, ул. Токмагамбетова",
      developer: "Кызылорда Строй",
      rating: 4.5,
      reviews: 92,
      likes: 81,
      categories: {
        location: 4.7,
        quality: 4.5,
        infrastructure: 4.6,
        transport: 4.4,
        ecology: 4.3,
      },
    },
    {
      id: "4",
      name: "ЖК «Мерей»",
      image: "/placeholder.svg?height=200&width=300",
      location: "мкр. Ақмешіт, ул. Жібек жолы",
      developer: "Сырдарья Девелопмент",
      rating: 4.3,
      reviews: 68,
      likes: 59,
      categories: {
        location: 4.2,
        quality: 4.4,
        infrastructure: 4.3,
        transport: 4.5,
        ecology: 4.1,
      },
    },
    {
      id: "5",
      name: "ЖК «Нұрлы»",
      image: "/placeholder.svg?height=200&width=300",
      location: "мкр. Тасбөгет, ул. Абылай хана",
      developer: "TENRI Development",
      rating: 4.2,
      reviews: 45,
      likes: 37,
      categories: {
        location: 4.0,
        quality: 4.3,
        infrastructure: 4.1,
        transport: 4.2,
        ecology: 4.4,
      },
    },
  ]

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
                      <span>{complex.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Building className="h-4 w-4" />
                      <span>{complex.developer}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end mt-4 md:mt-0">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">{complex.rating}</span>
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
                  {Object.entries(complex.categories).map(([key, value]) => (
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
