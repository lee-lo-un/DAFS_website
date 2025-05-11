import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: "Supabase 환경 변수가 설정되지 않았습니다." }, { status: 500 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
    })

    // 카테고리 테이블 확인
    const { count: categoryCount, error: categoryCountError } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true })

    if (categoryCountError) {
      // 테이블이 없는 경우 생성
      if (categoryCountError.code === "42P01") {
        // 테이블 생성 SQL 실행 (RPC 또는 마이그레이션 도구 사용)
        return NextResponse.json(
          { success: false, error: "카테고리 테이블이 없습니다. 마이그레이션을 실행해주세요." },
          { status: 500 },
        )
      }

      return NextResponse.json(
        { success: false, error: `카테고리 테이블 확인 오류: ${categoryCountError.message}` },
        { status: 500 },
      )
    }

    // 카테고리가 없으면 기본 카테고리 생성
    if (categoryCount === 0) {
      const defaultCategories = [
        {
          name: "풍수 기초",
          slug: "basics",
          description: "풍수의 기본 원리와 개념",
          color: "#4CAF50",
          display_order: 1,
          is_default: true,
        },
        {
          name: "인테리어 팁",
          slug: "interior",
          description: "풍수를 적용한 인테리어 팁",
          color: "#2196F3",
          display_order: 2,
          is_default: false,
        },
        {
          name: "풍수 사례",
          slug: "case-studies",
          description: "실제 풍수 적용 사례",
          color: "#FF9800",
          display_order: 3,
          is_default: false,
        },
      ]

      const { error: insertError } = await supabase.from("categories").insert(defaultCategories)

      if (insertError) {
        return NextResponse.json(
          { success: false, error: `기본 카테고리 생성 오류: ${insertError.message}` },
          { status: 500 },
        )
      }
    }

    // 블로그 포스트 테이블 확인
    const { count: postCount, error: postCountError } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })

    if (postCountError) {
      // 테이블이 없는 경우
      if (postCountError.code === "42P01") {
        return NextResponse.json(
          { success: false, error: "블로그 포스트 테이블이 없습니다. 마이그레이션을 실행해주세요." },
          { status: 500 },
        )
      }

      return NextResponse.json(
        { success: false, error: `블로그 포스트 테이블 확인 오류: ${postCountError.message}` },
        { status: 500 },
      )
    }

    // 블로그 포스트가 없으면 샘플 포스트 생성
    if (postCount === 0) {
      // 카테고리 ID 가져오기
      const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, slug")

      if (categoriesError) {
        return NextResponse.json(
          { success: false, error: `카테고리 ID 가져오기 오류: ${categoriesError.message}` },
          { status: 500 },
        )
      }

      const categoryMap = categories.reduce((acc: any, cat: any) => {
        acc[cat.slug] = cat.id
        return acc
      }, {})

      const samplePosts = [
        {
          title: "풍수의 기본 원리",
          slug: "basic-principles",
          content:
            "풍수는 자연의 에너지와 조화를 이루는 방법을 연구하는 고대 중국의 학문입니다. 이 글에서는 풍수의 기본 원리와 현대 생활에 적용하는 방법을 알아봅니다.",
          clean_content: "풍수는 자연의 에너지와 조화를 이루는 방법을 연구하는 고대 중국의 학문입니다.",
          image_url: "/placeholder.svg?key=aonpz",
          published_at: new Date().toISOString(),
          category_id: categoryMap["basics"],
          is_published: true,
          author: "관리자",
        },
        {
          title: "침실 배치의 풍수 원리",
          slug: "bedroom-fengshui",
          content:
            "침실은 휴식과 회복의 공간입니다. 풍수 원리에 따라 침실을 배치하면 수면의 질을 향상시키고 전반적인 웰빙을 증진할 수 있습니다.",
          clean_content:
            "침실은 휴식과 회복의 공간입니다. 풍수 원리에 따라 침실을 배치하면 수면의 질을 향상시킬 수 있습니다.",
          image_url: "/placeholder.svg?key=mvckd",
          published_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
          category_id: categoryMap["interior"],
          is_published: true,
          author: "관리자",
        },
        {
          title: "서울 아파트의 풍수 사례 연구",
          slug: "seoul-apartment-case",
          content:
            "서울의 한 아파트에 풍수 원리를 적용한 사례를 분석합니다. 공간 배치와 에너지 흐름을 개선하여 거주자의 삶의 질이 어떻게 향상되었는지 알아봅니다.",
          clean_content: "서울의 한 아파트에 풍수 원리를 적용한 사례를 분석합니다.",
          image_url: "/placeholder.svg?key=b7dcc",
          published_at: new Date(Date.now() - 172800000).toISOString(), // 2일 전
          category_id: categoryMap["case-studies"],
          is_published: true,
          author: "관리자",
        },
      ]

      const { error: postsInsertError } = await supabase.from("blog_posts").insert(samplePosts)

      if (postsInsertError) {
        return NextResponse.json(
          { success: false, error: `샘플 블로그 포스트 생성 오류: ${postsInsertError.message}` },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "데이터베이스 초기화가 완료되었습니다.",
      categoryCount,
      postCount,
    })
  } catch (error: any) {
    console.error("데이터베이스 초기화 중 오류 발생:", error)
    return NextResponse.json(
      { success: false, error: error.message || "알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}
