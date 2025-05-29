import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, ArrowRight, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PurchasePage() {
  const purchaseStages = [
    {
      id: "1",
      title: "Выбор квартиры",
      description: "Выберите подходящую квартиру из доступных вариантов",
      isCompleted: true,
      isActive: false,
    },
    {
      id: "2",
      title: "Бронирование",
      description: "Забронируйте выбранную квартиру на определенный срок",
      isCompleted: true,
      isActive: false,
    },
    {
      id: "3",
      title: "Заключение договора",
      description: "Подпишите договор купли-продажи",
      isCompleted: false,
      isActive: true,
    },
    {
      id: "4",
      title: "Оплата",
      description: "Внесите оплату согласно условиям договора",
      isCompleted: false,
      isActive: false,
    },
    {
      id: "5",
      title: "Передача ключей",
      description: "Получите ключи от вашей новой квартиры",
      isCompleted: false,
      isActive: false,
    },
  ]

  const properties = [
    {
      id: "1",
      title: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      status: "В процессе покупки",
      statusColor: "bg-blue-500",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Центральный, ул. Абая, д. 5, кв. 42",
      area: 65.8,
      floor: 7,
      price: 24500000,
      completionDate: "IV кв. 2025",
      currentStage: "Заключение договора",
      nextAction: "Подписание договора 15.05.2025",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Покупка</h2>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Активные сделки</TabsTrigger>
          <TabsTrigger value="completed">Завершенные сделки</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
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
                      <Badge className={`absolute top-2 left-2 ${property.statusColor} text-white border-0`}>
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
                          <div className="text-sm text-muted-foreground">Стоимость</div>
                          <div className="font-medium">{property.price.toLocaleString()} ₸</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Срок сдачи</div>
                          <div className="font-medium">{property.completionDate}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          Текущий этап: <span className="font-medium text-foreground">{property.currentStage}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Clock className="h-4 w-4" />
                          <span>{property.nextAction}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link href={`/cabinet/purchase/${property.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            Подробнее о сделке
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="relative">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2"></div>
                      <div className="relative z-10 flex justify-between">
                        {purchaseStages.map((stage, index) => (
                          <div key={stage.id} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                                stage.isCompleted
                                  ? "bg-green-500 text-white"
                                  : stage.isActive
                                    ? "bg-primary text-white"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {stage.isCompleted ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div className="text-xs text-center max-w-[80px]">{stage.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-8 text-muted-foreground">У вас пока нет завершенных сделок</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
