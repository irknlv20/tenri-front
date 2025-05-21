import { Award, Clock, Home, Percent } from "lucide-react"

export default function AdvantagesSection() {
  const advantages = [
    {
      icon: <Home className="h-10 w-10 text-primary" />,
      title: "Большой выбор квартир",
      description: "Более 500 вариантов квартир от ведущих застройщиков Кызылорды",
    },
    {
      icon: <Percent className="h-10 w-10 text-primary" />,
      title: "Выгодные условия",
      description: "Специальные предложения, акции и программы рассрочки от застройщиков",
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Проверенные застройщики",
      description: "Мы сотрудничаем только с надежными и проверенными компаниями",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Экономия времени",
      description: "Вся информация о новостройках собрана в одном месте",
    },
  ]

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="mb-10 text-center text-2xl font-bold">Почему выбирают TENRI HOME</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map((advantage, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4">{advantage.icon}</div>
              <h3 className="mb-2 text-lg font-medium">{advantage.title}</h3>
              <p className="text-sm text-muted-foreground">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
