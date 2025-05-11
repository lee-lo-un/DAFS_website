import Hero from "@/components/home/hero"
import ServiceCategories from "@/components/home/service-categories"
import Testimonials from "@/components/home/testimonials"
import ModernValue from "@/components/home/modern-value"
import CTA from "@/components/home/cta"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServiceCategories />
      <ModernValue />
      <Testimonials />
      <CTA />
    </div>
  )
}
