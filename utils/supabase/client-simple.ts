"use client"

import { createClient } from "@supabase/supabase-js"

// 환경 변수 직접 접근
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경 변수 확인 및 로깅
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase 환경 변수가 설정되지 않았습니다:", {
    url: supabaseUrl ? "설정됨" : "설정되지 않음",
    key: supabaseAnonKey ? "설정됨" : "설정되지 않음",
  })
}

// 단순화된 클라이언트 생성
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null
