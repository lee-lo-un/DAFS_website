"use client"

import type React from "react"

import { useState } from "react"
import { createSupabaseClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function TestEmailPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      // 비밀번호 재설정 이메일 전송 테스트
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })

      if (error) {
        throw error
      }

      setResult("이메일이 성공적으로 전송되었습니다. 받은 편지함을 확인해주세요.")
      toast({
        title: "이메일 전송 성공",
        description: "비밀번호 재설정 이메일이 전송되었습니다.",
      })
    } catch (error: any) {
      setResult(`오류 발생: ${error.message}`)
      toast({
        title: "이메일 전송 실패",
        description: error.message || "이메일 전송 중 오류가 발생했습니다.",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">이메일 테스트</h1>
            <p className="text-xl text-foreground/70 mb-8">Supabase 이메일 설정을 테스트합니다</p>
          </div>
        </div>
      </section>

      {/* Test Email Form Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>이메일 전송 테스트</CardTitle>
                <CardDescription>
                  이메일 주소를 입력하여 Supabase 이메일 설정이 올바르게 작동하는지 테스트하세요.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleTestEmail}>
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
                  {result && (
                    <div
                      className={`p-4 rounded-md ${result.includes("오류") ? "bg-destructive/10" : "bg-primary/10"}`}
                    >
                      <p>{result}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "전송 중..." : "테스트 이메일 전송"}
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
