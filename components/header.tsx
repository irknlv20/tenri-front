import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building, Phone, Search, User } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">TENRI HOME</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/novostroiki" className="text-sm font-medium hover:text-primary">
            Все новостройки
          </Link>
          <Link href="/skidki" className="text-sm font-medium hover:text-primary">
            Скидки и Акции
          </Link>
          <Link href="/reitingi" className="text-sm font-medium hover:text-primary">
            Рейтинги
          </Link>
          <Link href="/zastroishiki" className="text-sm font-medium hover:text-primary">
            Застройщики
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary">
            <Phone className="h-4 w-4" />
            <span>+7 (747) 123-45-67</span>
          </Link>
          <Link href="/cabinet">
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          <ModeToggle />
          <Button variant="outline" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
