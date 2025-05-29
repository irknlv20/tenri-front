import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Building, Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Контакты</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Свяжитесь с нами</h2>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Имя
                    </label>
                    <Input id="name" placeholder="Введите ваше имя" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Телефон
                    </label>
                    <Input id="phone" placeholder="+7 (___) ___-__-__" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Введите ваш email" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Сообщение
                  </label>
                  <Textarea id="message" placeholder="Введите ваше сообщение" rows={5} />
                </div>

                <Button className="w-full">Отправить сообщение</Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Наш офис</h3>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-medium">TENRI HOME</p>
                  <p className="text-muted-foreground">г. Кызылорда, ул. Абая, 123, офис 45</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Контактная информация</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Телефон</p>
                    <p className="text-muted-foreground">+7 (747) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@tenrihome.kz</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Режим работы</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Понедельник - Пятница</p>
                    <p className="text-muted-foreground">9:00 - 18:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Суббота</p>
                    <p className="text-muted-foreground">10:00 - 16:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Воскресенье</p>
                    <p className="text-muted-foreground">Выходной</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Мы в социальных сетях</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[600px] bg-muted rounded-lg overflow-hidden">
          {/* Here you would typically embed a map */}
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-medium">Карта расположения офиса</h3>
              <p className="text-muted-foreground mt-2">г. Кызылорда, ул. Абая, 123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
