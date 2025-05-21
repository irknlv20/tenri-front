"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Search, Edit, Trash2, Eye, Building } from "lucide-react"

// Пример данных застройщиков
const developers = [
  {
    id: "1",
    name: "TENRI Development",
    description: "Ведущая строительная компания Кызылорды с опытом более 15 лет.",
    projects: 12,
    completedProjects: 8,
    inProgressProjects: 4,
    establishedYear: 2008,
    address: "г. Кызылорда, ул. Абая, 123, офис 45",
    phone: "+7 (747) 123-45-67",
    email: "info@tenridevelopment.kz",
    website: "tenridevelopment.kz",
  },
  {
    id: "2",
    name: "Строй Инвест",
    description: "Надежный застройщик, специализирующийся на строительстве жилых комплексов комфорт-класса.",
    projects: 8,
    completedProjects: 5,
    inProgressProjects: 3,
    establishedYear: 2012,
    address: "г. Кызылорда, ул. Казыбек би, 45, офис 12",
    phone: "+7 (747) 234-56-78",
    email: "info@stroyinvest.kz",
    website: "stroyinvest.kz",
  },
  {
    id: "3",
    name: "Кызылорда Строй",
    description: "Одна из крупнейших строительных компаний региона.",
    projects: 15,
    completedProjects: 12,
    inProgressProjects: 3,
    establishedYear: 2005,
    address: "г. Кызылорда, ул. Токмагамбетова, 78, офис 34",
    phone: "+7 (747) 345-67-89",
    email: "info@kyzylordastroy.kz",
    website: "kyzylordastroy.kz",
  },
  {
    id: "4",
    name: "Сырдарья Девелопмент",
    description: "Молодая и динамично развивающаяся компания.",
    projects: 6,
    completedProjects: 3,
    inProgressProjects: 3,
    establishedYear: 2015,
    address: "г. Кызылорда, ул. Жібек жолы, 56, офис 23",
    phone: "+7 (747) 456-78-90",
    email: "info@syrdaryadev.kz",
    website: "syrdaryadev.kz",
  },
]

export default function DevelopersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Фильтрация застройщиков
  const filteredDevelopers = developers.filter((developer) => {
    return (
      developer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      developer.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Застройщики</h1>
          <p className="text-muted-foreground mt-2">Управление застройщиками на сайте</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добавить застройщика
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить нового застройщика</DialogTitle>
              <DialogDescription>Заполните информацию о новом застройщике</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Название
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Описание
                </Label>
                <Textarea id="description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="established" className="text-right">
                  Год основания
                </Label>
                <Input id="established" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Адрес
                </Label>
                <Input id="address" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Телефон
                </Label>
                <Input id="phone" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Веб-сайт
                </Label>
                <Input id="website" className="col-span-3" />
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
                placeholder="Поиск застройщиков..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Название</TableHead>
                  <TableHead>Год основания</TableHead>
                  <TableHead>Всего проектов</TableHead>
                  <TableHead>Завершенные</TableHead>
                  <TableHead>В процессе</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevelopers.length > 0 ? (
                  filteredDevelopers.map((developer) => (
                    <TableRow key={developer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                          {developer.name}
                        </div>
                      </TableCell>
                      <TableCell>{developer.establishedYear}</TableCell>
                      <TableCell>{developer.projects}</TableCell>
                      <TableCell>{developer.completedProjects}</TableCell>
                      <TableCell>{developer.inProgressProjects}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{developer.phone}</div>
                          <div className="text-muted-foreground">{developer.email}</div>
                        </div>
                      </TableCell>
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
                      Застройщики не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Показано {filteredDevelopers.length} из {developers.length} застройщиков
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
