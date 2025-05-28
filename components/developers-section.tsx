'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DeveloperService } from "@/services/developer-service"
import { useEffect, useState } from "react"

export default function DevelopersSection() {
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
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Надежные застройщики</h2>
          <Link href="/zastroishiki">
            <Button variant="ghost" className="gap-1">
              Все застройщики
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {developers.map((developer) => (
            <Link key={developer.id} href={`/developer/${developer.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative h-16 w-32 mb-4">
                    <Image
                      src={developer.logo || "/placeholder.svg"}
                      alt={developer.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-medium mb-1">{developer.name}</h3>
                  <p className="text-sm text-muted-foreground">{developer.projects.length} проектов</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
