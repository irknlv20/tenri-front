
'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DeveloperService } from "@/services/developer-service"
import { useEffect, useState } from "react"

export default function DevelopersPage() {
  // Получаем список застройщиков
  const [developers, setDevelopers] = useState<any>([]);

  useEffect(() => {
    const getDevelopers = async () => {
      try {
        const response = await DeveloperService.getDevelopers()
        console.log(response.data)
        setDevelopers(response?.data || [])
      } catch (error) {
        console.error("Ошибка при загрузке объектов:", error)
      }
    }

    getDevelopers()
  }, [])
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Застройщики Кызылорды</h1>

      <div className="space-y-8">
        {developers && developers.map((developer) => (
          <Card key={developer.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-1/4 flex flex-col items-center justify-center border-r">
                  <div className="relative h-24 w-48 mb-4">
                    <Image
                      src={developer.logo || "/placeholder.svg"}
                      alt={developer.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-center">{developer.name}</h2>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Основана в {developer.establishedYear} г.
                  </p>
                </div>

                <div className="p-6 md:w-2/4">
                  <p className="text-muted-foreground mb-10">{developer.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{developer.projects.length}</div>
                      <div className="text-sm text-muted-foreground">Всего проектов</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{developer.projects?.filter(p => p.status === 'completed').length || 0}</div>
                      <div className="text-sm text-muted-foreground">Завершено</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{developer.projects?.filter(p => p.status === 'in_progress').length || 0}</div>
                      <div className="text-sm text-muted-foreground">В процессе</div>
                    </div>
                  </div>
                  <Link href={`/developer/${developer.id}`}>
                    <Button variant="outline" className="w-full">
                      Подробнее о застройщике
                    </Button>
                  </Link>
                </div>

                <div className="p-6 md:w-1/4 bg-muted/30">
                  <h3 className="font-medium mb-3">Контактная информация</h3>

                  <div className="space-y-2">
                    {developer.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                        <span className="text-sm">{developer.address}</span>
                      </div>
                    )}
                    {developer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="text-sm">{developer.phone}</span>
                      </div>
                    )}
                    {developer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-sm">{developer.email}</span>
                      </div>
                    )}
                    {developer.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm">{developer.website}</span>
                      </div>
                    )}
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
