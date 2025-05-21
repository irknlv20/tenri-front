"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { InquiryService, type CallbackInquiry } from "@/services/inquiry-service"
import { useToast } from "@/hooks/use-toast"

interface CallbackModalProps {
  propertyId?: string
}

export default function CallbackModal({ propertyId }: CallbackModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите номер телефона",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const data: CallbackInquiry = {
        name: name || "Клиент",
        phone,
        propertyId,
        message: "Заявка на обратный звонок из формы на сайте",
      }

      const response = await InquiryService.sendCallbackInquiry(data)

      toast({
        title: "Заявка отправлена",
        description: "Наш менеджер свяжется с вами в ближайшее время",
      })

      setIsOpen(false)
      setPhone("")
      setName("")
    } catch (error) {
      console.error("Error sending callback inquiry:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Пожалуйста, попробуйте позже",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Заказать звонок</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <form onSubmit={handleSubmit} className="py-6 text-center">
          <h2 className="text-xl font-medium mb-6">
            Хотите, мы перезвоним вам за 30 секунд и ответим на интересующие вас вопросы?
          </h2>

          <div className="flex flex-col gap-4 max-w-xs mx-auto mb-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="flex-grow"
            />
            <div className="flex gap-2">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ваш телефон"
                className="flex-grow"
                required
              />
              <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={loading}>
                {loading ? "..." : "Жду звонка!"}
              </Button>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-1 text-sm text-muted-foreground mx-auto"
          >
            <span className="underline">Выбрать удобное время для звонка</span>
          </button>

          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-4">
            <input type="checkbox" id="consent" checked readOnly />
            <label htmlFor="consent">Я согласен на обработку персональных данных</label>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
