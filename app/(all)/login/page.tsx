"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthService } from "@/services/auth-service"
import { toast } from "sonner"
import Link from "next/link"
import {useAuth} from "@/contexts/auth-context";

export default function LoginPage() {
    // Login form state
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Register form state
    const [registerFirstName, setRegisterFirstName] = useState("")
    const [registerLastName, setRegisterLastName] = useState("")

    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPhone, setRegisterPhone] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [agreed, setAgreed] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectPath = searchParams.get("redirect") || "/cabinet"

    const { login, register, error, clearError } = useAuth()


    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem("token")
        if (token) {
            router.replace(redirectPath)
        }
    }, [redirectPath, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await AuthService.login({
                email,
                password,
            })


            if (response.success && response.data.token) {
                // Store token and user data
                localStorage.setItem("token", response?.data?.token)
                localStorage.setItem("user", JSON.stringify(response?.data?.user))

                toast.success("Вы успешно вошли в систему")
                router.push(redirectPath)
            } else {
                toast.error(response.message || "Ошибка авторизации")
            }
        } catch (error) {
            console.error("Login error:", error)
            toast.error("Ошибка авторизации. Проверьте правильность введенных данных")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!agreed) {
            toast.error("Необходимо принять условия пользовательского соглашения")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await AuthService.register({
                firstName: registerFirstName,
                lastName: registerLastName,
                email: registerEmail,
                phone: registerPhone,
                password: registerPassword,
            })
            console.log(response)
            if (response.success && response.data.token) {
                // Store token and user data

                localStorage.setItem("token", response?.data?.token)
                localStorage.setItem("user", JSON.stringify(response?.data?.user))

                toast.success("Вы успешно зарегистрировались")
                router.push(redirectPath)
            } else {
                toast.error(response.message || "Ошибка регистрации")
            }
        } catch (error) {
            console.error("Registration error:", error)
            toast.error("Ошибка регистрации. Проверьте правильность введенных данных")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
            <Card className="w-full max-w-md">
                <Tabs defaultValue="login">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Вход</TabsTrigger>
                        <TabsTrigger value="register">Регистрация</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <CardHeader>
                            <CardTitle>Вход в личный кабинет</CardTitle>
                            <CardDescription>Введите свои данные для входа в систему</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-sm font-medium">Пароль</label>
                                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                            Забыли пароль?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Выполняется вход..." : "Войти"}
                                </Button>
                            </form>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="register">
                        <CardHeader>
                            <CardTitle>Создание аккаунта</CardTitle>
                            <CardDescription>Заполните форму для регистрации</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Имя</label>
                                    <Input
                                        id="firstname"
                                        placeholder="Иван"
                                        value={registerFirstName}
                                        onChange={(e) => setRegisterFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Фамилия</label>
                                    <Input
                                        id="lastname"
                                        placeholder="Иванов"
                                        value={registerLastName}
                                        onChange={(e) => setRegisterLastName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="register-email" className="text-sm font-medium">Email</label>
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">Телефон</label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+7 (XXX) XXX-XX-XX"
                                        value={registerPhone}
                                        onChange={(e) => setRegisterPhone(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="register-password" className="text-sm font-medium">Пароль</label>
                                    <Input
                                        id="register-password"
                                        type="password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="h-4 w-4 rounded border-gray-300"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        required
                                    />
                                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                                        Я согласен с{" "}
                                        <Link href="/terms" className="text-primary hover:underline">
                                            условиями пользования
                                        </Link>{" "}
                                        и{" "}
                                        <Link href="/privacy" className="text-primary hover:underline">
                                            политикой конфиденциальности
                                        </Link>
                                    </label>
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
                                </Button>
                            </form>
                        </CardContent>
                    </TabsContent>
                </Tabs>
                <CardFooter className="flex justify-center border-t p-6">
                    <p className="text-sm text-muted-foreground">
                        Нужна помощь?{" "}
                        <Link href="/contact" className="text-primary hover:underline">
                            Связаться с поддержкой
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}