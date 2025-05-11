import { createSupabaseServer } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createSupabaseServer()

    // 전체 리뷰 수 조회
    const { count: totalReviews, error: countError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error fetching review count:", countError)
      return NextResponse.json({ error: "리뷰 수를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 평균 평점 조회
    const { data: ratingData, error: ratingError } = await supabase.from("reviews").select("rating")

    if (ratingError) {
      console.error("Error fetching ratings:", ratingError)
      return NextResponse.json({ error: "평점을 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    let averageRating = 0
    if (ratingData && ratingData.length > 0) {
      const sum = ratingData.reduce((acc, review) => acc + review.rating, 0)
      averageRating = sum / ratingData.length
    }

    // 최근 리뷰 5개 조회
    const { data: recentReviews, error: recentError } = await supabase
      .from("reviews")
      .select("id, title, rating, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentError) {
      console.error("Error fetching recent reviews:", recentError)
      return NextResponse.json({ error: "최근 리뷰를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      totalReviews,
      averageRating,
      recentReviews,
    })
  } catch (error) {
    console.error("Unexpected error in reviews API:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
