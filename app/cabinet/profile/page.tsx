import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Shield, Key, LogOut, Edit, Save } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Профиль</h2>

      <Tabs defaultValue="personal">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Личные данные</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      alt="Фото профиля"
                      fill
                      className="object-cover"
                    />
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold">Иван Петров</h3>
                  <p className="text-sm text-muted-foreground mb-4">Зарегистрирован с 01.01.2025</p>

                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>ivan.petrov@example.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+7 (702) 123-45-67</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>г. Кызылорда</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Личная информация</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Имя</label>
                      <Input defaultValue="Иван" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Фамилия</label>
                      <Input defaultValue="Петров" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                    <Input defaultValue="ivan.petrov@example.com" />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
                    <Input defaultValue="+7 (702) 123-45-67" />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Дата рождения</label>
                    <Input type="date" defaultValue="1990-01-01" />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Адрес</label>
                    <Textarea defaultValue="г. Кызылорда, ул. Абая, д. 123, кв. 45" />
                  </div>

                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Save className="h-4 w-4" />
                      Сохранить изменения
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Документы</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">ИИН</label>
                    <Input defaultValue="123456789012" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Серия и номер паспорта</label>
                      <Input defaultValue="N12345678" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Дата выдачи</label>
                      <Input type="date" defaultValue="2015-01-01" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Кем выдан</label>
                    <Input defaultValue="МВД РК" />
                  </div>

                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Save className="h-4 w-4" />
                      Сохранить изменения
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Изменение пароля</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Текущий пароль</label>
                    <Input type="password" />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Новый пароль</label>
                    <Input type="password" />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Подтверждение нового пароля</label>
                    <Input type="password" />
                  </div>

                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Key className="h-4 w-4" />
                      Изменить пароль
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Двухфакторная аутентификация</h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-medium">Защита аккаунта</h4>
                      <p className="text-sm text-muted-foreground">
                        Включите двухфакторную аутентификацию для дополнительной защиты вашего аккаунта
                      </p>
                    </div>
                  </div>

                  <Button variant="outline">Включить</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Сеансы</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Текущий сеанс</h4>
                      <p className="text-sm text-muted-foreground">
                        Chrome на Windows • Кызылорда, Казахстан • IP: 123.45.67.89
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-white border-0">Активен</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Safari на iPhone</h4>
                      <p className="text-sm text-muted-foreground">
                        Кызылорда, Казахстан • Последняя активность: 10.05.2025
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Завершить
                    </Button>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                      <LogOut className="h-4 w-4" />
                      Завершить все сеансы
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Настройки уведомлений</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Email-уведомления</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Новости и акции</p>
                        <p className="text-sm text-muted-foreground">
                          Получайте информацию о новых акциях и предложениях
                        </p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="news" className="h-4 w-4" checked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Статус документов</p>
                        <p className="text-sm text-muted-foreground">Уведомления об изменении статуса документов</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="documents" className="h-4 w-4" checked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Платежи и финансы</p>
                        <p className="text-sm text-muted-foreground">Уведомления о платежах и финансовых операциях</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="payments" className="h-4 w-4" checked />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">SMS-уведомления</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Безопасность</p>
                        <p className="text-sm text-muted-foreground">
                          Уведомления о входе в аккаунт и изменении пароля
                        </p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="security-sms" className="h-4 w-4" checked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Важные события</p>
                        <p className="text-sm text-muted-foreground">Уведомления о важных событиях по вашим объектам</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="events-sms" className="h-4 w-4" checked />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Push-уведомления</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Все уведомления</p>
                        <p className="text-sm text-muted-foreground">Получать все уведомления в браузере</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="push-all" className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Сохранить настройки
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
