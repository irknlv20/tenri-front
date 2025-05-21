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
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Search, MessageSquare, User, Calendar, ArrowRight, CheckCircle, XCircle } from "lucide-react"

// Пример данных запросов клиентов
const inquiries = [
  {
    id: "1",
    subject: "Консультация по ипотеке",
    message:
      "Здравствуйте! Меня интересует ипотека на квартиру в ЖК «Кызылорда-Сити». Какие банки предлагают лучшие условия?",
    name: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 (747) 123-45-67",
    status: "new",
    createdAt: "2025-05-15T10:30:00Z",
    property: "ЖК «Кызылорда-Сити»",
  },
  {
    id: "2",
    subject: "Вопрос о планировке",
    message: "Добрый день! Хотел бы узнать, есть ли в ЖК «Жайлы» квартиры с отдельной гардеробной комнатой?",
    name: "Алия Сериковна",
    email: "aliya@example.com",
    phone: "+7 (747) 234-56-78",
    status: "in_progress",
    createdAt: "2025-05-14T14:15:00Z",
    property: "ЖК «Жайлы»",
  },
  {
    id: "3",
    subject: "Запрос на просмотр",
    message: "Здравствуйте! Хотел бы записаться на просмотр 2-комнатной квартиры в ЖК «Арман». Когда это возможно?",
    name: "Серик Алматов",
    email: "serik@example.com",
    phone: "+7 (747) 345-67-89",
    status: "in_progress",
    createdAt: "2025-05-13T09:45:00Z",
    property: "ЖК «Арман»",
  },
  {
    id: "4",
    subject: "Вопрос о рассрочке",
    message:
      "Добрый день! Интересует рассрочка на квартиру в ЖК «Мерей». Какие условия и на какой срок возможна рассрочка?",
    name: "Айгуль Нурланова",
    email: "aigul@example.com",
    phone: "+7 (747) 456-78-90",
    status: "completed",
    createdAt: "2025-05-12T16:20:00Z",
    property: "ЖК «Мерей»",
  },
  {
    id: "5",
    subject: "Технические характеристики",
    message:
      "Здравствуйте! Какие материалы используются для строительства ЖК «Нұрлы»? Интересует тип отопления и вентиляции.",
    name: "Нурлан Сагынбаев",
    email: "nurlan@example.com",
    phone: "+7 (747) 567-89-01",
    status: "completed",
    createdAt: "2025-05-11T11:10:00Z",
    property: "ЖК «Нұрлы»",
  },
]

export default function InquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInquiry, setSelectedInquiry] = useState<(typeof inquiries)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Фильтрация запросов
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.phone.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Функция для отображения статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Новый</span>
      case "in_progress":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">В обработке</span>
      case "completed":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Завершен</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Запросы клиентов</h1>
        <p className="text-muted-foreground mt-2">Управление запросами и сообщениями от клиентов</p>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Все запросы</TabsTrigger>
            <TabsTrigger value="new">Новые</TabsTrigger>
            <TabsTrigger value="in_progress">В обработке</TabsTrigger>
            <TabsTrigger value="completed">Завершенные</TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск запросов..."
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
                    <SelectItem value="new">Новые</SelectItem>
                    <SelectItem value="in_progress">В обработке</SelectItem>
                    <SelectItem value="completed">Завершенные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Тема</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Объект</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
                            {inquiry.subject}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div>{inquiry.name}</div>
                              <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{inquiry.property}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(inquiry.createdAt).toLocaleDateString("ru-RU")}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedInquiry(inquiry)
                              setIsDialogOpen(true)
                            }}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Просмотр
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Запросы не найдены
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Показано {filteredInquiries.length} из {inquiries.length} запросов
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Диалог просмотра запроса */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedInquiry?.subject}</DialogTitle>
            <DialogDescription>
              {selectedInquiry?.property} • {new Date(selectedInquiry?.createdAt || "").toLocaleDateString("ru-RU")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">{selectedInquiry?.message}</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Информация о клиенте</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Имя:</span> {selectedInquiry?.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Телефон:</span> {selectedInquiry?.phone}
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Email:</span> {selectedInquiry?.email}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Ответ</h4>
              <Textarea placeholder="Введите ваш ответ клиенту..." className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Отметить как завершенный
              </Button>
              <Button variant="outline" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Отклонить
              </Button>
            </div>
            <Button type="submit">Отправить ответ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
