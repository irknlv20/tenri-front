"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Mail, Phone, MapPin, LogOut, Edit, Save, Trash2 } from "lucide-react"
import Image from "next/image"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const handleClearAll = () => {
    localStorage.clear()
    router.push("/login")
  }

  if (!user) return <p>Загрузка...</p>

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Профиль</h2>
          <div className="space-x-2">
            <Button variant="outline" className="text-red-600 border-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Выйти
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-2" /> Удалить все данные
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Личные данные</TabsTrigger>
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

                    <h3 className="text-xl font-bold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Зарегистрирован с {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </p>

                    <div className="w-full space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone}</span>
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
                        <Input defaultValue={user.firstName} />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Фамилия</label>
                        <Input defaultValue={user.lastName} />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                      <Input defaultValue={user.email} />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
                      <Input defaultValue={user.phone} />
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
