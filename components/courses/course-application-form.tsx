"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface CourseApplicationFormProps {
  courseId: number
  isAvailable: boolean
}

export default function CourseApplicationForm({ courseId, isAvailable }: CourseApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    memo: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsLoggedIn(true)

        // 사용자 프로필 정보 가져오기
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          setUserData(profile)
          setFormData({
            fullName: profile.full_name || "",
            phone: profile.phone || "",
            email: session.user.email || "",
            memo: "",
          })
        }
      } else {
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedIn) {
      toast({
        title: "로그인이 필요합니다",
        description: "교육 신청을 위해 로그인해주세요.",
        variant: "destructive",
      })
      router.push("/login?redirect=/courses/" + courseId)
      return
    }

    if (!isAvailable) {
      toast({
        title: "신청 불가",
        description: "이 교육은 현재 신청이 불가능합니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("사용자 정보를 가져올 수 없습니다.")
      }

      // 신청 정보 저장
      const { data, error } = await supabase
        .from("course_applications")
        .insert({
          course_id: courseId,
          user_id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email || user.email,
          memo: formData.memo,
          status: "pending",
        })
        .select()

      if (error) {
        if (error.code === "23505") {
          throw new Error("이미 신청한 교육입니다.")
        }
        throw new Error(error.message)
      }

      // 현재 신청자 수 업데이트
      await supabase.rpc("increment_course_attendees", { course_id: courseId })

      toast({
        title: "신청 완료",
        description: "교육 신청이 완료되었습니다. 승인 결과는 이메일로 안내됩니다.",
      })

      // 페이지 새로고침
      router.refresh()
    } catch (error: any) {
      toast({
        title: "신청 실패",
        description: error.message || "교육 신청 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 로딩 중일 때
  if (isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">교육 신청</h3>

      {!isLoggedIn ? (
        <div className="text-center py-4">
          <p className="mb-4">교육 신청을 위해 로그인이 필요합니다.</p>
          <Button
            onClick={() => router.push(`/login?redirect=/courses/${courseId}`)}
            className="bg-amber-500 hover:bg-amber-600"
          >
            로그인하기
          </Button>
        </div>
      ) : !isAvailable ? (
        <div className="text-center py-4 text-red-500">
          <p>현재 신청이 불가능한 교육입니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              연락처 <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일은 선택사항입니다"
            />
          </div>

          <div>
            <label htmlFor="memo" className="block text-sm font-medium mb-1">
              메모
            </label>
            <Textarea
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              placeholder="문의사항이나 요청사항이 있으면 입력해주세요"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                신청 중...
              </>
            ) : (
              "신청하기"
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
