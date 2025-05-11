"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

interface EditQuestionPageProps {
  params: {
    id: string
  }
}

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  const questionId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  })
  const supabase = createSupabaseClient()

  // 질문 데이터 가져오기
  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true)
      try {
        // 현재 로그인한 사용자 정보 가져오기
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          toast({
            title: "로그인이 필요합니다",
            description: "질문을 수정하려면 먼저 로그인해주세요.",
            variant: "destructive",
          })
          router.push("/login?redirect=/qna")
          return
        }

        // 질문 데이터 가져오기
        const { data: question, error } = await supabase
          .from("questions")
          .select("*, answers(id)")
          .eq("id", questionId)
          .single()

        if (error) {
          throw error
        }

        // 본인 질문이 아닌 경우
        if (question.user_id !== user.id) {
          toast({
            title: "접근 권한이 없습니다",
            description: "본인이 작성한 질문만 수정할 수 있습니다.",
            variant: "destructive",
          })
          router.push("/qna")
          return
        }

        // 답변이 있는 경우
        if (question.answers && question.answers.length > 0) {
          toast({
            title: "수정 불가",
            description: "답변이 달린 질문은 수정할 수 없습니다.",
            variant: "destructive",
          })
          router.push(`/qna/${questionId}`)
          return
        }

        // 폼 데이터 설정
        setFormData({
          title: question.title,
          category: question.category,
          content: question.content,
        })
      } catch (error) {
        console.error("Error fetching question:", error)
        toast({
          title: "질문 불러오기 실패",
          description: "질문을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
        router.push("/qna")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [questionId, router, supabase, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 폼 유효성 검사
      if (!formData.title.trim() || !formData.category || !formData.content.trim()) {
        toast({
          title: "입력 오류",
          description: "모든 필드를 입력해주세요.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "질문을 수정하려면 먼저 로그인해주세요.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const { error } = await supabase
        .from("questions")
        .update({
          title: formData.title,
          category: formData.category,
          content: formData.content,
        })
        .eq("id", questionId)
        .eq("user_id", user.id)

      if (error) {
        throw error
      }

      toast({
        title: "질문이 수정되었습니다",
        description: "성공적으로 질문이 수정되었습니다.",
      })

      router.push(`/qna/${questionId}`)
      router.refresh()
    } catch (error) {
      console.error("Error updating question:", error)
      toast({
        title: "질문 수정 실패",
        description: "질문을 수정하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 질문 카테고리 목록
  const categories = ["주거 풍수", "사무실 풍수", "상업 공간 풍수", "정원 풍수", "인테리어 풍수", "풍수 이론", "기타"]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">질문 수정</h1>
            <p className="text-xl text-foreground/70 mb-8">질문 내용을 수정해보세요</p>
          </div>
        </div>
      </section>

      {/* Question Form Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>질문 수정</CardTitle>
                <CardDescription>질문 내용을 수정해주세요.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 w-full" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">제목</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="질문 제목을 입력하세요"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">카테고리</Label>
                      <Select value={formData.category} onValueChange={handleCategoryChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">내용</Label>
                      <Textarea
                        id="content"
                        name="content"
                        placeholder="질문 내용을 자세히 입력하세요"
                        rows={8}
                        value={formData.content}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                        취소
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? "수정 중..." : "질문 수정하기"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
