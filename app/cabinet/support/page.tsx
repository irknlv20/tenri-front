import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, MessageSquare, Clock, CheckCircle, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SupportPage() {
  const activeRequests = [
    {
      id: "1",
      title: "Консультация по ипотеке",
      status: "В процессе",
      statusColor: "bg-blue-500",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      propertyImage: "/placeholder.svg?height=150&width=250",
      address: "мкр. Центральный, ул. Абая, д. 5, кв. 42",
      createdDate: "10.05.2025",
      lastUpdate: "12.05.2025",
      manager: "Алия Сериковна",
      messages: 5,
      nextAction: "Ожидается ответ менеджера",
    },
    {
      id: "2",
      title: "Вопрос по документам",
      status: "Ожидает ответа",
      statusColor: "bg-yellow-500",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      propertyImage: "/placeholder.svg?height=150&width=250",
      address: "мкр. Центральный, ул. Абая, д. 5, кв. 42",
      createdDate: "11.05.2025",
      lastUpdate: "11.05.2025",
      manager: "Назначается",
      messages: 1,
      nextAction: "Ожидается назначение менеджера",
    },
  ]

  const completedRequests = [
    {
      id: "3",
      title: "Вопрос по планировке",
      status: "Завершено",
      statusColor: "bg-green-500",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      propertyImage: "/placeholder.svg?height=150&width=250",
      address: "мкр. Центральный, ул. Абая, д. 5, кв. 42",
      createdDate: "01.05.2025",
      lastUpdate: "05.05.2025",
      manager: "Алия Сериковна",
      messages: 8,
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Сопровождение</h2>

      <div className="flex justify-end mb-4">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Новый запрос
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Активные запросы</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-6">
            {activeRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 border-r md:w-1/3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{request.title}</h3>
                        <Badge className={`${request.statusColor} text-white border-0`}>{request.status}</Badge>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Создан</div>
                          <div>{request.createdDate}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Последнее обновление</div>
                          <div>{request.lastUpdate}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Менеджер</div>
                          <div>{request.manager}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Сообщения</div>
                          <div>{request.messages}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                        <Clock className="h-4 w-4" />
                        <span>{request.nextAction}</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="text-sm text-muted-foreground mb-2">Объект</div>
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative w-full md:w-1/3 aspect-video">
                          <Image
                            src={request.propertyImage || "/placeholder.svg"}
                            alt={request.property}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{request.property}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{request.address}</span>
                          </div>
                        </div>
                      </div>

                      <Link href={`/cabinet/support/${request.id}`}>
                        <Button className="w-full gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Перейти к обсуждению
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-6">
            {completedRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 border-r md:w-1/3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{request.title}</h3>
                        <Badge className={`${request.statusColor} text-white border-0`}>{request.status}</Badge>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Создан</div>
                          <div>{request.createdDate}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Завершен</div>
                          <div>{request.lastUpdate}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Менеджер</div>
                          <div>{request.manager}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Сообщения</div>
                          <div>{request.messages}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <span>Запрос успешно завершен</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="text-sm text-muted-foreground mb-2">Объект</div>
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative w-full md:w-1/3 aspect-video">
                          <Image
                            src={request.propertyImage || "/placeholder.svg"}
                            alt={request.property}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{request.property}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{request.address}</span>
                          </div>
                        </div>
                      </div>

                      <Link href={`/cabinet/support/${request.id}`}>
                        <Button variant="outline" className="w-full gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Просмотреть историю
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
