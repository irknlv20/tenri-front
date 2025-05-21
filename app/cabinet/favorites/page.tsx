import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function FavoritesPage() {
  const favorites = [
    {
      id: "1",
      title: "3-комнатная квартира в ЖК «Кызылорда-Сити»",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Центральный, ул. Абая, д. 5",
      area: 85.3,
      floor: 9,
      price: 32500000,
      pricePerSqm: 380000,
      completionDate: "IV кв. 2025",
      developer: "TENRI Development",
      addedDate: "10.05.2025",
    },
    {
      id: "2",
      title: "2-комнатная квартира в ЖК «Жайлы»",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Шымбулак, ул. Казыбек би, д. 12",
      area: 62.5,
      floor: 5,
      price: 21800000,
      pricePerSqm: 348800,
      completionDate: "II кв. 2024",
      developer: "Строй Инвест",
      addedDate: "05.05.2025",
    },
    {
      id: "3",
      title: "1-комнатная квартира в ЖК «Арман»",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Сырдарья, ул. Токмагамбетова, д. 8",
      area: 42.8,
      floor: 3,
      price: 16264000,
      pricePerSqm: 380000,
      completionDate: "III кв. 2024",
      developer: "Кызылорда Строй",
      addedDate: "01.05.2025",
      badge: "Акция",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Избранное</h2>

      <div className="space-y-6">
        {favorites.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/4 aspect-video md:aspect-auto">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  {property.badge && (
                    <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                      {property.badge}
                    </Badge>
                  )}
                </div>

                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{property.title}</h3>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Площадь</div>
                      <div className="font-medium">{property.area} м²</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Этаж</div>
                      <div className="font-medium">{property.floor}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Срок сдачи</div>
                      <div className="font-medium">{property.completionDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Застройщик</div>
                      <div className="font-medium">{property.developer}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xl font-bold text-primary">{property.price.toLocaleString()} ₸</div>
                      <div className="text-sm text-muted-foreground">{property.pricePerSqm.toLocaleString()} ₸/м²</div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/property/${property.id}`}>
                        <Button>Подробнее</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
