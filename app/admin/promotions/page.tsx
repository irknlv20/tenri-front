"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye, Calendar, Percent } from "lucide-react"

// Пример данных акций и скидок
const promotions = [
  {
    id: "1",
    title: "Скидка 10% на все квартиры в ЖК «Кызылорда-Сити»",
    description: "При 100% оплате получите скидку 10% на квартиры любой планировки",
    validUntil: "2025-05-31",
    status: "active",
    property: "ЖК «Кызылорда-Сити»",
    discountType: "percentage",
    discountValue: 10,
    conditions: ["100% оплата", "Только для квартир от 40 м²"],
  },
  {
    id: "2",
    title: "Рассрочка 0% на 12 месяцев",
    description: "Приобретайте квартиру в ЖК «Жайлы» в рассрочку без переплат",
    validUntil: "2025-06-30",
    status: "active",
    property: "ЖК «Жайлы»",
    discountType: "installment",
    discountValue: 0,
    conditions: ["Первоначальный взнос от 30%", "Срок рассрочки - 12 месяцев"],
  },
  {
    id: "3",
    title: "Паркинг в подарок",
    description: "При покупке 3-комнатной квартиры в ЖК «Арман» - паркинг в подарок",
    validUntil: "2025-07-15",
    status: "active",
    property: "ЖК «Арман»",
    discountType: "gift",
    discountValue: 0,
    conditions: ["Только для 3-комнатных квартир", "При 100% оплате или ипотеке"],
  },
  {
    id: "4",
    title: "Скидка 5% для семей с детьми",
    description: "Специальное предложение для семей с детьми - скидка 5% на любую квартиру",
    validUntil: "2025-08-31",
    status: "active",
    property: "Все ЖК",
    discountType: "percentage",
    discountValue: 5,
    conditions: ["Необходимо предоставить свидетельство о рождении ребенка"],
  },
  {
    id: "5",
    title: "Кухня в подарок",
    description: "Купите квартиру в ЖК «Кызылорда-Сити» и получите кухонный гарнитур в подарок",
    validUntil: "2025-09-30",
    status: "inactive",
    property: "ЖК «Кызылорда-Сити»",
    discountType: "gift",
    discountValue: 0,
    conditions: ["При покупке квартиры от 50 м²", "Стоимость кухни до 500 000 тенге"],
  },
]

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Фильтрация акций
  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch =
      promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promotion.property.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || promotion.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Функция для отображения статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Активная</span>
      case "inactive":
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Неактивная</span>
      case "upcoming":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Предстоящая</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Акции и скидки</h1>
          <p className="text-muted-foreground mt-2">Управление акциями и специальными предложениями</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добавить акцию
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить новую акцию</DialogTitle>
              <DialogDescription>Заполните информацию о новой акции или скидке</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Название
                </Label>
                <Input id="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Описание
                </Label>
                <Textarea id="description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="property" className="text-right">
                  Объект
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите объект" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все ЖК</SelectItem>
                    <SelectItem value="kyzylorda-city">ЖК «Кызылорда-Сити»</SelectItem>
                    <SelectItem value="zhaily">ЖК «Жайлы»</SelectItem>
                    <SelectItem value="arman">ЖК «Арман»</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount-type" className="text-right">
                  Тип скидки
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите тип скидки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Процент</SelectItem>
                    <SelectItem value="fixed">Фиксированная сумма</SelectItem>
                    <SelectItem value="installment">Рассрочка</SelectItem>
                    <SelectItem value="gift">Подарок</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount-value" className="text-right">
                  Значение скидки
                </Label>
                <Input id="discount-value" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valid-until" className="text-right">
                  Действует до
                </Label>
                <Input id="valid-until" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conditions" className="text-right">
                  Условия
                </Label>
                <Textarea id="conditions" placeholder="Каждое условие с новой строки" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Статус
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активная</SelectItem>
                    <SelectItem value="inactive">Неактивная</SelectItem>
                    <SelectItem value="upcoming">Предстоящая</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                Добавить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск акций..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                  <SelectItem value="upcoming">Предстоящие</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Название</TableHead>
                  <TableHead>Объект</TableHead>
                  <TableHead>Тип скидки</TableHead>
                  <TableHead>Действует до</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Percent className="h-5 w-5 mr-2 text-muted-foreground" />
                          {promotion.title}
                        </div>
                      </TableCell>
                      <TableCell>{promotion.property}</TableCell>
                      <TableCell>
                        {promotion.discountType === "percentage"
                          ? `${promotion.discountValue}%`
                          : promotion.discountType === "fixed"
                            ? `${promotion.discountValue.toLocaleString()} ₸`
                            : promotion.discountType === "installment"
                              ? "Рассрочка"
                              : "Подарок"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {new Date(promotion.validUntil).toLocaleDateString("ru-RU")}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Акции не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Показано {filteredPromotions.length} из {promotions.length} акций
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
