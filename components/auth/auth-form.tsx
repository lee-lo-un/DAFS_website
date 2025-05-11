"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function AuthForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMounted = useRef(true)

  // 컴포넌트 마운트 시 Supabase 환경 변수 확인
  useEffect(() => {
    console.log("환경 변수 확인:", {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "설정됨" : "설정되지 않음",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "설정됨" : "설정되지 않음",
    })

    return () => {
      isMounted.current = false
    }
  }, [])

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("로그인 함수 시작")

    // 이전 타임아웃이 있으면 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Supabase 클라이언트 생성 전 로그
    console.log("Supabase 클라이언트 생성 시도...")
    const supabase = createSupabaseClient()
    console.log("Supabase 클라이언트 생성 결과:", supabase ? "성공" : "실패")

    if (!supabase) {
      console.error("Supabase 클라이언트 생성 실패")
      toast({
        title: "오류",
        description: "인증 서비스에 연결할 수 없습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setLoginError("")

    // 15초 타임아웃 설정 (더 길게 설정)
    timeoutRef.current = setTimeout(() => {
      if (isLoading && isMounted.current) {
        console.log("로그인 요청 타임아웃 발생")
        setIsLoading(false)
        setLoginError("로그인 요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.")
        toast({
          title: "로그인 실패",
          description: "요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.",
          variant: "destructive",
        })
      }
    }, 15000)

    try {
      console.log("Supabase 인증 API 호출 시도...")
      console.log("로그인 정보:", { email, passwordLength: password.length })

      // 로그인 시도
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // 타임아웃 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (error) {
        console.error("로그인 오류:", error.message, error)
        throw error
      }

      if (data.user) {
        console.log("로그인 성공:", data.user.email)
        toast({
          title: "로그인 성공",
          description: "성공적으로 로그인되었습니다.",
        })
        setIsLoading(false)
        // 로그인 성공 시 즉시 리디렉션 (언마운트 여부와 무관하게 실행)
        window.location.href = "/"
        return;
      } else {
        console.error("사용자 데이터 없음:", data)
        throw new Error("로그인 중 알 수 없는 오류가 발생했습니다.")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      // 컴포넌트가 언마운트되었는지 확인
      if (!isMounted.current) return

      // 타임아웃 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // 로딩 상태 명확하게 해제
      setIsLoading(false)

      // 사용자 친화적인 오류 메시지 설정
      if (error.message === "Invalid login credentials") {
        setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.")
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        setLoginError("네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.")
      } else {
        setLoginError(error.message || "로그인 중 오류가 발생했습니다.")
      }

      toast({
        title: "로그인 실패",
        description:
          error.message === "Invalid login credentials"
            ? "이메일 또는 비밀번호가 올바르지 않습니다."
            : error.message || "로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 나머지 코드는 그대로 유지...
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = createSupabaseClient()
    if (!supabase) {
      toast({
        title: "오류",
        description: "인증 서비스에 연결할 수 없습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // 15초 타임아웃 설정
    timeoutRef.current = setTimeout(() => {
      if (isLoading && isMounted.current) {
        setIsLoading(false)
        toast({
          title: "회원가입 실패",
          description: "요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.",
          variant: "destructive",
        })
      }
    }, 15000)

    try {
      console.log("회원가입 시도 중...")

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      // 컴포넌트가 언마운트되었는지 확인
      if (!isMounted.current) return

      console.log("회원가입 응답:", { success: !error, errorMessage: error?.message })

      // 타임아웃 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (error) {
        throw error
      }

      toast({
        title: "회원가입 성공",
        description: "이메일 확인을 위한 링크가 발송되었습니다. 이메일을 확인해주세요.",
      })

      setIsLoading(false)
    } catch (error: any) {
      console.error("Signup error:", error)

      // 컴포넌트가 언마운트되었는지 확인
      if (!isMounted.current) return

      // 타임아웃 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    const supabase = createSupabaseClient()
    if (!supabase) {
      toast({
        title: "오류",
        description: "인증 서비스에 연결할 수 없습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // 15초 타임아웃 설정
    timeoutRef.current = setTimeout(() => {
      if (isLoading && isMounted.current) {
        setIsLoading(false)
        toast({
          title: "소셜 로그인 실패",
          description: "요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.",
          variant: "destructive",
        })
      }
    }, 15000)

    try {
      console.log(`${provider} 로그인 시도 중...`)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      // 컴포넌트가 언마운트되었는지 확인
      if (!isMounted.current) return

      console.log(`${provider} 로그인 응답:`, { success: !error, url: data?.url })

      // 타임아웃 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (error) {
        console.error(`${provider} 로그인 오류:`, error.message)
        throw error
      }

      // OAuth 리디렉션이 자동으로 처리됨
      console.log(`${provider} 로그인 리디렉션 URL:`, data?.url || "URL 없음")

      // 리디렉션 URL이 있으면 직접 이동
      if (data?.url) {
        window.location.href = data.url
      } else {
        setIsLoading(false)
        toast({
          title: "소셜 로그인 오류",
          description: "리디렉션 URL을 받지 못했습니다. 다시 시도해 주세요.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Social login error:", error)

      // 컴포넌트가 언마운트되었는지 확인
      if (!isMounted.current) return

      // 타임아웃 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      setIsLoading(false)
      toast({
        title: "소셜 로그인 실패",
        description: error.message || "소셜 로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">로그인</TabsTrigger>
        <TabsTrigger value="register">회원가입</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <form onSubmit={handleSignIn}>
            <CardHeader>
              <CardTitle>로그인</CardTitle>
              <CardDescription>이메일과 비밀번호를 입력하여 로그인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setLoginError("")
                  }}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setLoginError("")
                  }}
                  required
                  disabled={isLoading}
                />
              </div>
              {loginError && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  <p>{loginError}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">또는</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("kakao")}
                  disabled={isLoading}
                  className="bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 border-[#FEE500]"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2.5C6.201 2.5 1.5 6.253 1.5 10.893C1.5 13.81 3.411 16.37 6.252 17.863L5.106 21.196C5.021 21.455 5.311 21.663 5.537 21.515L9.639 18.86C10.399 18.99 11.19 19.06 12 19.06C17.799 19.06 22.5 15.307 22.5 10.667C22.5 6.253 17.799 2.5 12 2.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  Kakao
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <form onSubmit={handleSignUp}>
            <CardHeader>
              <CardTitle>회원가입</CardTitle>
              <CardDescription>새 계정을 만들어 서비스를 이용하세요.</CardDescription>
            </CardHeader>
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
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 가입 중...
                  </>
                ) : (
                  "회원가입"
                )}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">또는</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("kakao")}
                  disabled={isLoading}
                  className="bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 border-[#FEE500]"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2.5C6.201 2.5 1.5 6.253 1.5 10.893C1.5 13.81 3.411 16.37 6.252 17.863L5.106 21.196C5.021 21.455 5.311 21.663 5.537 21.515L9.639 18.86C10.399 18.99 11.19 19.06 12 19.06C17.799 19.06 22.5 15.307 22.5 10.667C22.5 6.253 17.799 2.5 12 2.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  Kakao
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
