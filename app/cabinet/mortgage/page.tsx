import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, FileText, PiggyBank, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MortgagePage() {
  const mortgages = [
    {
      id: "1",
      title: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      status: "Одобрено",
      statusColor: "bg-green-500",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Центральный, ул. Абая, д. 5, кв. 42",
      bank: "Народный Банк Казахстана",
      program: "Ипотека 7-20-25",
      amount: 18500000,
      term: 20,
      rate: 7.5,
      monthlyPayment: 148200,
      startDate: "01.06.2025",
      documents: 5,
    },
  ]

  const applications = [
    {
      id: "2",
      title: "3-комнатная квартира в ЖК «Арман»",
      status: "На рассмотрении",
      statusColor: "bg-blue-500",
      image: "/placeholder.svg?height=150&width=250",
      address: "мкр. Сырдарья, ул. Токмагамбетова, д. 8, кв. 15",
      bank: "Kaspi Bank",
      program: "Стандартная ипотека",
      amount: 25000000,
      term: 15,
      rate: 8.5,
      applicationDate: "10.05.2025",
      expectedDecisionDate: "17.05.2025",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ипотека</h2>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Активные ипотеки</TabsTrigger>
          <TabsTrigger value="applications">Заявки</TabsTrigger>
          <TabsTrigger value="calculator">Калькулятор</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-6">
            {mortgages.length > 0 ? (
              mortgages.map((mortgage) => (
                <Card key={mortgage.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/4 aspect-video md:aspect-auto">
                        <Image
                          src={mortgage.image || "/placeholder.svg"}
                          alt={mortgage.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className={`absolute top-2 left-2 ${mortgage.statusColor} text-white border-0`}>
                          {mortgage.status}
                        </Badge>
                      </div>

                      <div className="p-6 flex-1">
                        <h3 className="text-xl font-bold mb-2">{mortgage.title}</h3>

                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{mortgage.address}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Банк</div>
                            <div className="font-medium">{mortgage.bank}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Программа</div>
                            <div className="font-medium">{mortgage.program}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Дата начала</div>
                            <div className="font-medium">{mortgage.startDate}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Сумма кредита</div>
                            <div className="font-medium">{mortgage.amount.toLocaleString()} ₸</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Срок / Ставка</div>
                            <div className="font-medium">
                              {mortgage.term} лет / {mortgage.rate}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Ежемесячный платеж</div>
                            <div className="font-medium">{mortgage.monthlyPayment.toLocaleString()} ₸</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link href={`/cabinet/mortgage/${mortgage.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <PiggyBank className="h-4 w-4" />
                              График платежей
                            </Button>
                          </Link>
                          <Link href={`/cabinet/documents?mortgage=${mortgage.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <FileText className="h-4 w-4" />
                              Документы ({mortgage.documents})
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">У вас пока нет активных ипотечных кредитов</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <div className="space-y-6">
            {applications.length > 0 ? (
              applications.map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/4 aspect-video md:aspect-auto">
                        <Image
                          src={application.image || "/placeholder.svg"}
                          alt={application.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className={`absolute top-2 left-2 ${application.statusColor} text-white border-0`}>
                          {application.status}
                        </Badge>
                      </div>

                      <div className="p-6 flex-1">
                        <h3 className="text-xl font-bold mb-2">{application.title}</h3>

                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{application.address}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Банк</div>
                            <div className="font-medium">{application.bank}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Программа</div>
                            <div className="font-medium">{application.program}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Дата подачи</div>
                            <div className="font-medium">{application.applicationDate}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Сумма кредита</div>
                            <div className="font-medium">{application.amount.toLocaleString()} ₸</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Срок / Ставка</div>
                            <div className="font-medium">
                              {application.term} лет / {application.rate}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Ожидаемое решение</div>
                            <div className="font-medium">{application.expectedDecisionDate}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Clock className="h-4 w-4" />
                          <span>Ожидается решение банка</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">У вас пока нет заявок на ипотеку</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Ипотечный калькулятор</h3>
              <p className="text-muted-foreground mb-6">
                Рассчитайте примерный ежемесячный платеж и общую сумму выплат по ипотеке
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm text-muted-foreground">Стоимость квартиры, тенге</label>
                  <input type="number" defaultValue="20000000" className="w-full mt-1 p-2 border rounded-md" />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-sm text-muted-foreground">Первоначальный взнос, тенге</label>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <input type="number" defaultValue="4000000" className="w-full mt-1 p-2 border rounded-md" />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Ставка, %</label>
                  <input type="number" defaultValue="7.5" step="0.1" className="w-full mt-1 p-2 border rounded-md" />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-sm text-muted-foreground">Срок, лет</label>
                    <span className="text-sm font-medium">20</span>
                  </div>
                  <input type="range" min="1" max="30" defaultValue="20" className="w-full mt-1" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div>
                  <label className="text-sm text-muted-foreground">Сумма кредита</label>
                  <div className="text-xl font-bold mt-1">16 000 000 тенге</div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Платеж в месяц</label>
                  <div className="text-xl font-bold mt-1">128 376 тенге</div>
                </div>
              </div>

              <Button className="w-full mt-6">Подобрать ипотечные программы</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
