"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const testimonials = [
  {
    id: 1,
    name: "김지영",
    role: "아파트 거주자",
    content:
      "처음에는 반신반의했지만, 모던 풍수의 조언대로 가구 배치를 바꾸고 색상을 조정하니 집 안의 분위기가 확실히 달라졌어요. 특히 아이들 방의 학습 환경이 개선되어 집중력이 높아진 것 같아요. 전문적이면서도 현대적인 접근 방식이 마음에 들었습니다.",
    avatar: "K",
    rating: 5,
  },
  {
    id: 2,
    name: "박성민",
    role: "사업장 운영자",
    content:
      "사무실 이전 전에 모던 풍수에 컨설팅을 받았습니다. 과학적인 데이터와 함께 풍수 원리를 설명해주셔서 신뢰가 갔어요. 새 사무실은 직원들의 만족도도 높고, 비즈니스도 예전보다 훨씬 잘 풀리고 있습니다.",
    avatar: "P",
    rating: 5,
  },
  {
    id: 3,
    name: "이현우",
    role: "신혼부부",
    content:
      "결혼 후 신혼집을 구할 때 모던 풍수의 도움을 받았어요. 미신적인 부분보다는 실용적인 공간 활용과 에너지 흐름에 중점을 둔 조언이 정말 유용했습니다. 덕분에 편안하고 조화로운 신혼 생활을 시작할 수 있었어요.",
    avatar: "L",
    rating: 4,
  },
]

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
        setIsAnimating(false)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="section-padding relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted" />
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent" />

      <div className="container-width relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">고객 후기</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            모던 풍수의 컨설팅을 경험한 고객들의 생생한 후기를 확인하세요.
          </p>
        </motion.div>

        <div className="relative h-[400px] md:h-[300px]">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={cn(
                "absolute w-full transition-all duration-500 ease-in-out backdrop-blur-sm bg-card/80 border-2",
                activeIndex === index
                  ? "opacity-100 translate-y-0 z-10 border-primary/20 shadow-lg"
                  : "opacity-0 translate-y-8 -z-10 border-transparent",
                isAnimating ? "scale-95" : "scale-100",
              )}
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i + testimonial.rating} className="h-5 w-5 text-muted-foreground" />
                  ))}
                </div>
                <p className="text-center text-lg mb-6 italic">"{testimonial.content}"</p>
              </CardContent>
              <CardFooter className="flex-col items-center">
                <Avatar className="h-14 w-14 mb-3 ring-2 ring-primary/20 ring-offset-2">
                  <AvatarImage src={`/placeholder.svg?text=${testimonial.avatar}`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-medium text-lg">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true)
                setTimeout(() => {
                  setActiveIndex(index)
                  setIsAnimating(false)
                }, 500)
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                activeIndex === index ? "bg-primary w-6" : "bg-primary/30",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button asChild variant="outline" className="group">
            <Link href="/reviews">
              더 많은 후기 보기
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
