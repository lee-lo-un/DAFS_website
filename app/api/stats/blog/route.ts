import { createSupabaseServer } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createSupabaseServer()

    // 전체 블로그 포스트 수 조회
    const { count: totalPosts, error: countError } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error fetching blog post count:", countError)
      return NextResponse.json({ error: "블로그 포스트 수를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 카테고리별 포스트 수 조회
    const { data: categoryData, error: categoryError } = await supabase.from("blog_posts").select("category")

    if (categoryError) {
      console.error("Error fetching blog categories:", categoryError)
      return NextResponse.json({ error: "블로그 카테고리를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 카테고리별 포스트 수 계산
    const categoryCounts: Record<string, number> = {}
    categoryData.forEach((post) => {
      const category = post.category || "uncategorized"
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    // 최근 블로그 포스트 5개 조회
    const { data: recentPosts, error: recentError } = await supabase
      .from("blog_posts")
      .select("id, title, published_at, category")
      .order("published_at", { ascending: false })
      .limit(5)

    if (recentError) {
      console.error("Error fetching recent blog posts:", recentError)
      return NextResponse.json({ error: "최근 블로그 포스트를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      totalPosts,
      categoryCounts,
      recentPosts,
    })
  } catch (error) {
    console.error("Unexpected error in blog API:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
