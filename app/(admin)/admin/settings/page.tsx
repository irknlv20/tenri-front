"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setMessage(null)

    // Имитация API-вызова
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setMessage({ type: "success", text: "Настройки успешно сохранены" })
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки сайта</h1>
        <p className="text-muted-foreground mt-2">Управляйте контентом и конфигурацией вашего сайта</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="homepage">Главная страница</TabsTrigger>
          <TabsTrigger value="contact">Контакты</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
                <CardDescription>Управляйте общей информацией вашего сайта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Название сайта</Label>
                  <Input id="site-name" defaultValue="TENRI HOME" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-description">Описание сайта</Label>
                  <Textarea
                    id="site-description"
                    className="min-h-20"
                    defaultValue="Ваш надежный партнер в выборе недвижимости в Кызылорде. Мы помогаем найти идеальный дом для вашей семьи."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Контактный email</Label>
                    <Input id="email" type="email" defaultValue="info@tenrihome.kz" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Контактный телефон</Label>
                    <Input id="phone" defaultValue="+7 (747) 123-45-67" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Адрес офиса</Label>
                  <Textarea
                    id="address"
                    className="min-h-20"
                    defaultValue="г. Кызылорда, ул. Абая, 123, офис 45"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Режим обслуживания</Label>
                    <Switch id="maintenance-mode" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Когда режим обслуживания включен, сайт будет недоступен для посетителей
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="homepage">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Настройки главной страницы</CardTitle>
                <CardDescription>Настройте содержимое главной страницы вашего сайта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Заголовок баннера</Label>
                  <Input id="hero-title" defaultValue="Найдите идеальную квартиру в Кызылорде" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Подзаголовок баннера</Label>
                  <Textarea
                    id="hero-subtitle"
                    className="min-h-20"
                    defaultValue="TENRI HOME поможет вам выбрать комфортное жилье от надежных застройщиков с выгодными условиями покупки"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured-section-title">Заголовок раздела избранных объектов</Label>
                  <Input id="featured-section-title" defaultValue="Популярные жилые комплексы" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advantages-section-title">Заголовок раздела преимуществ</Label>
                  <Input id="advantages-section-title" defaultValue="Почему выбирают TENRI HOME" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promotions-section-title">Заголовок раздела акций</Label>
                  <Input id="promotions-section-title" defaultValue="Акции и скидки" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developers-section-title">Заголовок раздела застройщиков</Label>
                  <Input id="developers-section-title" defaultValue="Надежные застройщики" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Настройки страницы контактов</CardTitle>
                <CardDescription>Настройте информацию на странице контактов</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-title">Заголовок страницы контактов</Label>
                  <Input id="contact-title" defaultValue="Контакты" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-description">Описание страницы контактов</Label>
                  <Textarea
                    id="contact-description"
                    className="min-h-20"
                    defaultValue="Свяжитесь с нами любым удобным способом. Мы всегда рады помочь вам с выбором недвижимости."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="map-embed">Код для встраивания Google Maps</Label>
                  <Textarea
                    id="map-embed"
                    defaultValue="<iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7479754683745!2d139.7005713!3d35.6580339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b563b00109f%3A0x337328def1e2ab26!2sShibuya%20Scramble%20Square!5e0!3m2!1sen!2sjp!4v1647834159!5m2!1sen!2sjp' width='600' height='450' style='border:0;' allowfullscreen='' loading='lazy'></iframe>"
                    className="min-h-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business-hours">Часы работы</Label>
                    <Textarea
                      id="business-hours"
                      defaultValue="Понедельник - Пятница: 9:00 - 18:00
Суббота: 10:00 - 16:00
Воскресенье: Выходной"
                      className="min-h-20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-media">Ссылки на социальные сети</Label>
                    <Textarea
                      id="social-media"
                      defaultValue="Facebook: https://facebook.com/tenrihome
Instagram: https://instagram.com/tenrihome
Twitter: https://twitter.com/tenrihome"
                      className="min-h-20"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Настройки SEO</CardTitle>
                <CardDescription>Настройте метаданные для поисковой оптимизации</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input id="meta-title" defaultValue="TENRI HOME | Недвижимость в Кызылорде" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    className="min-h-20"
                    defaultValue="Покупка квартир от застройщика в Кызылорде. Большой выбор новостроек, выгодные условия, проверенные застройщики."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta-keywords">Meta Keywords</Label>
                  <Input
                    id="meta-keywords"
                    defaultValue="недвижимость, Кызылорда, квартиры, новостройки, застройщики, ипотека"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="robots-txt">Robots.txt</Label>
                  <Textarea
                    id="robots-txt"
                    className="min-h-20 font-mono"
                    defaultValue="User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://tenrihome.kz/sitemap.xml"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="generate-sitemap">Автоматически генерировать Sitemap</Label>
                    <Switch id="generate-sitemap" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sitemap будет автоматически обновляться при добавлении новых страниц
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
