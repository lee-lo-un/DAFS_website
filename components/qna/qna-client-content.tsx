"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import QuestionActions from "./question-actions"
import { Pagination } from "@/components/ui/pagination"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  is_admin?: boolean
}

interface Answer {
  id: string
  content: string
  admin_id: string
  created_at: string
  profiles?: Profile
}

interface Question {
  id: string
  title: string
  content: string
  category: string
  created_at: string
  user_id: string
  profiles?: Profile
  answers: Answer[]
}

interface User {
  id: string
  email: string | null
  full_name: string | null
  is_admin?: boolean
}

interface QnaClientContentProps {
  faqs?: {
    question: string
    answer: string
  }[]
  questions: Question[]
  currentUser: User | null
}

export default function QnaClientContent({ faqs = [], questions, currentUser }: QnaClientContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category") || null)

  // 페이지네이션 상태
  const currentPage = Number(searchParams.get("page") || "1")
  const perPage = Number(searchParams.get("per_page") || "6")

  // 카테고리 목록 추출
  const categories = Array.from(new Set(questions.map((q) => q.category))).filter(Boolean)

  // 질문 필터링
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = searchTerm
      ? question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    const matchesCategory = selectedCategory ? question.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  // 페이지네이션 적용
  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * perPage, currentPage * perPage)

  // 사용자 이름 가져오기 (full_name이 없으면 이메일 사용, 둘 다 없으면 "익명 사용자")
  const getUserName = (profile?: Profile) => {
    if (!profile) return "익명 사용자"
    return profile.full_name || profile.email?.split("@")[0] || "익명 사용자"
  }

  // 아바타 이니셜 가져오기
  const getInitials = (profile?: Profile) => {
    if (!profile) return "?"
    if (profile.full_name) return profile.full_name.charAt(0).toUpperCase()
    if (profile.email) return profile.email.charAt(0).toUpperCase()
    return "?"
  }

  // 페이지당 항목 수 변경 처리
  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("per_page", value)
    params.set("page", "1") // 페이지당 항목 수 변경 시 첫 페이지로 이동
    router.push(`/qna?${params.toString()}`)
  }

  // 카테고리 변경 처리
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1") // 카테고리 변경 시 첫 페이지로 이동

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    router.push(`/qna?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      {/* 자주 묻는 질문 섹션 */}
      {faqs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
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
      )}

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2">
          <Input
            placeholder="질문 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryChange(null)}
            className="text-sm"
          >
            전체
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryChange(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* 질문하기 버튼 */}
      <div className="flex justify-end">
        <Link href="/qna/ask" passHref>
          <Button>질문하기</Button>
        </Link>
      </div>

      {/* 질문 목록 */}
      {paginatedQuestions.length > 0 ? (
        <div className="grid gap-6">
          {paginatedQuestions.map((question) => (
            <Card key={question.id} className="overflow-hidden">
              <CardHeader className="py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <Link href={`/qna/${question.id}`} className="hover:text-primary transition-colors">
                      <CardTitle className="text-lg">{question.title}</CardTitle>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                        {question.category}
                      </span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(question.created_at), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback>{getInitials(question.profiles)}</AvatarFallback>
                        </Avatar>
                        <span>{getUserName(question.profiles)}</span>
                      </div>
                      <span>•</span>
                      <span>답변 {question.answers.length}개</span>
                    </div>
                  </div>
                  {currentUser && currentUser.id === question.user_id && (
                    <QuestionActions questionId={question.id} hasAnswers={question.answers.length > 0} />
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">질문이 없습니다.</p>
          <p className="mt-2">첫 번째 질문을 작성해보세요!</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {filteredQuestions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredQuestions.length / perPage)}
          perPage={perPage}
          totalItems={filteredQuestions.length}
          baseUrl="/qna"
          onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  )
}
