import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
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

    console.log("블로그 초기화 API: 시작")

    // 카테고리 테이블 확인
    const { count: categoryCount, error: categoryCountError } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true })

    if (categoryCountError) {
      console.error("카테고리 테이블 확인 오류:", categoryCountError)
      return NextResponse.json({ error: "카테고리 테이블 확인 중 오류가 발생했습니다." }, { status: 500 })
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
        console.error("기본 카테고리 생성 오류:", insertError)
        return NextResponse.json({ error: "기본 카테고리 생성 중 오류가 발생했습니다." }, { status: 500 })
      }

      console.log("기본 카테고리가 생성되었습니다.")
    }

    // 블로그 포스트 테이블 확인
    const { count: postCount, error: postCountError } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })

    if (postCountError) {
      console.error("블로그 포스트 테이블 확인 오류:", postCountError)
      return NextResponse.json({ error: "블로그 포스트 테이블 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 블로그 포스트가 없으면 샘플 포스트 생성
    if (postCount === 0) {
      // 카테고리 ID 가져오기
      const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, slug")

      if (categoriesError) {
        console.error("카테고리 ID 가져오기 오류:", categoriesError)
        return NextResponse.json({ error: "카테고리 ID 가져오기 중 오류가 발생했습니다." }, { status: 500 })
      }

      const categoryMap = categories.reduce((acc: any, cat: any) => {
        acc[cat.slug] = cat.id
        return acc
      }, {})

      const samplePosts = [
        {
          title: "풍수의 기본 원리",
          slug: "basic-principles",
          content: `
            <h2>풍수의 기본 원리</h2>
            <p>풍수는 자연의 에너지와 조화를 이루는 방법을 연구하는 고대 중국의 학문입니다. 이 글에서는 풍수의 기본 원리와 현대 생활에 적용하는 방법을 알아봅니다.</p>
            <h3>음양의 조화</h3>
            <p>풍수의 가장 기본적인 원리는 음과 양의 조화입니다. 모든 공간에는 이 두 가지 에너지가 존재하며, 이들 사이의 균형이 중요합니다.</p>
            <h3>오행의 원리</h3>
            <p>오행(木, 火, 土, 金, 水)은 자연의 다섯 가지 기본 요소를 나타냅니다. 각 요소는 특정한 특성과 에너지를 가지고 있으며, 이들 사이의 상호작용이 풍수의 핵심입니다.</p>
          `,
          clean_content: "풍수는 자연의 에너지와 조화를 이루는 방법을 연구하는 고대 중국의 학문입니다.",
          image_url: "/placeholder.svg?key=bjew8",
          published_at: new Date().toISOString(),
          category_id: categoryMap["basics"],
          is_published: true,
          author: "관리자",
        },
        {
          title: "침실 배치의 풍수 원리",
          slug: "bedroom-fengshui",
          content: `
            <h2>침실 배치의 풍수 원리</h2>
            <p>침실은 휴식과 회복의 공간입니다. 풍수 원리에 따라 침실을 배치하면 수면의 질을 향상시키고 전반적인 웰빙을 증진할 수 있습니다.</p>
            <h3>침대 위치</h3>
            <p>침대는 문에서 보이지만 문과 직접 마주보지 않는 위치에 배치하는 것이 좋습니다. 또한 창문 아래나 빔 아래에 침대를 두는 것은 피해야 합니다.</p>
            <h3>색상 선택</h3>
            <p>침실에는 편안함과 휴식을 촉진하는 부드러운 색상을 사용하는 것이 좋습니다. 파스텔 톤이나 중성적인 색상이 적합합니다.</p>
          `,
          clean_content:
            "침실은 휴식과 회복의 공간입니다. 풍수 원리에 따라 침실을 배치하면 수면의 질을 향상시킬 수 있습니다.",
          image_url: "/placeholder.svg?key=o4svg",
          published_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
          category_id: categoryMap["interior"],
          is_published: true,
          author: "관리자",
        },
        {
          title: "서울 아파트의 풍수 사례 연구",
          slug: "seoul-apartment-case",
          content: `
            <h2>서울 아파트의 풍수 사례 연구</h2>
            <p>서울의 한 아파트에 풍수 원리를 적용한 사례를 분석합니다. 공간 배치와 에너지 흐름을 개선하여 거주자의 삶의 질이 어떻게 향상되었는지 알아봅니다.</p>
            <h3>공간 배치 변경</h3>
            <p>기존 아파트의 가구 배치는 에너지 흐름을 방해하고 있었습니다. 소파와 테이블의 위치를 조정하고 식물을 적절히 배치하여 기의 흐름을 개선했습니다.</p>
            <h3>색상 및 조명 조정</h3>
            <p>거실의 색상을 따뜻한 톤으로 변경하고 자연광을 최대한 활용할 수 있도록 창문 처리를 개선했습니다. 이로 인해 공간의 에너지가 활성화되었습니다.</p>
          `,
          clean_content: "서울의 한 아파트에 풍수 원리를 적용한 사례를 분석합니다.",
          image_url: "/placeholder.svg?key=96iwk",
          published_at: new Date(Date.now() - 172800000).toISOString(), // 2일 전
          category_id: categoryMap["case-studies"],
          is_published: true,
          author: "관리자",
        },
      ]

      const { error: postsInsertError } = await supabase.from("blog_posts").insert(samplePosts)

      if (postsInsertError) {
        console.error("샘플 블로그 포스트 생성 오류:", postsInsertError)
        return NextResponse.json({ error: "샘플 블로그 포스트 생성 중 오류가 발생했습니다." }, { status: 500 })
      }

      console.log("샘플 블로그 포스트가 생성되었습니다.")
    }

    return NextResponse.json({
      success: true,
      message: "블로그 데이터가 성공적으로 초기화되었습니다.",
      categories: categoryCount,
      posts: postCount,
    })
  } catch (error: any) {
    console.error("블로그 초기화 API 오류:", error)
    return NextResponse.json(
      { error: error.message || "블로그 데이터 초기화 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}
