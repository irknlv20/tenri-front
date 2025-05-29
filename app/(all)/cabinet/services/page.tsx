import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Truck,
  PaintBucket,
  Sofa,
  Ruler,
  Lightbulb,
  Shield,
  Wrench,
  Home,
  Briefcase,
  FileText,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      id: "1",
      title: "Переезд и транспортировка",
      description: "Услуги по организации переезда и транспортировке вещей в новую квартиру",
      icon: <Truck className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/moving",
    },
    {
      id: "2",
      title: "Ремонт и отделка",
      description: "Услуги по ремонту и отделке квартиры под ключ или частичному ремонту",
      icon: <PaintBucket className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/renovation",
    },
    {
      id: "3",
      title: "Мебель и интерьер",
      description: "Услуги по подбору и установке мебели, дизайн интерьера",
      icon: <Sofa className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/furniture",
    },
    {
      id: "4",
      title: "Замеры и планировка",
      description: "Профессиональные замеры помещений и консультации по планировке",
      icon: <Ruler className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/measurements",
    },
    {
      id: "5",
      title: "Подключение коммуникаций",
      description: "Помощь в подключении электричества, воды, газа, интернета и ТВ",
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/utilities",
    },
    {
      id: "6",
      title: "Страхование недвижимости",
      description: "Страхование квартиры, имущества и ответственности перед соседями",
      icon: <Shield className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/insurance",
    },
    {
      id: "7",
      title: "Сервисное обслуживание",
      description: "Регулярное обслуживание и ремонт инженерных систем квартиры",
      icon: <Wrench className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/maintenance",
    },
    {
      id: "8",
      title: "Управление недвижимостью",
      description: "Услуги по управлению и сдаче недвижимости в аренду",
      icon: <Home className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/management",
    },
    {
      id: "9",
      title: "Юридические услуги",
      description: "Юридическое сопровождение сделок с недвижимостью",
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/legal",
    },
    {
      id: "10",
      title: "Оценка недвижимости",
      description: "Профессиональная оценка рыночной стоимости недвижимости",
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: "/cabinet/services/valuation",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Полезные сервисы</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-4">{service.icon}</div>

              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

              <Link href={service.link}>
                <Button variant="outline" className="w-full gap-1">
                  Подробнее
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
