"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { useRouter, notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Building, MapPin, Mail, Phone } from "lucide-react"
import { DeveloperService } from "@/services/developer-service"
import PropertyCard from "@/components/property-card"

export default function DeveloperPage({ params }: { params: Promise<{ id: string }> }) {
  const [developer, setDeveloper] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const unwrappedParams = use(params)

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const response = await DeveloperService.getDeveloper(unwrappedParams.id)
        if (!response?.data) return notFound()
        setDeveloper(response.data)
      } catch (error) {
        console.error("Ошибка при загрузке застройщика:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeveloper()
  }, [unwrappedParams.id])

  if (isLoading || !developer) return null

  const completedProjects = developer.projects?.filter((p: any) => p.status === "completed") || []
  const inProgressProjects = developer.projects?.filter((p: any) => p.status === "in_progress") || []

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{developer.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{developer.address}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">О компании</h2>
            <p className="text-muted-foreground whitespace-pre-line">{developer.description}</p>
          </div>

          {inProgressProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">В процессе строительства</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {inProgressProjects.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.name}
                    description={property.description}
                    price={property.price || 0}
                    pricePerSqm={property.pricePerSqm || 0}
                    image={property.image || "/placeholder.svg"}
                    developer={developer.name}
                    location={property.address}
                    badge={property.badge}
                  />
                ))}
              </div>
            </div>
          )}

          {completedProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Завершенные проекты</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {completedProjects.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.name}
                    description={property.description}
                    price={property.price || 0}
                    pricePerSqm={property.pricePerSqm || 0}
                    image={property.image || "/placeholder.svg"}
                    developer={developer.name}
                    location={property.address}
                    badge={property.badge}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{developer.email || "info@example.com"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Телефон</p>
                  <p className="text-sm text-muted-foreground">{developer.phone || "+7 (777) 777 7777"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Тип</p>
                  <p className="text-sm text-muted-foreground">Застройщик</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
