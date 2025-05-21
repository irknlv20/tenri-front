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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Download, Eye, Upload, Plus, Calendar, User, Building } from "lucide-react"

// Пример данных документов
const documents = [
  {
    id: "1",
    title: "Договор купли-продажи",
    type: "Договор",
    property: "ЖК «Кызылорда-Сити»",
    client: "Иван Петров",
    date: "2025-05-15",
    status: "signed",
    size: "2.4 МБ",
    format: "PDF",
  },
  {
    id: "2",
    title: "Акт приема-передачи",
    type: "Акт",
    property: "ЖК «Кызылорда-Сити»",
    client: "Иван Петров",
    date: "2025-05-15",
    status: "pending",
    size: "1.8 МБ",
    format: "PDF",
  },
  {
    id: "3",
    title: "Технический паспорт",
    type: "Технический документ",
    property: "ЖК «Кызылорда-Сити»",
    client: "Иван Петров",
    date: "2025-05-10",
    status: "available",
    size: "3.5 МБ",
    format: "PDF",
  },
  {
    id: "4",
    title: "Выписка из ЕГРН",
    type: "Выписка",
    property: "ЖК «Кызылорда-Сити»",
    client: "Иван Петров",
    date: "2025-05-12",
    status: "available",
    size: "1.2 МБ",
    format: "PDF",
  },
  {
    id: "5",
    title: "Договор ипотечного кредитования",
    type: "Договор",
    property: "ЖК «Кызылорда-Сити»",
    client: "Иван Петров",
    date: "2025-05-14",
    status: "signed",
    size: "4.1 МБ",
    format: "PDF",
  },
  {
    id: "6",
    title: "Справка о доходах",
    type: "Справка",
    property: "ЖК «Жайлы»",
    client: "Алия Сериковна",
    date: "2025-05-08",
    status: "uploaded",
    size: "1.5 МБ",
    format: "PDF",
  },
  {
    id: "7",
    title: "Согласие на обработку персональных данных",
    type: "Согласие",
    property: "ЖК «Арман»",
    client: "Серик Алматов",
    date: "2025-05-07",
    status: "signed",
    size: "0.8 МБ",
    format: "PDF",
  },
]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Фильтрация документов
  const filteredDocuments = documents.filter((document) => {
    const matchesSearch =
      document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || document.status === statusFilter
    const matchesType = typeFilter === "all" || document.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Функция для отображения статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Подписан</span>
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Ожидает подписания</span>
      case "available":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Доступен</span>
      case "uploaded":
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Загружен</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Документы</h1>
          <p className="text-muted-foreground mt-2">Управление документами клиентов и объектов недвижимости</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добавить документ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить новый документ</DialogTitle>
              <DialogDescription>Загрузите новый документ или создайте шаблон</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">
                  Название
                </label>
                <Input id="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right">
                  Тип документа
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите тип документа" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Договор</SelectItem>
                    <SelectItem value="act">Акт</SelectItem>
                    <SelectItem value="technical">Технический документ</SelectItem>
                    <SelectItem value="statement">Выписка</SelectItem>
                    <SelectItem value="certificate">Справка</SelectItem>
                    <SelectItem value="consent">Согласие</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="property" className="text-right">
                  Объект
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите объект" />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="client" className="text-right">
                  Клиент
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ivan">Иван Петров</SelectItem>
                    <SelectItem value="aliya">Алия Сериковна</SelectItem>
                    <SelectItem value="serik">Серик Алматов</SelectItem>
                    <SelectItem value="aigul">Айгуль Нурланова</SelectItem>
                    <SelectItem value="nurlan">Нурлан Сагынбаев</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="file" className="text-right">
                  Файл
                </label>
                <div className="col-span-3">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Перетащите файл сюда или нажмите для выбора</p>
                    <Button variant="outline" size="sm">
                      Выбрать файл
                    </Button>
                  </div>
                </div>
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

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Все документы</TabsTrigger>
            <TabsTrigger value="contracts">Договоры</TabsTrigger>
            <TabsTrigger value="technical">Технические</TabsTrigger>
            <TabsTrigger value="financial">Финансовые</TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск документов..."
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
                    <SelectItem value="signed">Подписанные</SelectItem>
                    <SelectItem value="pending">Ожидают подписания</SelectItem>
                    <SelectItem value="available">Доступные</SelectItem>
                    <SelectItem value="uploaded">Загруженные</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Тип документа" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="Договор">Договоры</SelectItem>
                    <SelectItem value="Акт">Акты</SelectItem>
                    <SelectItem value="Технический документ">Технические документы</SelectItem>
                    <SelectItem value="Выписка">Выписки</SelectItem>
                    <SelectItem value="Справка">Справки</SelectItem>
                    <SelectItem value="Согласие">Согласия</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Объект</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                            {document.title}
                          </div>
                        </TableCell>
                        <TableCell>{document.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            {document.property}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            {document.client}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(document.date).toLocaleDateString("ru-RU")}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(document.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Документы не найдены
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Показано {filteredDocuments.length} из {documents.length} документов
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
