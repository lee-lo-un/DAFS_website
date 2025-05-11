"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, supabaseAuthHelper } from "@/utils/supabase/client-enhanced"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EnhancedLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [sessionStatus, setSessionStatus] = useState<string>("확인 중...")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // 세션 상태 확인
  useEffect(() => {
    const checkSession = async () => {
      try {
        // 두 클라이언트로 모두 확인
        const standardClient = supabase
        const authHelperClient = supabaseAuthHelper

        if (!standardClient || !authHelperClient) {
          setSessionStatus("클라이언트 초기화 실패")
          return
        }

        // 표준 클라이언트로 세션 확인
        const { data: standardSession, error: standardError } = await standardClient.auth.getSession()

        // 인증 헬퍼 클라이언트로 세션 확인
        const { data: helperSession, error: helperError } = await authHelperClient.auth.getSession()

        // 디버그 정보 설정
        setDebugInfo({
          standardSession: standardSession?.session ? "있음" : "없음",
          helperSession: helperSession?.session ? "있음" : "없음",
          standardError: standardError?.message,
          helperError: helperError?.message,
          localStorage: typeof window !== "undefined" ? !!localStorage.getItem("sb-auth-token") : "SSR",
        })

        // 세션 상태 설정
        if (standardSession?.session || helperSession?.session) {
          setSessionStatus("로그인됨")
        } else {
          setSessionStatus("로그인되지 않음")
        }
      } catch (err) {
        console.error("세션 확인 오류:", err)
        setSessionStatus("확인 오류")
      }
    }

    checkSession()

    // 주기적으로 세션 상태 확인 (10초마다)
    const interval = setInterval(checkSession, 10000)
    return () => clearInterval(interval)
  }, [])

  // 로그인 처리 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (!supabase) {
      setError("Supabase 클라이언트를 초기화할 수 없습니다.")
      setLoading(false)
      return
    }

    try {
      console.log("로그인 시도:", { email, passwordLength: password.length })

      // 표준 클라이언트로 로그인 시도
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("로그인 오류:", error.message)
        setError(error.message)
        setLoading(false)
        return
      }

      if (data?.user) {
        console.log("로그인 성공:", data.user.email)
        setMessage("로그인 성공! 세션 설정 중...")

        // 세션 설정 확인
        const { data: sessionData } = await supabase.auth.getSession()
        console.log("세션 설정됨:", !!sessionData.session)

        // 로컬 스토리지 확인
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("sb-auth-token")
          console.log("로컬 스토리지 토큰:", !!token)
        }

        // 세션 설정 후 상태 업데이트
        setSessionStatus(sessionData.session ? "로그인됨" : "세션 없음")
        setMessage("로그인 성공! 리디렉션 중...")

        // 지연 후 리디렉션 (세션이 설정될 시간을 주기 위해)
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 2000)
      }
    } catch (err: any) {
      console.error("로그인 예외:", err.message)
      setError(err.message || "로그인 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  // 인증 헬퍼 클라이언트로 로그인
  const handleHelperLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (!supabaseAuthHelper) {
      setError("Supabase 인증 헬퍼 클라이언트를 초기화할 수 없습니다.")
      setLoading(false)
      return
    }

    try {
      console.log("인증 헬퍼로 로그인 시도:", { email, passwordLength: password.length })

      // 인증 헬퍼 클라이언트로 로그인
      const { data, error } = await supabaseAuthHelper.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("인증 헬퍼 로그인 오류:", error.message)
        setError(error.message)
        setLoading(false)
        return
      }

      if (data?.user) {
        console.log("인증 헬퍼 로그인 성공:", data.user.email)
        setMessage("로그인 성공! 세션 설정 중...")

        // 세션 설정 확인
        const { data: sessionData } = await supabaseAuthHelper.auth.getSession()
        console.log("인증 헬퍼 세션 설정됨:", !!sessionData.session)

        // 세션 설정 후 상태 업데이트
        setSessionStatus(sessionData.session ? "로그인됨" : "세션 없음")
        setMessage("로그인 성공! 리디렉션 중...")

        // 지연 후 리디렉션 (세션이 설정될 시간을 주기 위해)
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 2000)
      }
    } catch (err: any) {
      console.error("인증 헬퍼 로그인 예외:", err.message)
      setError(err.message || "로그인 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  // Google 로그인
  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    if (!supabase) {
      setError("Supabase 클라이언트를 초기화할 수 없습니다.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Google 로그인 오류:", error.message)
        setError(error.message)
        setLoading(false)
        return
      }

      if (data?.url) {
        console.log("Google 로그인 리디렉션:", data.url)
        window.location.href = data.url
      }
    } catch (err: any) {
      console.error("Google 로그인 예외:", err.message)
      setError(err.message || "Google 로그인 중 오류가 발생했습니다")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>향상된 로그인</CardTitle>
        <CardDescription>세션 상태: {sessionStatus}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standard">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">표준 클라이언트</TabsTrigger>
            <TabsTrigger value="helper">인증 헬퍼</TabsTrigger>
          </TabsList>

          <TabsContent value="standard">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
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
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 로그인 중...
                  </>
                ) : (
                  "표준 클라이언트로 로그인"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="helper">
            <form onSubmit={handleHelperLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="helper-email">이메일</Label>
                <Input
                  id="helper-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="helper-password">비밀번호</Label>
                <Input
                  id="helper-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 로그인 중...
                  </>
                ) : (
                  "인증 헬퍼로 로그인"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && <div className="p-3 mt-4 rounded-md bg-red-100 text-red-800 text-sm">{error}</div>}
        {message && <div className="p-3 mt-4 rounded-md bg-green-100 text-green-800 text-sm">{message}</div>}

        {debugInfo && (
          <div className="mt-4 p-3 rounded-md bg-gray-100 text-gray-800 text-xs">
            <p className="font-semibold">디버그 정보:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>표준 세션: {debugInfo.standardSession}</li>
              <li>헬퍼 세션: {debugInfo.helperSession}</li>
              <li>로컬 스토리지: {debugInfo.localStorage}</li>
              {debugInfo.standardError && <li>표준 오류: {debugInfo.standardError}</li>}
              {debugInfo.helperError && <li>헬퍼 오류: {debugInfo.helperError}</li>}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
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
          Google로 로그인
        </Button>
      </CardFooter>
    </Card>
  )
}
