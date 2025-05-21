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
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CabinetLayoutProps {
  children: ReactNode
}

export default function CabinetLayout({ children }: CabinetLayoutProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/cabinet", icon: <Home className="h-5 w-5" />, label: "Мои объекты" },
    { href: "/cabinet/purchase", icon: <ShoppingCart className="h-5 w-5" />, label: "Покупка" },
    { href: "/cabinet/favorites", icon: <Heart className="h-5 w-5" />, label: "Избранное" },
    { href: "/cabinet/comparison", icon: <BarChart2 className="h-5 w-5" />, label: "Сравнение" },
    { href: "/cabinet/mortgage", icon: <PiggyBank className="h-5 w-5" />, label: "Ипотека" },
    { href: "/cabinet/bookings", icon: <Calendar className="h-5 w-5" />, label: "Бронирования" },
    { href: "/cabinet/support", icon: <HelpCircle className="h-5 w-5" />, label: "Сопровождение" },
    { href: "/cabinet/services", icon: <Tool className="h-5 w-5" />, label: "Полезные сервисы" },
    { href: "/cabinet/documents", icon: <FileText className="h-5 w-5" />, label: "Документы" },
    { href: "/cabinet/signature", icon: <FileSignature className="h-5 w-5" />, label: "Электронная подпись" },
    { href: "/cabinet/profile", icon: <User className="h-5 w-5" />, label: "Профиль" },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-1 bg-background rounded-lg shadow-sm">
            {menuItems.map((item) => {
              const isActive = item.href === "/cabinet" ? pathname === "/cabinet" : pathname.startsWith(item.href)

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-3 px-3 font-normal h-12", isActive && "bg-muted")}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 bg-background rounded-lg shadow-sm p-6">{children}</main>
      </div>
    </div>
  )
}
