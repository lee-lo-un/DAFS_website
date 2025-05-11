"use client"

import { createClient } from "@supabase/supabase-js"
import { type CookieOptions, createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase 환경 변수가 설정되지 않았습니다:", {
    url: supabaseUrl ? "설정됨" : "설정되지 않음",
    key: supabaseAnonKey ? "설정됨" : "설정되지 않음",
  })
}

// 쿠키 옵션 설정
const cookieOptions: CookieOptions = {
  name: "sb-auth",
  lifetime: 60 * 60 * 24 * 7, // 7일
  domain: "",
  path: "/",
  sameSite: "lax",
}

// 향상된 클라이언트 생성 함수
export function createEnhancedClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase 환경 변수가 없어 클라이언트를 생성할 수 없습니다.")
    return null
  }

  try {
    // 기본 클라이언트 생성
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "sb-auth-token",
        storage: {
          getItem: (key) => {
            if (typeof window === "undefined") return null
            return window.localStorage.getItem(key)
          },
          setItem: (key, value) => {
            if (typeof window === "undefined") return
            window.localStorage.setItem(key, value)
          },
          removeItem: (key) => {
            if (typeof window === "undefined") return
            window.localStorage.removeItem(key)
          },
        },
      },
      global: {
        headers: {
          "X-Client-Info": "supabase-js-v2",
        },
      },
    })

    // 클라이언트 생성 성공 로그
    console.log("Supabase 클라이언트 생성 성공")

    return client
  } catch (error) {
    console.error("Supabase 클라이언트 생성 오류:", error)
    return null
  }
}

// 기본 클라이언트 인스턴스 생성
export const supabase = createEnhancedClient()

// Next.js 인증 헬퍼 클라이언트 (쿠키 기반)
export const supabaseAuthHelper = createClientComponentClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    cookies: cookieOptions,
  },
})
