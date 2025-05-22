"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function RegistrationForm() {
  const [activeTab, setActiveTab] = useState("login")
  const [lastName, setlastName] = useState("")
  const [firstName, setfirstName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, register, error, clearError } = useAuth()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await login(loginEmail, loginPassword)
      toast({
        title: "Успешная авторизация",
        description: "Вы успешно вошли в систему",
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Ошибка авторизации",
        description: error || "Проверьте правильность введенных данных",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreed) {
      toast({
        title: "Ошибка регистрации",
        description: "Необходимо принять условия пользовательского соглашения",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // const fullName = `${surname} ${name}`.trim()
      await register(firstName, lastName, email, phone, password)
      toast({
        title: "Успешная регистрация",
        description: "Вы успешно зарегистрировались в системе",
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Ошибка регистрации",
        description: error || "Проверьте правильность введенных данных",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="p-0">
        <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register" className="bg-secondary text-secondary-foreground">
              Регистрация
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-6">
        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                placeholder="Email или телефон"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Выполняется вход..." : "Войти"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-md">
              <label className="text-xs text-muted-foreground">Фамилия</label>
              <Input
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                className="border-0 p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
                required
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <label className="text-xs text-muted-foreground">Имя</label>
              <Input
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                className="border-0 p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
                required
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <label className="text-xs text-muted-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
                required
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <label className="text-xs text-muted-foreground">Номер телефона</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-0 p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
                required
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <label className="text-xs text-muted-foreground">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="agreement" className="text-xs text-muted-foreground">
                Регистрируясь, вы принимаете условия пользовательского соглашения и согласны на обработку ваших
                персональных данных.
              </label>
            </div>

            <Button className="w-full bg-blue-900 hover:bg-blue-950" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Регистрация..." : "Далее"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
