"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Eye } from "lucide-react"

// Пример данных пользователей
const users = [
  {
    id: "1",
    name: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 (747) 123-45-67",
    role: "user",
    status: "active",
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Алия Сериковна",
    email: "aliya@example.com",
    phone: "+7 (747) 234-56-78",
    role: "admin",
    status: "active",
    createdAt: "2024-12-10T00:00:00Z",
  },
  {
    id: "3",
    name: "Серик Алматов",
    email: "serik@example.com",
    phone: "+7 (747) 345-67-89",
    role: "manager",
    status: "active",
    createdAt: "2025-02-05T00:00:00Z",
  },
  {
    id: "4",
    name: "Айгуль Нурланова",
    email: "aigul@example.com",
    phone: "+7 (747) 456-78-90",
    role: "user",
    status: "inactive",
    createdAt: "2025-03-20T00:00:00Z",
  },
  {
    id: "5",
    name: "Нурлан Сагынбаев",
    email: "nurlan@example.com",
    phone: "+7 (747) 567-89-01",
    role: "user",
    status: "active",
    createdAt: "2025-04-10T00:00:00Z",
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Фильтрация пользователей
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Пример компонента для отображения списка пользователей
  return (
    <div>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <Input
              type="text"
              placeholder="Поиск по имени, email или телефону"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex space-x-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Фильтр по роли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="user">Пользователь</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="manager">Менеджер</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="active">Активный</SelectItem>
                  <SelectItem value="inactive">Неактивный</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
