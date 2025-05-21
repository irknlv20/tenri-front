import Link from "next/link"
import { Building, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">TENRI HOME</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ваш надежный партнер в выборе недвижимости в Кызылорде. Мы помогаем найти идеальный дом для вашей семьи.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Навигация</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/novostroiki" className="text-muted-foreground hover:text-primary">
                Все новостройки
              </Link>
            </li>
            <li>
              <Link href="/skidki" className="text-muted-foreground hover:text-primary">
                Скидки и Акции
              </Link>
            </li>
            <li>
              <Link href="/reitingi" className="text-muted-foreground hover:text-primary">
                Рейтинги
              </Link>
            </li>
            <li>
              <Link href="/zastroishiki" className="text-muted-foreground hover:text-primary">
                Застройщики
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Контакты</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <span className="text-muted-foreground">г. Кызылорда, ул. Абая, 123, офис 45</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">+7 (747) 123-45-67</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">info@tenrihome.kz</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Режим работы</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Понедельник - Пятница:</span>
              <span className="font-medium">9:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Суббота:</span>
              <span className="font-medium">10:00 - 16:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Воскресенье:</span>
              <span className="font-medium">Выходной</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TENRI HOME. Все права защищены.
        </p>
      </div>
    </footer>
  )
}
