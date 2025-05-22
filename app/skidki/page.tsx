'use client'
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Percent } from "lucide-react"
import Link from "next/link"
import { PromotionService } from "@/services/promotion-service"
import { useEffect, useState } from "react";

export default function DiscountsPage() {
  // Получаем список акций и скидок
  const [promotions, setPromotions] = useState<any>([]);

  useEffect(() => {
    const getPromotions = async () => {
      try {
        const response = await PromotionService.getPromotions({ limit: 3 });
        console.log(response.data)
        setPromotions(response?.data || [])
      } catch (error) {
        console.error("Ошибка при загрузке объектов:", error)
      }
    }

    getPromotions()
  }, [])
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Скидки и Акции</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promotions && promotions.map((promotion) => (
          <div key={promotion.id}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Percent className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-medium">{promotion.title}</h3>
                <p className="mb-4 flex-grow text-sm text-muted-foreground">{promotion.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    <span>Действует до {new Date(promotion.endDate).toLocaleDateString("ru-RU")}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Условия:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      {promotion.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
