"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, Filter, ArrowUpDown } from "lucide-react"

// Пример данных объектов недвижимости
const properties = [
  {
    id: "1",
    title: "ЖК «Кызылорда-Сити»",
    type: "apartment",
    price: 15500000,
    location: "мкр. Центральный, ул. Абая",
    status: "active",
    createdAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "2",
    title: "ЖК «Жайлы»",
    type: "apartment",
    price: 12800000,
    location: "мкр. Шымбулак, ул. Казыбек би",
    status: "active",
    createdAt: "2025-04-15T00:00:00Z",
  },
  {
    id: "3",
    title: "ЖК «Арман»",
    type: "apartment",
    price: 18200000,
    location: "мкр. Сырдарья, ул. Токмагамбетова",
    status: "active",
    createdAt: "2025-04-10T00:00:00Z",
  },
  {
    id: "4",
    title: "ЖК «Мерей»",
    type: "apartment",
    price: 22500000,
    location: "мкр. Ақмешіт, ул. Жібек жолы",
    status: "pending",
    createdAt: "2025-05-10T00:00:00Z",
  },
  {
    id: "5",
    title: "ЖК «Нұрлы»",
    type: "apartment",
    price: 10500000,
    location: "мкр. Тасбөгет, ул. Абылай хана",
    status: "sold",
    createdAt: "2025-03-20T00:00:00Z",
  },
]

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Фильтрация объектов
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || property.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Функция для отображения статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Активный</span>
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">На модерации</span>
      case "sold":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Продан</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Объекты недвижимости</h1>
          <p className="text-muted-foreground mt-2">Управление объектами недвижимости на сайте</p>
        </div>
        <Link href="/admin/properties/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить объект
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск объектов..."
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
                  <SelectItem value="pending">На модерации</SelectItem>
                  <SelectItem value="sold">Проданные</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Фильтры
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center">
                      Название
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Цена
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Местоположение</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Дата создания
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>{property.type === "apartment" ? "Квартира" : property.type}</TableCell>
                      <TableCell>{property.price.toLocaleString()} ₸</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{getStatusBadge(property.status)}</TableCell>
                      <TableCell>{new Date(property.createdAt).toLocaleDateString("ru-RU")}</TableCell>
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
                    <TableCell colSpan={7} className="text-center py-4">
                      Объекты не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Показано {filteredProperties.length} из {properties.length} объектов
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Предыдущая
              </Button>
              <Button variant="outline" size="sm">
                Следующая
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
