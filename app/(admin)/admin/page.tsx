import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Building, MessageSquare, Calendar, BarChart2, TrendingUp, Eye } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>
        <p className="text-muted-foreground mt-2">Управляйте контентом и настройками вашего сайта недвижимости</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Объекты недвижимости</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Активных объявлений</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 за последний месяц</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Запросы</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Непрочитанных сообщений</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Просмотры</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">+18% за последнюю неделю</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Объекты недвижимости</CardTitle>
            <CardDescription>Управление объектами недвижимости</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Активные</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">На модерации</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Проданные</span>
                <span className="font-medium">18</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/properties/add" className="w-full">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Добавить новый объект
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Запросы клиентов</CardTitle>
            <CardDescription>Сообщения и запросы клиентов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Новые</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">В обработке</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Завершенные</span>
                <span className="font-medium">45</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/inquiries" className="w-full">
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Просмотр запросов
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Бронирования</CardTitle>
            <CardDescription>Управление бронированиями объектов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Активные</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ожидают подтверждения</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Истекшие</span>
                <span className="font-medium">2</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/bookings" className="w-full">
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Управление бронированиями
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Последние запросы</CardTitle>
            <CardDescription>Недавние запросы от клиентов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Консультация по ипотеке</p>
                    <p className="text-sm text-muted-foreground">Иван Петров • 15 мая 2025</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/inquiries" className="w-full">
              <Button variant="outline" className="w-full">
                Все запросы
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Аналитика</CardTitle>
            <CardDescription>Статистика посещений и конверсий</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Графики посещаемости и конверсий</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/analytics" className="w-full">
              <Button variant="outline" className="w-full">
                <BarChart2 className="mr-2 h-4 w-4" />
                Подробная аналитика
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
