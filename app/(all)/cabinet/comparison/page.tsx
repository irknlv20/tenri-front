"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight, X, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ComparisonService, type StoredComparison } from "@/lib/localStorage"
import { toast } from "sonner"

export default function ComparisonPage() {
  const [comparison, setComparison] = useState<StoredComparison[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadComparison = () => {
      try {
        const storedComparison = ComparisonService.getAll()
        setComparison(storedComparison)
      } catch (error) {
        console.error("Error loading comparison:", error)
        toast.error("Ошибка при загрузке сравнения")
      } finally {
        setIsLoading(false)
      }
    }

    loadComparison()
  }, [])

  const handleRemoveFromComparison = (id: string) => {
    try {
      ComparisonService.remove(id)
      setComparison((prev) => prev.filter((item) => item.id !== id))
      toast.success("Объект удален из сравнения")
    } catch (error) {
      console.error("Error removing from comparison:", error)
      toast.error("Ошибка при удалении из сравнения")
    }
  }

  const handleClearAll = () => {
    if (window.confirm("Вы уверены, что хотите очистить все сравнение?")) {
      try {
        ComparisonService.clear()
        setComparison([])
        toast.success("Сравнение очищено")
      } catch (error) {
        console.error("Error clearing comparison:", error)
        toast.error("Ошибка при очистке сравнения")
      }
    }
  }

  if (isLoading) {
    return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Сравнение объектов</h2>
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
    )
  }

  if (comparison.length === 0) {
    return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Сравнение объектов</h2>
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Нет объектов для сравнения</h3>
            <p className="text-muted-foreground mb-4">
              Добавьте объекты в сравнение, чтобы увидеть их характеристики рядом
            </p>
            <Link href="/novostroiki">
              <Button>Посмотреть объекты</Button>
            </Link>
          </div>
        </div>
    )
  }

  const comparisonFields = [
    { key: "price", label: "Стоимость", format: (value: number) => `${value.toLocaleString()} ₸` },
    { key: "pricePerSqm", label: "Цена за м²", format: (value: number) => `${value.toLocaleString()} ₸/м²` },
    { key: "area", label: "Площадь", format: (value: number) => `${value} м²` },
    { key: "floor", label: "Этаж", format: (value: number) => value.toString() },
    { key: "ceilingHeight", label: "Высота потолков", format: (value: number) => `${value} м` },
    { key: "finishing", label: "Отделка", format: (value: string) => value },
    { key: "windowView", label: "Вид из окон", format: (value: string) => value },
    { key: "parking", label: "Парковка", format: (value: string) => value },
    { key: "heating", label: "Отопление", format: (value: string) => value },
    { key: "buildingType", label: "Тип здания", format: (value: string) => value },
    { key: "completionDate", label: "Срок сдачи", format: (value: string) => new Date(value).toLocaleDateString() },
    { key: "developer", label: "Застройщик", format: (value: string) => value },
  ]

  return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Сравнение объектов</h2>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить все
          </Button>
        </div>

        {/* Mobile view - cards */}
        <div className="block lg:hidden space-y-6">
          {comparison.map((item) => (
              <Card key={item.id}>
                <CardHeader className="relative">
                  <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => handleRemoveFromComparison(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{item.address}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {comparisonFields.map((field) => (
                      <div key={field.key} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{field.label}:</span>
                        <span className="text-sm font-medium">{field.format((item as any)[field.key])}</span>
                      </div>
                  ))}
                  <Link href={`/property/${item.propertyId}`} className="block mt-4">
                    <Button className="w-full" size="sm">
                      Подробнее
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Desktop view - table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Property cards row */}
              <div
                  className="grid grid-cols-1 gap-4 mb-6"
                  style={{ gridTemplateColumns: `repeat(${comparison.length}, 1fr)` }}
              >
                {comparison.map((item) => (
                    <Card key={item.id} className="relative">
                      <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 z-10"
                          onClick={() => handleRemoveFromComparison(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <CardContent className="p-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                          <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{item.address}</span>
                        </div>
                        <Link href={`/property/${item.propertyId}`}>
                          <Button className="w-full" size="sm">
                            Подробнее
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                ))}
              </div>

              {/* Comparison table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                      {comparisonFields.map((field) => (
                          <tr key={field.key} className="border-b">
                            <td className="p-4 font-medium bg-muted/50 min-w-[150px]">{field.label}</td>
                            {comparison.map((item) => (
                                <td key={item.id} className="p-4 text-center">
                                  {field.format((item as any)[field.key])}
                                </td>
                            ))}
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}
