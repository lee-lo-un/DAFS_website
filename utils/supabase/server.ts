import { createServerClient as createServerClientOriginal } from "@supabase/ssr"
import { cookies } from "next/headers"

// 원래 함수를 재export하여 다른 파일에서 사용할 수 있게 합니다
export { createServerClientOriginal as createServerClient }

// 환경 변수 확인 함수를 수정합니다
const getSupabaseEnvVars = () => {
  // 환경 변수 사용
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL or Anon Key is missing", {
      url: !!supabaseUrl ? "설정됨" : "설정안됨",
      key: !!supabaseKey ? "설정됨" : "설정안됨",
    })
    throw new Error("Supabase URL과 Anon Key가 설정되지 않았습니다.")
  }

  return { supabaseUrl, supabaseKey }
}

// 더미 클라이언트 - 모든 필요한 메서드 구현
function createDummyClient() {
  const dummyResponse = { data: [], error: null }

  // 체이닝 메서드를 위한 헬퍼 함수
  const createChainableMethod = () => {
    const methods = {
      select: () => methods,
      insert: () => methods,
      update: () => methods,
      delete: () => methods,
      eq: () => methods,
      neq: () => methods,
      gt: () => methods,
      lt: () => methods,
      gte: () => methods,
      lte: () => methods,
      like: () => methods,
      ilike: () => methods,
      is: () => methods,
      in: () => methods,
      contains: () => methods,
      containedBy: () => methods,
      rangeGt: () => methods,
      rangeLt: () => methods,
      rangeGte: () => methods,
      rangeLte: () => methods,
      textSearch: () => methods,
      not: () => methods,
      filter: () => methods,
      or: () => methods,
      and: () => methods,
      order: () => methods,
      limit: () => methods,
      range: () => methods,
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve(callback(dummyResponse)),
    }
    return methods
  }

  return {
    from: () => createChainableMethod(),
    rpc: () => Promise.resolve({ data: null, error: null }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: () => Promise.resolve({ data: null, error: null }),
      }),
    },
  }
}

// 서버 클라이언트 생성 함수 구현
const createSupabaseClientImpl = async () => {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase 환경 변수가 설정되지 않았습니다:", {
        url: supabaseUrl ? "설정됨" : "설정되지 않음",
        key: supabaseKey ? "설정됨" : "설정되지 않음",
      })
      return createDummyClient()
    }

    try {
      const cookieStore = await cookies();

      return createServerClientOriginal(supabaseUrl, supabaseKey, {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      });
    } catch (cookieError) {
      // cookies() 함수 호출 시 오류가 발생하면 정적 생성 중일 가능성이 높음
      console.warn("Cookie access error, likely during static generation:", cookieError)
      return createDummyClient()
    }
  } catch (error) {
    console.error("Error creating Supabase server client:", error)
    // 오류 발생 시 더미 클라이언트 반환
    console.warn("Returning dummy Supabase client")
    return createDummyClient()
  }
}

// 두 함수 모두 동일한 구현을 사용하도록 export
export const createSupabaseServer = createSupabaseClientImpl
export const createSupabaseServerClient = createSupabaseClientImpl

// 연결 테스트 함수 추가
export async function testSupabaseConnection() {
  try {
    const supabase = createSupabaseClientImpl()

    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase.from("categories").select("count(*)", { count: "exact", head: true })

    if (error) {
      console.error("Supabase 연결 테스트 실패:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Supabase 연결 테스트 중 예외 발생:", error)
    return { success: false, error: error.message }
  }
}
