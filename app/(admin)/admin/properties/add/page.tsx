"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addProperty } from "../actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X } from "lucide-react"

export default function AddPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [images, setImages] = useState<string[]>([])

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await addProperty(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Перенаправление на список объектов после короткой задержки
        setTimeout(() => {
          router.push("/admin/properties")
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Произошла непредвиденная ошибка" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Имитация загрузки изображений
  const handleImageUpload = () => {
    // В реальном приложении здесь была бы загрузка файлов
    const newImage = `/placeholder.svg?height=600&width=800&text=Image ${images.length + 1}`
    setImages([...images, newImage])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Добавить новый объект</h1>
        <p className="text-muted-foreground mt-2">Создайте новое объявление о недвижимости для вашего сайта</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <form action={handleSubmit}>
          <CardHeader>
            <CardTitle>Детали объекта</CardTitle>
            <CardDescription>Введите информацию об объекте недвижимости, который вы хотите разместить</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList>
                <TabsTrigger value="basic">Основная информация</TabsTrigger>
                <TabsTrigger value="details">Детали и характеристики</TabsTrigger>
                <TabsTrigger value="media">Медиа</TabsTrigger>
                <TabsTrigger value="pricing">Цены и условия</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название объекта</Label>
                    <Input id="title" name="title" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complex">Жилой комплекс</Label>
                    <Select name="complex">
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ЖК" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kyzylorda-city">ЖК «Кызылорда-Сити»</SelectItem>
                        <SelectItem value="zhaily">ЖК «Жайлы»</SelectItem>
                        <SelectItem value="arman">ЖК «Арман»</SelectItem>
                        <SelectItem value="merey">ЖК «Мерей»</SelectItem>
                        <SelectItem value="nurly">ЖК «Нұрлы»</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea id="description" name="description" className="min-h-32" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Местоположение</Label>
                    <Input id="location" name="location" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Тип объекта</Label>
                    <Select name="type" defaultValue="apartment">
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип объекта" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Квартира</SelectItem>
                        <SelectItem value="house">Дом</SelectItem>
                        <SelectItem value="condo">Кондоминиум</SelectItem>
                        <SelectItem value="villa">Вилла</SelectItem>
                        <SelectItem value="land">Земельный участок</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Спальни</Label>
                    <Input id="bedrooms" name="bedrooms" type="number" min="0" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Ванные комнаты</Label>
                    <Input id="bathrooms" name="bathrooms" type="number" min="0" step="0.5" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Площадь (м²)</Label>
                    <Input id="area" name="area" type="number" min="0" required />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="floor">Этаж</Label>
                    <Input id="floor" name="floor" type="number" min="0" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalFloors">Всего этажей в здании</Label>
                    <Input id="totalFloors" name="totalFloors" type="number" min="0" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="buildingType">Тип здания</Label>
                    <Select name="buildingType">
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип здания" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monolithic">Монолитный</SelectItem>
                        <SelectItem value="brick">Кирпичный</SelectItem>
                        <SelectItem value="panel">Панельный</SelectItem>
                        <SelectItem value="wooden">Деревянный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Срок сдачи</Label>
                    <Input id="completionDate" name="completionDate" placeholder="Например: IV кв. 2025" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ceilingHeight">Высота потолков (м)</Label>
                    <Input id="ceilingHeight" name="ceilingHeight" type="number" step="0.1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finishing">Отделка</Label>
                    <Select name="finishing">
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип отделки" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Без отделки</SelectItem>
                        <SelectItem value="rough">Черновая</SelectItem>
                        <SelectItem value="standard">Стандартная</SelectItem>
                        <SelectItem value="premium">Премиум</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Особенности</Label>
                  <Input
                    id="features"
                    name="features"
                    placeholder="Балкон, Парковка, Бассейн и т.д. (через запятую)"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <div className="space-y-2">
                  <Label>Изображения</Label>
                  <div className="border-2 border-dashed rounded-md p-6">
                    <div className="flex flex-wrap gap-4 mb-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative w-32 h-32">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <Button type="button" variant="outline" onClick={handleImageUpload}>
                        <Upload className="mr-2 h-4 w-4" />
                        Загрузить изображения
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Поддерживаемые форматы: JPG, PNG, WebP. Максимальный размер: 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Ссылка на видео (YouTube, Vimeo)</Label>
                  <Input id="videoUrl" name="videoUrl" placeholder="https://www.youtube.com/watch?v=..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="virtualTourUrl">Ссылка на виртуальный тур</Label>
                  <Input id="virtualTourUrl" name="virtualTourUrl" placeholder="https://..." />
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена (₸)</Label>
                    <Input id="price" name="price" type="number" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerSqm">Цена за м² (₸)</Label>
                    <Input id="pricePerSqm" name="pricePerSqm" type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select name="status" defaultValue="active">
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активный</SelectItem>
                        <SelectItem value="pending">На модерации</SelectItem>
                        <SelectItem value="sold">Продан</SelectItem>
                        <SelectItem value="reserved">Зарезервирован</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentOptions">Варианты оплаты</Label>
                    <Select name="paymentOptions">
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите варианты оплаты" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Наличные</SelectItem>
                        <SelectItem value="mortgage">Ипотека</SelectItem>
                        <SelectItem value="installment">Рассрочка</SelectItem>
                        <SelectItem value="all">Все варианты</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promotions">Акции и скидки</Label>
                  <Textarea id="promotions" name="promotions" placeholder="Описание действующих акций и скидок" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Добавление объекта..." : "Добавить объект"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
