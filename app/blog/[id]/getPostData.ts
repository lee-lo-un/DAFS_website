import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// 포스트 데이터 가져오기 함수 - 캐싱 제거
export async function getPostData(id: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      },
    )

    console.log(`블로그 상세: ID ${id}의 포스트 데이터 가져오기 시작`)

    const { data: post, error } = await supabase.from("blog_posts").select("*, categories(*)").eq("id", id).single()

    if (error) {
      console.error(`블로그 상세: 포스트 조회 오류 - ${error.message}`)
      return null
    }

    console.log(`블로그 상세: ID ${id}의 포스트 데이터 가져오기 성공`)
    return post
  } catch (error) {
    console.error("블로그 상세: 예상치 못한 오류 발생", error)
    return null
  }
}
