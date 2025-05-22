"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Check, Calendar, Building } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Apartment } from "@/services/property-service"

interface ApartmentDetailModalProps {
  apartment: Apartment
  trigger?: React.ReactNode
}

export default function ApartmentDetailModal({ apartment, trigger }: ApartmentDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Подробнее
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="py-2">
          <h2 className="text-2xl font-bold mb-2">
            {apartment.rooms}-комнатная квартира {apartment.area} м²
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Building className="h-4 w-4" />
            <span>{apartment.propertyName || apartment.building}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4" />
            <span>Сдача: {apartment.completionDate}</span>
          </div>

          <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="details">Детали</TabsTrigger>
              <TabsTrigger value="floorplan">Планировка</TabsTrigger>
              <TabsTrigger value="gallery">Галерея</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Площадь</div>
                        <div className="text-xl font-medium">{apartment.area} м²</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Этаж</div>
                        <div className="text-xl font-medium">
                          {apartment.floor} из {apartment.totalFloors}
                        </div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Комнат</div>
                        <div className="text-xl font-medium">{apartment.rooms}</div>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Отделка</div>
                      <div className="text-xl font-medium">
                        {apartment.finishing}
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Вид из окон</div>
                      <div className="text-xl font-medium">{apartment.windowView}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 p-6 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground">Стоимость</div>
                    <div className="text-3xl font-bold text-primary">{apartment.price.toLocaleString()} ₸</div>
                    <div className="text-sm text-muted-foreground">{apartment.pricePerSqm.toLocaleString()} ₸/м²</div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full">Забронировать</Button>
                    <Button variant="outline" className="w-full">
                      Ипотечный калькулятор
                    </Button>
                    <Button variant="outline" className="w-full">
                      Заказать звонок
                    </Button>
                  </div>

                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Способы оплаты:</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>100% оплата</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Ипотека</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Рассрочка от застройщика</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="floorplan" className="mt-0">
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-2xl aspect-square">
                  <Image
                    src={apartment.layout || "/placeholder.svg?height=600&width=600"}
                    alt="План квартиры"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-medium">
                    {apartment.rooms}-комнатная квартира {apartment.area} м²
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {apartment.building}, этаж {apartment.floor}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {apartment.images && apartment.images.length > 0
                  ? apartment.images.map((image, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Фото квартиры ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  : Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={`/placeholder.svg?height=200&width=300&text=Фото ${i + 1}`}
                          alt={`Фото квартиры ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
