import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary/80 py-16 text-primary-foreground">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Найдите идеальную квартиру в Кызылорде
          </h1>
          <p className="mb-8 text-lg text-primary-foreground/90">
            TENRI HOME поможет вам выбрать комфортное жилье от надежных застройщиков с выгодными условиями покупки
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/novostroiki">
              <Button size="lg" variant="secondary">
                Смотреть новостройки
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Связаться с нами
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
