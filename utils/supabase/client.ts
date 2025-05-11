"use client"

import { createClient } from "@supabase/supabase-js"

let supabaseClient: ReturnType<typeof createClient> | null = null
let initializationError: Error | null = null
let isInitializing = false

export function createSupabaseClient() {
  // 이미 초기화된 클라이언트가 있으면 반환
  if (supabaseClient) {
    return supabaseClient
  }

  // 초기화 중이면 null 반환
  if (isInitializing) {
    console.log("Supabase 클라이언트 초기화 중...")
    return null
  }

  // 초기화 오류가 있으면 null 반환
  if (initializationError) {
    console.error("Supabase 클라이언트 초기화 오류:", initializationError.message)
    return null
  }

  // 환경 변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase 환경 변수가 설정되지 않았습니다:", {
      url: supabaseUrl ? "설정됨" : "설정되지 않음",
      key: supabaseAnonKey ? "설정됨" : "설정되지 않음",
    })

    initializationError = new Error("Supabase 환경 변수가 설정되지 않았습니다")
    return null
  }

  try {
    isInitializing = true
    console.log("Supabase 클라이언트 초기화 시작...", {
      url: supabaseUrl.substring(0, 10) + "...",
      keyLength: supabaseAnonKey.length,
    })

    // 클라이언트 생성
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "sb-auth-token",
      },
    })

    console.log("Supabase 클라이언트 초기화 성공")
    isInitializing = false
    return supabaseClient
  } catch (error) {
    console.error("Supabase 클라이언트 초기화 중 오류:", error)
    initializationError = error instanceof Error ? error : new Error("알 수 없는 오류")
    isInitializing = false
    return null
  }
}

// 클라이언트 초기화 상태 확인 함수
export function getSupabaseInitializationStatus() {
  return {
    isInitialized: !!supabaseClient,
    isInitializing,
    error: initializationError?.message,
    clientInfo: supabaseClient
      ? {
          authUrl: supabaseClient.auth.url,
          hasSession: !!supabaseClient.auth.session,
        }
      : null,
  }
}

// 클라이언트 재설정 함수 (테스트용)
export function resetSupabaseClient() {
  supabaseClient = null
  initializationError = null
  isInitializing = false
}

// 사용자가 관리자인지 확인하는 헬퍼 함수
export async function checkIsAdmin() {
  const supabase = createSupabaseClient()
  if (!supabase) return false

  // 타임아웃 프로미스 생성
  const timeoutPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log("Admin check timed out")
      resolve(false)
    }, 5000) // 5초 타임아웃
  })

  try {
    // 세션 확인 프로미스
    const checkPromise = (async () => {
      try {
        // 세션 확인
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
          console.log("세션 없음 또는 오류:", error?.message)
          return false
        }

        console.log("세션 확인됨:", data.session.user.id)

        // 관리자 권한 확인
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.session.user.id)
          .single()

        if (profileError) {
          console.error("프로필 조회 오류:", profileError.message)
          return false
        }

        console.log("프로필 조회 결과:", profile)
        return !!profile?.is_admin
      } catch (error) {
        console.error("관리자 권한 확인 오류:", error)
        return false
      }
    })()

    // 두 프로미스 중 먼저 완료되는 것 반환
    return await Promise.race([checkPromise, timeoutPromise])
  } catch (error) {
    console.error("관리자 권한 확인 중 예외 발생:", error)
    return false
  }
}

// 세션 상태 확인 함수 추가
export async function checkSessionStatus() {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return { hasSession: false, error: "Supabase 클라이언트 초기화 실패" }
  }

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return { hasSession: false, error: error.message }
    }

    return {
      hasSession: !!data.session,
      user: data.session?.user,
      expiresAt: data.session?.expires_at,
    }
  } catch (error: any) {
    return { hasSession: false, error: error?.message || "알 수 없는 오류" }
  }
}
