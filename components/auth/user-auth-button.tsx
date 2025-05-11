"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn, LogOut, User } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createSupabaseClient } from "@/utils/supabase/client"

const UserAuthButton = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authChangeDetected, setAuthChangeDetected] = useState(false)
  const router = useRouter()
  const isMounted = useRef(true)

  // 사용자 정보 가져오기 함수
  const fetchUserInfo = async () => {
    if (!isMounted.current) return

    // 타임아웃 설정
    const timeoutId = setTimeout(() => {
      if (isMounted.current) {
        console.log("사용자 정보 가져오기 타임아웃")
        setLoading(false)
      }
    }, 8000) // 8초 타임아웃

    try {
      const supabase = createSupabaseClient()
      if (!supabase) {
        console.error("Supabase 클라이언트 초기화 실패")
        if (isMounted.current) {
          setLoading(false)
        }
        clearTimeout(timeoutId)
        return
      }

      // 세션 확인
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("세션 확인 오류:", sessionError.message)
        if (isMounted.current) {
          setUser(null)
          setLoading(false)
        }
        clearTimeout(timeoutId)
        return
      }

      // 세션이 없으면 로그인되지 않은 상태
      if (!sessionData?.session) {
        console.log("세션 없음 - 로그인되지 않음")
        if (isMounted.current) {
          setUser(null)
          setLoading(false)
        }
        clearTimeout(timeoutId)
        return
      }

      // 사용자 정보 가져오기
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("사용자 정보 가져오기 오류:", userError.message)
        if (isMounted.current) {
          setUser(null)
          setLoading(false)
        }
        clearTimeout(timeoutId)
        return
      }

      if (isMounted.current) {
        setUser(userData.user)
        setLoading(false)
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 중 오류:", error)
      if (isMounted.current) {
        setUser(null)
        setLoading(false)
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    isMounted.current = true
    fetchUserInfo()

    // 인증 상태 변경 리스너 설정
    const setupAuthListener = async () => {
      const supabase = createSupabaseClient()
      if (!supabase) return

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth 상태 변경:", event)
        setAuthChangeDetected(true)

        // 상태 변경 시 사용자 정보 다시 가져오기
        if (isMounted.current) {
          if (event === "SIGNED_IN" && session) {
            setUser(session.user)
            setLoading(false)
          } else if (event === "SIGNED_OUT") {
            setUser(null)
            setLoading(false)
          } else {
            // 다른 이벤트의 경우 사용자 정보 다시 가져오기
            fetchUserInfo()
          }
        }
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }

    const authSubscription = setupAuthListener()

    return () => {
      isMounted.current = false
      // 구독 해제
      authSubscription.then((unsubscribe) => unsubscribe && unsubscribe())
    }
  }, [])

  // 로그아웃 처리
  const handleLogout = async () => {
    setLoading(true)

    try {
      const supabase = createSupabaseClient()
      if (!supabase) {
        console.error("Supabase 클라이언트 초기화 실패")
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("로그아웃 오류:", error.message)
        setLoading(false)
        return
      }

      // 로그아웃 후 상태 업데이트
      setUser(null)

      // 홈페이지로 리디렉션
      console.log("홈페이지로 리디렉션...")

      // 약간의 지연 후 리디렉션
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("로그아웃 중 오류:", error)
      setLoading(false)
    }
  }

  // 로딩 중이면 로딩 표시
  if (loading && !authChangeDetected) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    )
  }

  // 로그인되지 않았으면 로그인 버튼 표시
  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm" className="gap-2">
          <LogIn className="h-4 w-4" />
          로그인
        </Button>
      </Link>
    )
  }

  // 로그인된 경우 사용자 메뉴 표시
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          {user.email ? user.email.split("@")[0] : "사용자"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>내 계정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">프로필</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/password">비밀번호 변경</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAuthButton
