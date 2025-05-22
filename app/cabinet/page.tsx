"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CabinetService } from "@/services/cabinet-service"
import {redirect, useRouter} from "next/navigation"
import {useEffect, useState} from "react";

export default async function MyPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we have a token
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login?redirect=/cabinet")
      return
    }

    // Fetch properties
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const response = await CabinetService.getUserProperties()
        setProperties(response.properties || [])
      } catch (error) {
        console.error("Error fetching properties:", error)
        toast.error("Не удалось загрузить список объектов")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [router]) // Only depends on router

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Мои объекты</h2>

      {properties.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>У вас пока нет объектов недвижимости</p>
          <Link href="/novostroiki">
            <Button className="mt-4">Выбрать квартиру</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {properties.map((property) => (
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
                    <Badge
                      className={`absolute top-2 left-2 ${
                        property.status === "В процессе"
                          ? "bg-blue-500"
                          : property.status === "Оформлено"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                      } text-white border-0`}
                    >
                      {property.status}
                    </Badge>
                  </div>

                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold mb-2">{property.title}</h3>

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
                        <div className="text-sm text-muted-foreground">Документы</div>
                        <div className="font-medium">{property.documents}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link href={`/cabinet/documents?property=${property.id}`}>
                        <Button variant="outline" size="sm">
                          Документы
                        </Button>
                      </Link>
                      {property.payments > 0 && (
                        <Link href={`/cabinet/payments?property=${property.id}`}>
                          <Button variant="outline" size="sm">
                            Платежи ({property.payments})
                          </Button>
                        </Link>
                      )}
                      <Link href={`/cabinet/property/${property.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Подробнее
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
