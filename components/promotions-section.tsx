'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, ChevronRight, Percent } from "lucide-react"
import Link from "next/link"
import { PromotionService } from "@/services/promotion-service"
import { useEffect, useState } from "react"

export default  function PromotionsSection() {
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
    <section className="py-12">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Акции и скидки</h2>
          <Link href="/skidki">
            <Button variant="ghost" className="gap-1">
              Все акции
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {promotions && promotions.map((promotion) => (
            <div key={promotion.id}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Percent className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{promotion.title}</h3>
                  <p className="mb-4 flex-grow text-sm text-muted-foreground">{promotion.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    <span>Действует до {new Date(promotion.endDate).toLocaleDateString("ru-RU")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
