"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client-enhanced"

export default function LoginRedirect() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkCount, setCheckCount] = useState(0)

  useEffect(() => {
    setIsClient(true)
    
    const checkClientSession = async () => {
      try {
        // 이미 세 번 이상 확인했으면 더 이상 확인하지 않음
        if (checkCount >= 3) {
          setIsLoading(false)
          return
        }
        
        setCheckCount(prev => prev + 1)
        setIsLoading(true)
        
        // 클라이언트 측에서 세션 확인
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("클라이언트 세션 확인 오류:", error)
          setError(error.message)
          setIsLoggedIn(false)
        } else if (data?.session) {
          console.log("클라이언트 세션 있음:", data.session.user.email)
          setIsLoggedIn(true)
          
          // 세션이 있으면 프로필 페이지로 직접 이동 (새로고침 대신)
          setTimeout(() => {
            // 직접 URL로 이동
            window.location.href = '/profile'
          }, 1000)
        } else {
          console.log("클라이언트 세션 없음")
          setIsLoggedIn(false)
        }
      } catch (err) {
        console.error("세션 확인 중 오류:", err)
        setError(err instanceof Error ? err.message : "알 수 없는 오류")
      } finally {
        setIsLoading(false)
      }
    }
    
    checkClientSession()
  }, [])
  
  // 서버 사이드 렌더링 중에는 아무것도 표시하지 않음
  if (!isClient) return null
  
  return (
    <div className="container mx-auto py-24 px-4 md:px-8 text-center">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
        {isLoading ? (
          <div className="py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">세션 확인 중...</p>
          </div>
        ) : isLoggedIn ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-700">로그인 확인됨</h2>
            <p className="mb-6 text-gray-700">잠시 후 프로필 페이지로 이동합니다...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-yellow-700">로그인이 필요합니다</h2>
            <p className="mb-6 text-gray-700">프로필 정보를 보려면 먼저 로그인해주세요.</p>
            {error && (
              <div className="p-3 mb-4 rounded-md bg-red-100 text-red-800 text-sm">
                {error}
              </div>
            )}
            <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors">
              로그인하기
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
