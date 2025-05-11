"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Building2, Landmark, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const services = [
  {
    id: 1,
    title: "주거 풍수",
    description: "아파트, 주택 등 주거공간의 풍수 분석 및 개선 방안 제시",
    icon: Home,
    link: "/services/residential",
    color: "from-primary/20 to-primary/5",
    hoverColor: "hover:border-primary/30",
    bgGradient: "bg-gradient-to-br from-primary/10 to-transparent",
  },
  {
    id: 2,
    title: "사무실 풍수",
    description: "사업장, 오피스 공간의 풍수 분석으로 비즈니스 성공 기반 마련",
    icon: Building2,
    link: "/services/office",
    color: "from-secondary/20 to-secondary/5",
    hoverColor: "hover:border-secondary/30",
    bgGradient: "bg-gradient-to-br from-secondary/10 to-transparent",
  },
  {
    id: 3,
    title: "묘지 풍수",
    description: "전통적인 묘지 터 상담 및 현대적 해석을 통한 최적의 장소 선정",
    icon: Landmark,
    link: "/services/grave",
    color: "from-accent/20 to-accent/5",
    hoverColor: "hover:border-accent/30",
    bgGradient: "bg-gradient-to-br from-accent/10 to-transparent",
  },
]

const ServiceCategories = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="section-padding relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="container-width relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">풍수 컨설팅 서비스</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            정확한 기감(氣感)으로 객관적이며 가시적인 확인이 가능한 서비스 제공
          </p>
          <p className="text-foreground/70 max-w-2xl mx-auto mt-2">
            풍수는 미신이 아니고, 기(氣)의 흐름과 정확한 위치·크기·세기를 찾는 에너지 과학입니다.
            묘(음택), 집(양택), 사업장(사무실, 공장, 가게) 등의 좋은 기운을 발산하는 혈(穴) 즉 명당이 
            궁금하시면 언제든지 편하게 문의 주십시오.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card
                className={cn(
                  "transition-all duration-300 border-2 overflow-hidden bg-white dark:bg-gray-800 shadow",
                  service.id === 1 ? "border-blue-200 dark:border-blue-600/50" : "",
                  service.id === 2 ? "border-green-200 dark:border-green-600/50" : "",
                  service.id === 3 ? "border-amber-200 dark:border-amber-600/50" : "",
                  hoveredId === service.id ? "shadow-lg dark:shadow-blue-900/20" : "",
                )}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <CardHeader className="relative z-10">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                      service.id === 1 ? "bg-blue-100 dark:bg-blue-900/40" : "",
                      service.id === 2 ? "bg-green-100 dark:bg-green-900/40" : "",
                      service.id === 3 ? "bg-amber-100 dark:bg-amber-900/40" : "",
                    )}
                  >
                    <service.icon className="h-7 w-7 text-gray-800 dark:text-gray-200" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800 dark:text-white">{service.title}</CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="h-32 relative z-10">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {service.id === 1 && (
                      <>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                          아파트/주택 구조 분석
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                          가구 배치 및 인테리어 조언
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                          가족 구성원별 방향성 제시
                        </li>
                      </>
                    )}
                    {service.id === 2 && (
                      <>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>
                          사업장 위치 및 구조 분석
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>
                          업종별 최적 배치 제안
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>
                          비즈니스 성장을 위한 공간 설계
                        </li>
                      </>
                    )}
                    {service.id === 3 && (
                      <>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                          묘지 터 분석 및 선정
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                          현대적 관점의 풍수 해석
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                          가족 운세와의 연관성 분석
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="relative z-10">
                  <div className={cn(
                    "w-full rounded-md", 
                    service.id === 1 ? "bg-blue-50 dark:bg-blue-900/30" : "",
                    service.id === 2 ? "bg-green-50 dark:bg-green-900/30" : "",
                    service.id === 3 ? "bg-amber-50 dark:bg-amber-900/30" : "",
                    hoveredId === service.id ? "shadow-sm dark:shadow-lg dark:shadow-blue-900/10" : ""
                  )}>
                    <Link 
                      href={service.link}
                      className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors group"
                    >
                      자세히 보기
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ServiceCategories
