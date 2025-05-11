import { createSupabaseServer } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createSupabaseServer()

    // 사용자 수 조회
    const { count: userCount, error: userError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (userError) throw userError

    // 질문 수 조회
    const { count: questionCount, error: questionError } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })

    if (questionError) throw questionError

    // 리뷰 수 조회
    const { count: reviewCount, error: reviewError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })

    if (reviewError) throw reviewError

    // 블로그 포스트 수 조회
    const { count: blogCount, error: blogError } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })

    if (blogError) throw blogError

    // 최근 활동 조회 (모든 테이블에서 최근 활동 10개)
    const recentActivity = await getRecentActivity(supabase)

    return NextResponse.json({
      userCount,
      questionCount,
      reviewCount,
      blogCount,
      recentActivity,
    })
  } catch (error) {
    console.error("Error in summary API:", error)
    return NextResponse.json({ error: "통계 데이터를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

async function getRecentActivity(supabase: any) {
  try {
    // 최근 사용자 가입
    const { data: recentUsers, error: userError } = await supabase
      .from("profiles")
      .select("id, email, created_at")
      .order("created_at", { ascending: false })
      .limit(3)

    if (userError) throw userError

    // 최근 질문
    const { data: recentQuestions, error: questionError } = await supabase
      .from("questions")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(3)

    if (questionError) throw questionError

    // 최근 리뷰 - title 대신 content 또는 다른 필드 사용
    const { data: recentReviews, error: reviewError } = await supabase
      .from("reviews")
      .select("id, content, rating, created_at")
      .order("created_at", { ascending: false })
      .limit(3)

    if (reviewError) throw reviewError

    // 최근 블로그 포스트
    const { data: recentPosts, error: blogError } = await supabase
      .from("blog_posts")
      .select("id, title, published_at")
      .order("published_at", { ascending: false })
      .limit(3)

    if (blogError) throw blogError

    // 모든 활동을 하나의 배열로 합치고 날짜순으로 정렬
    const allActivity = [
      ...recentUsers.map((user) => ({
        type: "user",
        id: user.id,
        title: user.email || `사용자 ${user.id.substring(0, 8)}`,
        date: user.created_at,
        action: "가입",
      })),
      ...recentQuestions.map((question) => ({
        type: "question",
        id: question.id,
        title: question.title || "제목 없음",
        date: question.created_at,
        action: "질문",
      })),
      ...recentReviews.map((review) => ({
        type: "review",
        id: review.id,
        // content 필드 사용, 없으면 rating 정보 표시, 둘 다 없으면 기본 텍스트
        title: review.content
          ? review.content.length > 30
            ? review.content.substring(0, 30) + "..."
            : review.content
          : review.rating
            ? `별점 ${review.rating}점 리뷰`
            : "새 리뷰",
        date: review.created_at,
        action: "리뷰",
      })),
      ...recentPosts.map((post) => ({
        type: "blog",
        id: post.id,
        title: post.title || "제목 없음",
        date: post.published_at,
        action: "블로그",
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return allActivity.slice(0, 10) // 최근 10개 활동만 반환
  } catch (error) {
    console.error("Error getting recent activity:", error)
    return [] // 오류 발생 시 빈 배열 반환
  }
}
