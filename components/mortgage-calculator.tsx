"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { InquiryService } from "@/services/inquiry-service"
import { useToast } from "@/hooks/use-toast"

export default function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(15500000)
  const [downPayment, setDownPayment] = useState(3100000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(5.85)
  const [term, setTerm] = useState(25)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [loanAmount, setLoanAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Расчет ипотеки при изменении параметров
  useEffect(() => {
    const calculateMortgage = async () => {
      try {
        setLoading(true)

        const result = await InquiryService.calculateMortgage({
          price: propertyPrice,
          initialPayment: downPayment,
          term: term,
          rate: interestRate,
        })

        setMonthlyPayment(result.monthlyPayment)
        setLoanAmount(result.loanAmount)
      } catch (error) {
        console.error("Error calculating mortgage:", error)
        // Если API недоступно, рассчитываем на клиенте
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
      } finally {
        setLoading(false)
      }
    }

    calculateMortgage()
  }, [propertyPrice, downPayment, interestRate, term])

  // Обновление первоначального взноса при изменении процента
  useEffect(() => {
    setDownPayment(Math.round(propertyPrice * (downPaymentPercent / 100)))
  }, [propertyPrice, downPaymentPercent])

  // Обновление процента при изменении первоначального взноса
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value)
    setDownPaymentPercent(Math.round((value / propertyPrice) * 100))
  }

  const handleFindBank = () => {
    toast({
      title: "Поиск банка",
      description: "Мы подберем для вас банк с лучшими условиями",
    })
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
          <div className="h-1 bg-primary/20 mt-1 rounded-full">
            <div className="h-full bg-primary rounded-full" style={{ width: "50%" }}></div>
          </div>
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
          <div className="h-1 bg-primary/20 mt-1 rounded-full">
            <div className="h-full bg-primary rounded-full" style={{ width: `${downPaymentPercent}%` }}></div>
          </div>
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
          <div className="h-1 bg-primary/20 mt-1 rounded-full">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(term / 30) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div>
          <label className="text-sm text-muted-foreground">Сумма кредита</label>
          <div className="text-xl font-bold mt-1">
            {loading ? (
              <div className="animate-pulse h-7 w-32 bg-muted-foreground/20 rounded"></div>
            ) : (
              `${loanAmount.toLocaleString()} тенге`
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Платеж в месяц</label>
          <div className="text-xl font-bold mt-1">
            {loading ? (
              <div className="animate-pulse h-7 w-32 bg-muted-foreground/20 rounded"></div>
            ) : (
              `${Math.round(monthlyPayment).toLocaleString()} тенге`
            )}
          </div>
        </div>
      </div>

      <Button className="w-full mt-6" onClick={handleFindBank}>
        Найти подходящий банк
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-2">Расчет не является публичной офертой</p>
    </div>
  )
}
