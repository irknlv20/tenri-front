"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InquiryService, type MortgageInquiry } from "@/services/inquiry-service"
import { useToast } from "@/hooks/use-toast"

interface MortgageModalProps {
  propertyId?: string
  apartmentId?: string
}

export default function MortgageModal({ propertyId, apartmentId }: MortgageModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone || !name) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните обязательные поля",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const data: MortgageInquiry = {
        name,
        phone,
        email,
        propertyId,
        apartmentId,
        message: "Заявка на ипотеку из формы на сайте",
      }

      const response = await InquiryService.sendMortgageInquiry(data)

      toast({
        title: "Заявка отправлена",
        description: "Наш менеджер свяжется с вами в ближайшее время",
      })

      setIsOpen(false)
      setName("")
      setPhone("")
      setEmail("")
    } catch (error) {
      console.error("Error sending mortgage inquiry:", error)
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
        <Button variant="outline">Ипотека</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Ипотека — быстро и просто!</DialogTitle>
          <DialogDescription>Подберем для вас банк с лучшими условиями</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Позвоним и расскажем какие актуальные предложения от банков есть сегодня в ЖК «Кызылорда-Сити».
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground">Телефон*</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Имя*</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-muted-foreground">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>

          <div className="flex justify-center">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Отправка..." : "Найти банк!"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">Ваши данные защищены шифрованием</p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
