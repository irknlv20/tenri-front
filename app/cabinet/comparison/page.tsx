import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Trash2, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ComparisonPage() {
  const comparisonItems = [
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
      ceilingHeight: 2.8,
      finishing: "Чистовая",
      windowView: "Во двор",
      parking: "Подземный",
      heating: "Центральное",
      buildingType: "Монолитно-каркасный",
    },
    {
      id: "2",
      title: "3-комнатная квартира в ЖК «Жайлы»",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Шымбулак, ул. Казыбек би, д. 12",
      area: 87.2,
      floor: 7,
      price: 30520000,
      pricePerSqm: 350000,
      completionDate: "II кв. 2024",
      developer: "Строй Инвест",
      ceilingHeight: 2.7,
      finishing: "Чистовая",
      windowView: "На улицу",
      parking: "Наземный",
      heating: "Центральное",
      buildingType: "Монолитно-каркасный",
    },
    {
      id: "3",
      title: "3-комнатная квартира в ЖК «Арман»",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Сырдарья, ул. Токмагамбетова, д. 8",
      area: 82.5,
      floor: 4,
      price: 31350000,
      pricePerSqm: 380000,
      completionDate: "III кв. 2024",
      developer: "Кызылорда Строй",
      ceilingHeight: 2.8,
      finishing: "Предчистовая",
      windowView: "На улицу и во двор",
      parking: "Подземный",
      heating: "Центральное",
      buildingType: "Кирпичный",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Сравнение</h2>

      <Tabs defaultValue="apartments">
        <TabsList className="mb-6">
          <TabsTrigger value="apartments">Квартиры</TabsTrigger>
          <TabsTrigger value="complexes">Жилые комплексы</TabsTrigger>
        </TabsList>

        <TabsContent value="apartments">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Характеристики</TableHead>
                  {comparisonItems.map((item) => (
                    <TableHead key={item.id} className="min-w-[250px]">
                      <div className="relative aspect-video w-full mb-2">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-left">{item.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.address}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive -mt-1 -mr-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-[100px]">
                    <Button
                      variant="outline"
                      className="w-full h-full flex flex-col items-center justify-center gap-2 min-h-[150px]"
                    >
                      <Plus className="h-6 w-6" />
                      <span>Добавить</span>
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Цена</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-price`}>
                      <div className="font-bold text-primary">{item.price.toLocaleString()} ₸</div>
                      <div className="text-xs text-muted-foreground">{item.pricePerSqm.toLocaleString()} ₸/м²</div>
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Площадь</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-area`}>{item.area} м²</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Этаж</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-floor`}>{item.floor}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Срок сдачи</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-completion`}>{item.completionDate}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Застройщик</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-developer`}>{item.developer}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Высота потолков</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-ceiling`}>{item.ceilingHeight} м</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Отделка</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-finishing`}>{item.finishing}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Вид из окон</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-view`}>{item.windowView}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Паркинг</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-parking`}>{item.parking}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Отопление</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-heating`}>{item.heating}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Тип дома</TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-building`}>{item.buildingType}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  {comparisonItems.map((item) => (
                    <TableCell key={`${item.id}-action`}>
                      <Link href={`/property/${item.id}`}>
                        <Button className="w-full">Подробнее</Button>
                      </Link>
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="complexes">
          <div className="text-center py-8 text-muted-foreground">У вас пока нет жилых комплексов для сравнения</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
