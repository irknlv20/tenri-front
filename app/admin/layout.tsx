import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Home,
  Plus,
  Settings,
  LogOut,
  Users,
  Building,
  FileText,
  BarChart2,
  MessageSquare,
  PiggyBank,
  Calendar,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Панель администратора | TENRI HOME",
  description: "Панель администратора для сайта недвижимости TENRI HOME",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // В реальном приложении здесь была бы проверка аутентификации
  // const isAuthenticated = await checkAuth()
  // if (!isAuthenticated) redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Боковая панель */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="px-4 py-4">
            <Link href="/" className="flex items-center">
              <Building className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">TENRI HOME</span>
            </Link>
          </div>
          <div className="flex flex-col flex-1 px-4 mt-5">
            <nav className="flex-1 space-y-1">
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mt-4 mb-2">Основное</p>
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Панель управления
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Аналитика
                </Button>
              </Link>

              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mt-4 mb-2">
                Недвижимость
              </p>
              <Link href="/admin/properties">
                <Button variant="ghost" className="w-full justify-start">
                  <Building className="mr-2 h-4 w-4" />
                  Объекты
                </Button>
              </Link>
              <Link href="/admin/properties/add">
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить объект
                </Button>
              </Link>
              <Link href="/admin/developers">
                <Button variant="ghost" className="w-full justify-start">
                  <Building className="mr-2 h-4 w-4" />
                  Застройщики
                </Button>
              </Link>
              <Link href="/admin/promotions">
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Акции и скидки
                </Button>
              </Link>

              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mt-4 mb-2">Клиенты</p>
              <Link href="/admin/users">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Пользователи
                </Button>
              </Link>
              <Link href="/admin/inquiries">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Запросы
                </Button>
              </Link>
              <Link href="/admin/bookings">
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Бронирования
                </Button>
              </Link>
              <Link href="/admin/mortgages">
                <Button variant="ghost" className="w-full justify-start">
                  <PiggyBank className="mr-2 h-4 w-4" />
                  Ипотека
                </Button>
              </Link>

              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mt-4 mb-2">Система</p>
              <Link href="/admin/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Настройки
                </Button>
              </Link>
              <Link href="/admin/documents">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Документы
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Просмотр сайта
                </Button>
              </Link>
            </nav>
            <div className="mt-auto pb-4">
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
