"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const questions = [
  {
    id: 1,
    question: "당신의 침실 창문은 어느 방향을 향하고 있나요?",
    options: [
      { id: "a", text: "동쪽 (해가 뜨는 방향)" },
      { id: "b", text: "서쪽 (해가 지는 방향)" },
      { id: "c", text: "남쪽" },
      { id: "d", text: "북쪽" },
    ],
  },
  {
    id: 2,
    question: "집 안에서 가장 어두운 공간은 어디인가요?",
    options: [
      { id: "a", text: "침실" },
      { id: "b", text: "거실" },
      { id: "c", text: "주방" },
      { id: "d", text: "화장실" },
    ],
  },
  {
    id: 3,
    question: "집 안에 가장 많이 사용하는 색상은 무엇인가요?",
    options: [
      { id: "a", text: "흰색/베이지 등 밝은 색상" },
      { id: "b", text: "검정/회색 등 어두운 색상" },
      { id: "c", text: "빨강/주황 등 따뜻한 색상" },
      { id: "d", text: "파랑/초록 등 차가운 색상" },
    ],
  },
  {
    id: 4,
    question: "집 안에서 가장 많은 시간을 보내는 공간은 어디인가요?",
    options: [
      { id: "a", text: "침실" },
      { id: "b", text: "거실" },
      { id: "c", text: "주방" },
      { id: "d", text: "서재/작업실" },
    ],
  },
  {
    id: 5,
    question: "집 안의 가구 배치는 어떤 편인가요?",
    options: [
      { id: "a", text: "최소한의 가구만 배치하여 공간이 넓게 느껴진다" },
      { id: "b", text: "필요한 가구가 많아 다소 복잡하게 느껴진다" },
      { id: "c", text: "기능성 위주로 실용적으로 배치되어 있다" },
      { id: "d", text: "인테리어 중심으로 미적으로 배치되어 있다" },
    ],
  },
]

const results = {
  a: "당신의 공간은 대체로 좋은 기운을 가지고 있습니다. 하지만 몇 가지 작은 조정으로 더 나은 에너지 흐름을 만들 수 있습니다. 특히 동쪽 창문을 통한 아침 햇살은 긍정적인 에너지를 가져옵니다.",
  b: "당신의 공간은 개선의 여지가 있습니다. 특히 빛과 공기의 흐름을 개선하면 전반적인 에너지가 향상될 수 있습니다. 서쪽 창문은 저녁에 강한 햇빛이 들어올 수 있으니 적절한 차단이 필요합니다.",
  c: "당신의 공간은 활력과 열정의 에너지가 강합니다. 따뜻한 색상의 사용은 공간에 활기를 불어넣지만, 때로는 너무 자극적일 수 있습니다. 차분한 색상을 일부 도입하여 균형을 맞추는 것이 좋습니다.",
  d: "당신의 공간은 차분하고 안정적인 에너지를 가지고 있습니다. 차가운 색상은 진정 효과가 있지만, 때로는 너무 정적일 수 있습니다. 일부 따뜻한 요소를 도입하여 활력을 더하는 것이 좋습니다.",
}

const FengShuiTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
  }

  const getResult = () => {
    const answerCounts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 }

    Object.values(answers).forEach((answer) => {
      if (answer in answerCounts) {
        answerCounts[answer]++
      }
    })

    let maxCount = 0
    let result = "a"

    Object.entries(answerCounts).forEach(([answer, count]) => {
      if (count > maxCount) {
        maxCount = count
        result = answer
      }
    })

    return result
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <section className="section-padding relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

      <div className="container-width relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">간단한 풍수 테스트</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">5가지 질문으로 알아보는 당신 공간의 풍수 에너지</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="max-w-2xl mx-auto border-2 border-primary/10 shadow-lg backdrop-blur-sm bg-card/90">
            {!showResult ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">
                      질문 {currentQuestion + 1}/{questions.length}
                    </p>
                    <Progress value={progress} className="h-2 w-24" />
                  </div>
                  <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[questions[currentQuestion].id] || ""}
                    onValueChange={handleAnswer}
                    className="space-y-3"
                  >
                    {questions[currentQuestion].options.map((option) => (
                      <div
                        key={option.id}
                        className={cn(
                          "flex items-center space-x-2 rounded-md border-2 p-4 transition-all",
                          answers[questions[currentQuestion].id] === option.id
                            ? "border-primary bg-primary/5"
                            : "border-input hover:border-primary/30 hover:bg-muted/50",
                        )}
                      >
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} className="sr-only" />
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="flex flex-1 cursor-pointer items-center justify-between"
                        >
                          {option.text}
                          {answers[questions[currentQuestion].id] === option.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} className="group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    이전
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[questions[currentQuestion].id]}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all group"
                  >
                    {currentQuestion < questions.length - 1 ? "다음" : "결과 보기"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-xl text-center">테스트 결과</CardTitle>
                  <CardDescription className="text-center">당신 공간의 풍수 에너지 분석</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </motion.div>
                  <motion.p
                    className="mb-6 text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {results[getResult() as keyof typeof results]}
                  </motion.p>
                  <motion.p
                    className="text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    이 테스트는 간단한 참고용이며, 정확한 풍수 분석을 위해서는 전문가의 상담을 권장합니다.
                  </motion.p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={handleRestart} variant="outline" className="mr-2 group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    다시 테스트하기
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all group"
                  >
                    <a href="/contact">
                      상담 신청하기
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default FengShuiTest
