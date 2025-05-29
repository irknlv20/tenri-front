"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingCart,
  Heart,
  BarChart2,
  PiggyBank,
  Calendar,
  FileText,
  HelpCircle,
  PenToolIcon as Tool,
  FileSignature,
  User, Building, BarChart3, TrendingUp, CreditCard, MessageSquare, Wrench, PenTool,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CabinetLayoutProps {
  children: ReactNode
}

export default function CabinetLayout({ children }: CabinetLayoutProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/cabinet", icon: <Home className="h-5 w-5" />, label: "Главная" },
    { href: "/cabinet/favorites", icon: <Heart className="h-5 w-5" />, label: "Избранное" },
    { href: "/cabinet/comparison", icon: <BarChart2 className="h-5 w-5" />, label: "Сравнение" },
    { href: "/cabinet/bookings", icon: <Calendar className="h-5 w-5" />, label: "Бронирования" },
    { href: "/cabinet/documents", icon: <FileText className="h-5 w-5" />, label: "Документы" },
    // { href: "/cabinet/payments", icon: <CreditCard className="h-5 w-5" />, label: "Платежи" },
    { href: "/cabinet/deal-progress", icon: <TrendingUp className="h-5 w-5" />, label: "Прогресс сделки" },
    // { href: "/cabinet/mortgage", icon: <PiggyBank className="h-5 w-5" />, label: "Ипотека" },
    { href: "/cabinet/support", icon: <HelpCircle className="h-5 w-5" />, label: "Поддержка" },
    { href: "/cabinet/profile", icon: <User className="h-5 w-5" />, label: "Профиль" },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="mt-6">
            <ul>
              {menuItems.map((item) => (
                  <li key={item.label} className="px-4 py-2 hover:bg-gray-100">
                    <a href={item.href} className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </a>
                  </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 bg-background rounded-lg shadow-sm p-6">{children}</main>
      </div>
    </div>
  )
}
