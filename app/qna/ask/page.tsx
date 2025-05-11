"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AskQuestionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  })
  const supabase = createSupabaseClient()

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
          description: "질문을 작성하려면 먼저 로그인해주세요.",
          variant: "destructive",
        })
        router.push("/login?redirect=/qna/ask")
        return
      }

      const { data, error } = await supabase
        .from("questions")
        .insert({
          user_id: user.id,
          title: formData.title,
          category: formData.category,
          content: formData.content,
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "질문이 등록되었습니다",
        description: "성공적으로 질문이 등록되었습니다.",
      })

      // 등록된 질문 ID
      const questionId = data[0].id

      // 질문 상세 페이지로 이동
      router.push(`/qna/${questionId}`)
    } catch (error) {
      console.error("Error submitting question:", error)
      toast({
        title: "질문 등록 실패",
        description: "질문을 등록하는 중 오류가 발생했습니다.",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">질문하기</h1>
            <p className="text-xl text-foreground/70 mb-8">풍수에 관한 궁금한 점을 질문해보세요</p>
          </div>
        </div>
      </section>

      {/* Question Form Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>질문 작성</CardTitle>
                <CardDescription>풍수에 관한 궁금한 점을 자유롭게 질문해주세요.</CardDescription>
              </CardHeader>
              <CardContent>
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

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "등록 중..." : "질문 등록하기"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
