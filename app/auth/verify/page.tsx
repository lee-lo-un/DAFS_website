"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function VerifyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createSupabaseClient()

  // 현재 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push("/")
      }
    }

    checkAuth()
  }, [router, supabase.auth])

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) {
        throw error
      }

      toast({
        title: "이메일 재전송 성공",
        description: "인증 이메일이 재전송되었습니다. 이메일을 확인해주세요.",
      })
    } catch (error: any) {
      toast({
        title: "이메일 재전송 실패",
        description: error.message || "이메일 재전송 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">이메일 인증</h1>
            <p className="text-xl text-foreground/70 mb-8">이메일 인증을 완료하여 계정 설정을 마무리하세요</p>
          </div>
        </div>
      </section>

      {/* Verify Form Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>이메일 인증</CardTitle>
                <CardDescription>
                  인증 이메일을 받지 못하셨나요? 아래에서 이메일을 입력하여 인증 이메일을 다시 받으세요.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleResendEmail}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "처리 중..." : "인증 이메일 재전송"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
