import { createSupabaseServer } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createSupabaseServer()

    // 전체 사용자 수 조회
    const { count: totalUsers, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error fetching user count:", countError)
      return NextResponse.json({ error: "사용자 수를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 최근 가입한 사용자 5명 조회
    const { data: recentUsers, error: recentError } = await supabase
      .from("profiles")
      .select("id, username, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentError) {
      console.error("Error fetching recent users:", recentError)
      return NextResponse.json({ error: "최근 사용자를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      totalUsers,
      recentUsers,
    })
  } catch (error) {
    console.error("Unexpected error in users API:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
