"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function MortgageCalculator({ property }: { property?: any }) {
  const [propertyPrice, setPropertyPrice] = useState(property?.price || 15500000)
  const [downPayment, setDownPayment] = useState(property?.price / 5 || 3100000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(5.85)
  const [term, setTerm] = useState(25)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [loanAmount, setLoanAmount] = useState(0)
  const [showBanks, setShowBanks] = useState(false)
  const { toast } = useToast()
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)

  useEffect(() => {
    const calculateMortgage = () => {
      const loan = propertyPrice - downPayment
      setLoanAmount(loan)

      const monthlyRate = interestRate / 100 / 12
      const numberOfPayments = term * 12

      if (monthlyRate === 0) {
        setMonthlyPayment(loan / numberOfPayments)
      } else {
        const x = Math.pow(1 + monthlyRate, numberOfPayments)
        const monthly = (loan * x * monthlyRate) / (x - 1)
        setMonthlyPayment(monthly)
      }
    }

    calculateMortgage()
  }, [propertyPrice, downPayment, interestRate, term])

  useEffect(() => {
    setDownPayment(Math.round(propertyPrice * (downPaymentPercent / 100)))
  }, [propertyPrice, downPaymentPercent])

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value)
    setDownPaymentPercent(Math.round((value / propertyPrice) * 100))
  }

  const handleFindBank = () => {
    setIsLoadingBanks(true)
    setShowBanks(true)
    setTimeout(() => {
      setIsLoadingBanks(false)
    }, 1000)
  }

  return (
    <div className="bg-muted p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Калькулятор ипотеки</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm text-muted-foreground">Стоимость квартиры, тенге</label>
          <Input
            type="number"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            className="mt-1"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <label className="text-sm text-muted-foreground">Первоначальный взнос, тенге</label>
            <span className="text-sm font-medium">{downPaymentPercent}%</span>
          </div>
          <Input
            type="number"
            value={downPayment}
            onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Ставка, %</label>
          <Input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            step="0.01"
            className="mt-1"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <label className="text-sm text-muted-foreground">Срок, лет</label>
            <span className="text-sm font-medium">{term}</span>
          </div>
          <Input
            type="range"
            min="1"
            max="30"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div>
          <label className="text-sm text-muted-foreground">Сумма кредита</label>
          <div className="text-xl font-bold mt-1">{`${loanAmount} тенге`}</div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Платеж в месяц</label>
          <div className="text-xl font-bold mt-1">{`${Math.round(monthlyPayment).toLocaleString()} тенге`}</div>
        </div>
      </div>

      <Button className="w-full mt-6" onClick={handleFindBank}>
        Найти подходящий банк с минимальной ставкой
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-2">Расчет не является публичной офертой</p>

      {/* Модалка */}
      <Dialog open={showBanks} onOpenChange={setShowBanks}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подходящие банки</DialogTitle>
            <DialogDescription>
              На основе вашего запроса мы подобрали лучшие условия:
            </DialogDescription>
          </DialogHeader>

          {isLoadingBanks ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 mt-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50">
                <Image src="/banks/otbasy.png" alt="Отбасы Банк" width={100} height={40} />
                <div>
                  <h3 className="font-semibold">🏆 Отбасы Банк</h3>
                  <p className="text-sm text-muted-foreground">Ставка: 5.85% — самый выгодный вариант</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Image src="/banks/halyk.png" alt="Халык Банк" width={100} height={40} />
                <div>
                  <h3 className="font-semibold">Халык Банк</h3>
                  <p className="text-sm text-muted-foreground">Ставка: 7.2%</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Image src="/banks/kaspi.png" alt="Kaspi Банк" width={100} height={40} />
                <div>
                  <h3 className="font-semibold">Kaspi Банк</h3>
                  <p className="text-sm text-muted-foreground">Ставка: 8.1%</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
