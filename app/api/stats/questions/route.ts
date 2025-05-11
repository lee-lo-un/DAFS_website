import { createSupabaseServer } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createSupabaseServer()

    // 전체 질문 수 조회
    const { count: totalQuestions, error: countError } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error fetching question count:", countError)
      return NextResponse.json({ error: "질문 수를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 답변되지 않은 질문 수 조회
    const { count: unansweredQuestions, error: unansweredError } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .is("answer", null)

    if (unansweredError) {
      console.error("Error fetching unanswered questions:", unansweredError)
      return NextResponse.json({ error: "답변되지 않은 질문 수를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 최근 질문 5개 조회
    const { data: recentQuestions, error: recentError } = await supabase
      .from("questions")
      .select("id, title, created_at, is_answered")
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentError) {
      console.error("Error fetching recent questions:", recentError)
      return NextResponse.json({ error: "최근 질문을 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      totalQuestions,
      unansweredQuestions,
      recentQuestions,
    })
  } catch (error) {
    console.error("Unexpected error in questions API:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
