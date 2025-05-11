"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createSupabaseClient } from "@/utils/supabase/client"

interface EditReviewFormProps {
  review: {
    id: string
    rating: number
    content: string
    product_id: string
  }
  onSuccess: () => void
}

export default function EditReviewForm({ review, onSuccess }: EditReviewFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(review.rating.toString())
  const [content, setContent] = useState(review.content)
  const supabase = createSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 현재 사용자 확인
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "후기를 수정하려면 먼저 로그인해주세요.",
          variant: "destructive",
        })
        return
      }

      // 후기 정보 가져오기
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .select("user_id, created_at")
        .eq("id", review.id)
        .single()

      if (reviewError || !reviewData) {
        throw new Error("후기를 찾을 수 없습니다.")
      }

      // 작성자 확인
      if (reviewData.user_id !== user.id) {
        throw new Error("자신이 작성한 후기만 수정할 수 있습니다.")
      }

      // 24시간 이내 확인
      const createdAt = new Date(reviewData.created_at)
      const now = new Date()
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

      if (hoursDiff > 24) {
        throw new Error("후기는 작성 후 24시간 이내에만 수정 가능합니다.")
      }

      // 후기 수정
      const { error: updateError } = await supabase
        .from("reviews")
        .update({
          rating: Number.parseInt(rating),
          content,
        })
        .eq("id", review.id)

      if (updateError) {
        throw updateError
      }

      toast({
        title: "후기 수정 성공",
        description: "후기가 성공적으로 수정되었습니다.",
      })

      onSuccess()
    } catch (error: any) {
      toast({
        title: "후기 수정 실패",
        description: error.message || "후기를 수정하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>평점</Label>
        <RadioGroup value={rating} onValueChange={setRating} className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="flex items-center space-x-1">
              <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
              <Label htmlFor={`rating-${value}`}>{value}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">후기 내용</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px]"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </form>
  )
}
