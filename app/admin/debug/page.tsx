"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { createSupabaseClient, checkSessionStatus, getSupabaseInitializationStatus } from "@/utils/supabase/client"

export default function AdminDebugPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Supabase 초기화 상태 확인
      const initStatus = getSupabaseInitializationStatus()

      // 세션 상태 확인
      const sessionStatus = await checkSessionStatus()

      // Supabase 클라이언트 생성
      const supabase = createSupabaseClient()

      // 프로필 정보 확인 (세션이 있는 경우)
      let profileInfo = null
      let adminStatus = null

      if (sessionStatus.hasSession && sessionStatus.user && supabase) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", sessionStatus.user.id)
            .single()

          profileInfo = { data: profile, error: profileError?.message }

          // 관리자 권한 확인
          adminStatus = profile?.is_admin === true
        } catch (profileErr: any) {
          profileInfo = { error: profileErr?.message || "프로필 조회 중 오류 발생" }
        }
      }

      // 환경 변수 확인 (값은 표시하지 않고 존재 여부만 확인)
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }

      // 디버그 정보 설정
      setDebugInfo({
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        supabaseInit: initStatus,
        session: sessionStatus,
        profile: profileInfo,
        isAdmin: adminStatus,
        envVars,
        userAgent: navigator.userAgent,
      })
    } catch (err: any) {
      setError(err?.message || "디버그 정보 수집 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>관리자 디버그 페이지</CardTitle>
          <CardDescription>Supabase 연결 및 인증 상태를 확인합니다</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>디버그 정보를 수집하는 중...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              <p className="font-medium">오류 발생</p>
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchDebugInfo}>
                <RefreshCw className="h-4 w-4 mr-2" />
                다시 시도
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={fetchDebugInfo} className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  새로고침
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[600px]">
                <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">빠른 진단</h3>

                <div className="grid gap-4">
                  <StatusItem
                    label="Supabase 초기화"
                    status={debugInfo.supabaseInit?.isInitialized}
                    message={debugInfo.supabaseInit?.error}
                  />

                  <StatusItem
                    label="세션 상태"
                    status={debugInfo.session?.hasSession}
                    message={debugInfo.session?.error}
                  />

                  <StatusItem
                    label="관리자 권한"
                    status={debugInfo.isAdmin}
                    message={!debugInfo.isAdmin ? "관리자 권한이 없습니다" : undefined}
                  />

                  <StatusItem
                    label="환경 변수"
                    status={
                      debugInfo.envVars?.NEXT_PUBLIC_SUPABASE_URL && debugInfo.envVars?.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    }
                    message={
                      !debugInfo.envVars?.NEXT_PUBLIC_SUPABASE_URL || !debugInfo.envVars?.NEXT_PUBLIC_SUPABASE_ANON_KEY
                        ? "Supabase 환경 변수가 누락되었습니다"
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusItem({ label, status, message }: { label: string; status: boolean; message?: string }) {
  return (
    <div className="flex items-start">
      <div className={`w-3 h-3 rounded-full mt-1.5 mr-2 ${status ? "bg-green-500" : "bg-red-500"}`} />
      <div>
        <div className="font-medium">
          {label}: {status ? "정상" : "문제 있음"}
        </div>
        {message && <div className="text-sm text-gray-600">{message}</div>}
      </div>
    </div>
  )
}
