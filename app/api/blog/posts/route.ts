import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// 캐싱 전략 설정: 5분마다 재검증
export const revalidate = 300

export async function GET(request: Request) {
  try {
    // URL 파싱 방식 변경
    const url = new URL(request.url)
    const category = url.searchParams.get("category") || ""
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const perPage = Number.parseInt(url.searchParams.get("per_page") || "6")

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

    // 선택된 카테고리 정보 가져오기
    let selectedCategory = null
    let categoryId = null

    if (category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", category)
        .single()

      selectedCategory = categoryData
      categoryId = categoryData?.id
    }

    // 게시물 총 개수 먼저 조회
    let countQuery = supabase.from("blog_posts").select("id", { count: "exact" })
    if (categoryId) {
      countQuery = countQuery.eq("category_id", categoryId)
    }
    const { count, error: countError } = await countQuery

    if (countError) {
      console.error("Error counting posts:", countError)
      return NextResponse.json({ error: "게시물 수를 계산하는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 게시물 쿼리 구성
    let query = supabase.from("blog_posts").select("*, categories(*)")

    // 카테고리 필터 적용
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    // 페이지네이션 및 정렬 적용
    const { data: posts, error } = await query
      .order("published_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1)

    if (error) {
      console.error("Error fetching posts:", error)
      return NextResponse.json({ error: "게시물을 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 각 게시물에 카테고리 정보 추가
    const postsWithCategories = posts.map((post) => {
      if (!post.category_id) {
        return { ...post, category: { name: "일반", slug: "general" } }
      }

      if (post.categories) {
        return { ...post, category: post.categories }
      }

      return post
    })

    const totalPages = count ? Math.ceil(count / perPage) : 0

    return NextResponse.json({
      posts: postsWithCategories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        perPage,
      },
      category: selectedCategory,
    })
  } catch (error) {
    console.error("Unexpected error in posts API:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
