"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const CTA = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5" />
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent" />

      {/* 장식 요소 */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />

      <div className="container-width relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              풍수 컨설팅 서비스
            </h2>
            <p className="text-white/80 mb-4">
              정확한 기감(氣感)으로 객관적이며 가시적인 확인이 가능한 서비스 제공
            </p>
            <p className="text-white/80 mb-8">
              풍수는 미신이 아니고, 기(氣)의 흐름과 정확한 위치·크기·세기를 찾는 에너지 과학입니다. 묘(음택), 집(양택), 사업장(사무실, 공장, 가게) 등의 좋은 기운을 발산하는 혈(穴) 즉 명당이 궁금하시면 언제든지 편하게 문의 주십시오.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full group">
                <Link href="/contact">
                  상담 신청하기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full bg-white/90 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary group"
              >
                <Link href="/services">
                  서비스 알아보기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative flex items-end justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[3/4] w-full max-w-md rounded-2xl overflow-hidden bg-white/10 p-1 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent z-10" />
                <img
                  src="/images/FS_preview.png"
                  alt="모던 풍수 컨설팅"
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
            </div>

            <motion.div
              className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-sm font-medium">첫 상담 20% 할인</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTA
