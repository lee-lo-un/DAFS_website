"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface AnswerFormProps {
  questionId: string
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "오류",
        description: "답변 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 현재 로그인한 사용자 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "오류",
          description: "로그인이 필요합니다.",
          variant: "destructive",
        })
        return
      }

      // 답변 저장
      const { error } = await supabase.from("answers").insert({
        question_id: questionId,
        admin_id: user.id,
        content,
      })

      if (error) {
        throw error
      }

      toast({
        title: "성공",
        description: "답변이 등록되었습니다.",
      })

      // 폼 초기화 및 페이지 새로고침
      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Error submitting answer:", error)
      toast({
        title: "오류",
        description: "답변 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="답변을 작성해주세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="resize-none"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "등록 중..." : "답변 등록"}
      </Button>
    </form>
  )
}
