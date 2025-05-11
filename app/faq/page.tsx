"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, HelpCircle, Search, MessageSquare } from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    question: "풍수지리 상담은 어떻게 진행되나요?",
    answer:
      "풍수지리 상담은 먼저 온라인 또는 전화로 기본 정보를 수집한 후, 1:1 상담을 통해 구체적인 요구사항을 파악합니다. 필요한 경우 현장 방문을 통해 공간을 분석하고, 최종적으로 풍수지리 보고서와 개선 방안을 제공해 드립니다.",
  },
  {
    question: "이미 분양받은 아파트도 풍수지리 상담이 가능한가요?",
    answer:
      "네, 가능합니다. 이미 분양받은 아파트의 경우도 가구 배치, 색상, 장식품 등을 통해 풍수적 에너지를 개선할 수 있는 방법이 많습니다. 실내 인테리어 조정을 통해 주거 환경을 크게 개선할 수 있습니다.",
  },
  {
    question: "풍수지리와 과학은 어떤 관계가 있나요?",
    answer:
      "전통 풍수지리는 자연 환경과 인간의 조화를 중시하는 동양 철학의 일종입니다. 모던 풍수에서는 이러한 전통적 지혜에 현대 과학(지형학, 건축학, 심리학 등)을 접목하여 더욱 객관적이고 검증 가능한 방식으로 풍수지리를 해석하고 적용합니다.",
  },
  {
    question: "상담 비용은 어떻게 되나요?",
    answer:
      "상담 비용은 서비스 유형, 공간의 크기, 방문 여부 등에 따라 달라집니다. 주거용 기본 상담은 15만원부터 시작하며, 사무실이나 특수 공간은 별도 견적이 필요합니다. 정확한 비용은 초기 상담 시 안내해 드립니다.",
  },
  {
    question: "온라인으로만 상담도 가능한가요?",
    answer:
      "네, 가능합니다. 특히 코로나19 이후 온라인 화상 상담 서비스도 활발히 진행하고 있습니다. 현장 방문이 어려운 경우 도면과 사진, 화상 통화 등을 통해 원격으로도 상담을 제공해 드립니다.",
  },
  {
    question: "풍수지리 상담 후 얼마나 빨리 효과를 볼 수 있나요?",
    answer:
      "공간의 에너지 변화는 개선 사항을 적용한 후 일반적으로 2-4주 내에 느껴지기 시작합니다. 하지만 개인마다 민감도가 다르고, 변화의 규모에 따라 체감 시기는 달라질 수 있습니다. 대부분의 고객님들은 3개월 이내에 뚜렷한 변화를 경험하십니다.",
  },
  {
    question: "풍수지리 상담은 어떤 사람들에게 도움이 되나요?",
    answer:
      "새 집으로 이사를 계획 중인 분, 현재 공간에서 불편함이나 에너지 정체를 느끼는 분, 사업장의 성과를 높이고 싶은 분, 가족 구성원의 건강이나 관계 개선을 원하는 분 등 다양한 목적을 가진 분들에게 도움이 됩니다.",
  },
  {
    question: "풍수지리 상담 전에 준비해야 할 것이 있나요?",
    answer:
      "상담 전에 공간의 평면도나 도면이 있으면 좋습니다. 없다면 간단한 스케치나 사진도 도움이 됩니다. 또한 현재 공간에서 느끼는 불편함이나 개선하고 싶은 점들을 미리 정리해두시면 더 효과적인 상담이 가능합니다.",
  },
  {
    question: "풍수지리 상담 후 사후 관리도 해주시나요?",
    answer:
      "네, 모든 상담 패키지에는 기본적인 사후 관리가 포함되어 있습니다. 프리미엄 및 VIP 패키지의 경우 더 장기적이고 심층적인 사후 관리를 제공합니다. 개선 사항 적용 후 추가 질문이나 조언이 필요하시면 언제든지 연락 주세요.",
  },
  {
    question: "풍수지리와 인테리어 디자인은 어떻게 조화시키나요?",
    answer:
      "모던 풍수는 현대적인 인테리어 디자인과 충돌하지 않도록 실용적인 접근법을 취합니다. 오히려 풍수 원��를 적용함으로써 더 기능적이고 아름다운 공간을 만들 수 있습니다. 인테리어 디자이너와의 협업도 가능하며, 풍수 원리를 고려한 디자인 가이드라인을 제공해 드립니다.",
  },
]

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">자주 묻는 질문</h1>
            <p className="text-xl text-foreground/70 mb-8">
              풍수지리 서비스에 대해 고객분들이 자주 문의하시는 질문들을 모았습니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 relative">
        {/* 배경 장식 요소 */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-2 border-muted rounded-lg px-6 shadow-sm hover:border-primary/20 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pb-4">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="space-y-6">
              <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="mr-2 h-5 w-5 text-primary" />
                    질문 검색
                  </CardTitle>
                  <CardDescription>원하는 정보를 빠르게 찾아보세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="검색어를 입력하세요..."
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <Button size="sm" className="absolute right-1 top-1 h-7 w-7 px-0">
                      <Search className="h-4 w-4" />
                      <span className="sr-only">검색</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                    답변을 찾지 못하셨나요?
                  </CardTitle>
                  <CardDescription>직접 문의해 주세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground/80">
                    찾으시는 정보가 없거나 더 자세한 설명이 필요하시면 언제든지 문의해 주세요. 최대한 빠르게 답변
                    드리겠습니다.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all group"
                  >
                    <Link href="/contact">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      문의하기
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle>상담 예약</CardTitle>
                  <CardDescription>전문가와 직접 상담하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground/80">
                    풍수지리에 대한 전문적인 상담이 필요하시면 지금 바로 예약하세요. 첫 상담 시 20% 할인 혜택을
                    드립니다.
                  </p>
                  <Button asChild variant="outline" className="w-full group">
                    <Link href="/contact">
                      상담 예약하기
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Questions Section */}
      <section className="py-16 px-4 md:px-8 bg-muted relative overflow-hidden">
        {/* 배경 장식 요소 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">관련 질문</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">다른 고객님들이 자주 찾아보는 질문들입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/10 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg">풍수지리와 집값의 관계는?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  좋은 풍수를 가진 부동산은 장기적으로 가치가 상승하는 경향이 있습니다. 풍수지리적 요소가 부동산 가치에
                  미치는 영향에 대해 알아보세요.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/10 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg">풍수지리와 건강의 관계</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  주거 환경의 풍수지리적 요소가 거주자의 건강에 미치는 영향과 건강을 증진시키는 공간 배치에 대해
                  알아보세요.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/10 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg">풍수지리 자가진단 방법</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  전문가의 도움 없이도 간단히 확인할 수 있는 기본적인 풍수지리 자가진단 방법에 대해 알아보세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5" />

        <div className="container-width relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">아직 궁금한 점이 있으신가요?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            모든 질문에 답변해 드립니다. 지금 바로 문의하시거나 상담을 신청하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              className="rounded-full border-white/20 text-white hover:bg-white/10 group"
            >
              <Link href="/contact?type=question">
                질문하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
