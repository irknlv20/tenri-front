import { Suspense } from "react"
import AdvantagesSection from "@/components/advantages-section"
import DevelopersSection from "@/components/developers-section"
import FeaturedSection from "@/components/featured-section"
import HeroSection from "@/components/hero-section"
import PromotionsSection from "@/components/promotions-section"
import SearchSection from "@/components/search-section"
import RegistrationForm from "@/components/registration-form"
import Loading from "./loading"

export default function Home() {
  return (
    <>
      <HeroSection />
      <SearchSection />

      <Suspense fallback={<Loading />}>
        <FeaturedSection />
      </Suspense>

      <AdvantagesSection />

      <Suspense fallback={<Loading />}>
        <PromotionsSection />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <DevelopersSection />
      </Suspense>

      <div className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">Личный кабинет</h2>
          <RegistrationForm />
        </div>
      </div>
    </>
  )
}
