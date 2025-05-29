"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, AreaChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-muted-foreground mt-2">Статистика и аналитические данные по вашему сайту</p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="traffic">Трафик</TabsTrigger>
              <TabsTrigger value="conversions">Конверсии</TabsTrigger>
              <TabsTrigger value="properties">Объекты</TabsTrigger>
            </TabsList>

            <Select defaultValue="30days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Выберите период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Последние 7 дней</SelectItem>
                <SelectItem value="30days">Последние 30 дней</SelectItem>
                <SelectItem value="90days">Последние 90 дней</SelectItem>
                <SelectItem value="year">Последний год</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Посещения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,543</div>
                  <p className="text-xs text-muted-foreground">+18% по сравнению с прошлым периодом</p>
                  <div className="mt-4 h-[80px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                    <LineChart className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Просмотры объектов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,756</div>
                  <p className="text-xs text-muted-foreground">+12% по сравнению с прошлым периодом</p>
                  <div className="mt-4 h-[80px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                    <BarChart className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Запросы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">+5% по сравнению с прошлым периодом</p>
                  <div className="mt-4 h-[80px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                    <AreaChart className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.9%</div>
                  <p className="text-xs text-muted-foreground">+0.8% по сравнению с прошлым периодом</p>
                  <div className="mt-4 h-[80px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                    <PieChart className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Посещаемость по дням</CardTitle>
                  <CardDescription>Количество посещений сайта по дням</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                    <BarChart className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Источники трафика</CardTitle>
                  <CardDescription>Откуда приходят посетители</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                    <PieChart className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Популярные объекты</CardTitle>
                <CardDescription>Наиболее просматриваемые объекты недвижимости</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">ЖК «Кызылорда-Сити» - {i}-комнатная квартира</p>
                        <p className="text-sm text-muted-foreground">{1000 - i * 100} просмотров</p>
                      </div>
                      <div className="text-sm font-medium">{6 - i}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Источники трафика</CardTitle>
                <CardDescription>Детальная информация об источниках трафика</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                  <PieChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Конверсии</CardTitle>
                <CardDescription>Анализ конверсий и воронки продаж</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Статистика по объектам</CardTitle>
                <CardDescription>Анализ просмотров и интереса к объектам недвижимости</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full bg-muted/20 flex items-center justify-center rounded-md">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
