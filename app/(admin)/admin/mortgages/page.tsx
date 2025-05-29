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
import { Search, Calendar, User, Building, ArrowRight, CheckCircle, XCircle } from "lucide-react"

// Пример данных ипотечных заявок
const mortgages = [
  {
    id: "1",
    property: "ЖК «Кызылорда-Сити»",
    unit: "2-комнатная квартира, 65.8 м²",
    client: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 (747) 123-45-67",
    status: "approved",
    bank: "Народный Банк Казахстана",
    program: "Ипотека 7-20-25",
    amount: 18500000,
    term: 20,
    rate: 7.5,
    monthlyPayment: 148200,
    applicationDate: "2025-05-01T00:00:00Z",
    approvalDate: "2025-05-10T00:00:00Z",
  },
  {
    id: "2",
    property: "ЖК «Жайлы»",
    unit: "3-комнатная квартира, 85.2 м²",
    client: "Алия Сериковна",
    email: "aliya@example.com",
    phone: "+7 (747) 234-56-78",
    status: "pending",
    bank: "Kaspi Bank",
    program: "Стандартная ипотека",
    amount: 25000000,
    term: 15,
    rate: 8.5,
    monthlyPayment: 0,
    applicationDate: "2025-05-10T00:00:00Z",
    approvalDate: null,
  },
  {
    id: "3",
    property: "ЖК «Арман»",
    unit: "1-комнатная квартира, 42.8 м²",
    client: "Серик Алматов",
    email: "serik@example.com",
    phone: "+7 (747) 345-67-89",
    status: "in_progress",
    bank: "Сбербанк",
    program: "Ипотека для молодых семей",
    amount: 15000000,
    term: 25,
    rate: 6.8,
    monthlyPayment: 0,
    applicationDate: "2025-05-05T00:00:00Z",
    approvalDate: null,
  },
  {
    id: "4",
    property: "ЖК «Мерей»",
    unit: "2-комнатная квартира, 68.5 м²",
    client: "Айгуль Нурланова",
    email: "aigul@example.com",
    phone: "+7 (747) 456-78-90",
    status: "rejected",
    bank: "Народный Банк Казахстана",
    program: "Ипотека 7-20-25",
    amount: 22000000,
    term: 20,
    rate: 7.5,
    monthlyPayment: 0,
    applicationDate: "2025-04-25T00:00:00Z",
    approvalDate: null,
  },
  {
    id: "5",
    property: "ЖК «Нұрлы»",
    unit: "1-комнатная квартира, 38.2 м²",
    client: "Нурлан Сагынбаев",
    email: "nurlan@example.com",
    phone: "+7 (747) 567-89-01",
    status: "approved",
    bank: "Kaspi Bank",
    program: "Стандартная ипотека",
    amount: 12000000,
    term: 10,
    rate: 9.2,
    monthlyPayment: 153500,
    applicationDate: "2025-04-15T00:00:00Z",
    approvalDate: "2025-04-25T00:00:00Z",
  },
]

export default function MortgagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMortgage, setSelectedMortgage] = useState<(typeof mortgages)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Фильтрация ипотечных заявок
  const filteredMortgages = mortgages.filter((mortgage) => {
    const matchesSearch =
      mortgage.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mortgage.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mortgage.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mortgage.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mortgage.phone.includes(searchQuery) ||
      mortgage.bank.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || mortgage.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Функция для отображения статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Одобрено</span>
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">На рассмотрении</span>
      case "in_progress":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">В обработке</span>
      case "rejected":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Отклонено</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ипотека</h1>
        <p className="text-muted-foreground mt-2">Управление ипотечными заявками клиентов</p>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Все заявки</TabsTrigger>
            <TabsTrigger value="pending">На рассмотрении</TabsTrigger>
            <TabsTrigger value="approved">Одобренные</TabsTrigger>
            <TabsTrigger value="rejected">Отклоненные</TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск заявок..."
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
                    <SelectItem value="pending">На рассмотрении</SelectItem>
                    <SelectItem value="in_progress">В обработке</SelectItem>
                    <SelectItem value="approved">Одобренные</SelectItem>
                    <SelectItem value="rejected">Отклоненные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Объект</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Банк</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Дата заявки</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMortgages.length > 0 ? (
                    filteredMortgages.map((mortgage) => (
                      <TableRow key={mortgage.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{mortgage.property}</div>
                            <div className="text-sm text-muted-foreground">{mortgage.unit}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div>{mortgage.client}</div>
                              <div className="text-xs text-muted-foreground">{mortgage.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{mortgage.bank}</TableCell>
                        <TableCell>{mortgage.amount.toLocaleString()} ₸</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(mortgage.applicationDate).toLocaleDateString("ru-RU")}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(mortgage.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedMortgage(mortgage)
                              setIsDialogOpen(true)
                            }}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Подробнее
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Заявки не найдены
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Показано {filteredMortgages.length} из {mortgages.length} заявок
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Диалог просмотра ипотечной заявки */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Детали ипотечной заявки</DialogTitle>
            <DialogDescription>
              {selectedMortgage?.property} • {selectedMortgage?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Информация об объекте</h4>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{selectedMortgage?.property}</div>
                      <div className="text-sm">{selectedMortgage?.unit}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Информация о клиенте</h4>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{selectedMortgage?.client}</div>
                      <div className="text-sm">{selectedMortgage?.email}</div>
                      <div className="text-sm">{selectedMortgage?.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Детали ипотеки</h4>
              <div className="bg-muted p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Банк:</span> {selectedMortgage?.bank}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Программа:</span> {selectedMortgage?.program}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Сумма кредита:</span>{" "}
                    {selectedMortgage?.amount.toLocaleString()} ₸
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Срок:</span> {selectedMortgage?.term} лет
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Ставка:</span> {selectedMortgage?.rate}%
                  </div>
                  {selectedMortgage?.monthlyPayment > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Ежемесячный платеж:</span>{" "}
                      {selectedMortgage?.monthlyPayment.toLocaleString()} ₸
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Дата заявки:</span>{" "}
                    {new Date(selectedMortgage?.applicationDate || "").toLocaleDateString("ru-RU")}
                  </div>
                  {selectedMortgage?.approvalDate && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Дата одобрения:</span>{" "}
                      {new Date(selectedMortgage?.approvalDate).toLocaleDateString("ru-RU")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Одобрить
              </Button>
              <Button variant="outline" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Отклонить
              </Button>
            </div>
            <Button type="submit">Отправить в банк</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
