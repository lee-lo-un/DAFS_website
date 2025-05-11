import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/utils/supabase/server"

// 캐싱 전략 설정: 10분마다 재검증
export const revalidate = 600

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

// 카테고리 목록 가져오기
export async function GET() {
  try {
    console.log("카테고리 API: 요청 시작")
    const supabase = await createSupabaseServer();

    // 모든 블로그 글 수 가져오기
    const { count: totalPosts, error: countError } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })

    if (countError) {
      console.error("카테고리 API: 전체 포스트 수 조회 오류", countError)
      return NextResponse.json(
        { error: "전체 포스트 수 조회 중 오류가 발생했습니다", details: countError },
        { status: 500 },
      )
    }

    // 카테고리 가져오기
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name, slug, display_order, color, is_default")
      .order("display_order")

    if (categoriesError) {
      console.error("카테고리 API: 카테고리 조회 오류", categoriesError)
      return NextResponse.json(
        { error: "카테고리 조회 중 오류가 발생했습니다", details: categoriesError },
        { status: 500 },
      )
    }

    // 각 카테고리별 포스트 수 가져오기
    const categoriesWithCount = await Promise.all(
      categoriesData.map(async (category) => {
        const { count, error: countError } = await supabase
          .from("blog_posts")
          .select("id", { count: "exact", head: true })
          .eq("category_id", category.id)

        if (countError) {
          console.error(`카테고리 API: 카테고리 ${category.slug} 포스트 수 조회 오류`, countError)
          return { ...category, count: 0 }
        }

        return { ...category, count: count || 0 }
      }),
    )

    console.log("카테고리 API: 응답 데이터", categoriesWithCount)
    return NextResponse.json(categoriesWithCount)
  } catch (error) {
    console.error("카테고리 API: 예외 발생", error)
    return NextResponse.json({ error: "카테고리 데이터를 가져오는 중 오류가 발생했습니다" }, { status: 500 })
  }
}

// 새 카테고리 추가
export async function POST(request: Request) {
  try {
    const { name, slug, description, color, display_order, is_default = false } = await request.json()

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "유효한 카테고리 이름이 필요합니다." }, { status: 400 })
    }

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

    // 카테고리가 이미 존재하는지 확인
    const { data: existingCategory, error: checkError } = await supabase
      .from("categories")
      .select("id")
      .or(`name.eq.${name},slug.eq.${slug || name.toLowerCase().replace(/\s+/g, "-")}`)
      .limit(1)

    if (checkError) {
      console.error("Error checking category:", checkError)
      return NextResponse.json({ error: "카테고리 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    if (existingCategory && existingCategory.length > 0) {
      return NextResponse.json({ error: `'${name}' 카테고리가 이미 존재합니다.` }, { status: 400 })
    }

    // 마지막 순서 값 가져오기
    const { data: lastOrder } = await supabase
      .from("categories")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)

    const nextOrder = lastOrder && lastOrder.length > 0 ? lastOrder[0].display_order + 1 : 1

    // 새 카테고리 생성을 위한 데이터 준비
    const insertData: any = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      color,
      display_order: display_order || nextOrder,
      is_default,
    }

    // 새 카테고리 생성
    const { data, error } = await supabase.from("categories").insert(insertData).select()

    if (error) {
      console.error("Error creating category:", error)
      return NextResponse.json({ error: "카테고리 생성 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `'${name}' 카테고리가 생성되었습니다.`,
      data: data[0],
    })
  } catch (error) {
    console.error("Unexpected error in category creation API:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 카테고리 업데이트
export async function PUT(request: Request) {
  try {
    const { id, name, slug, description, color, display_order, is_default } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "카테고리 ID가 필요합니다." }, { status: 400 })
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "유효한 카테고리 이름이 필요합니다." }, { status: 400 })
    }

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

    // 다른 카테고리와 이름이나 슬러그가 중복되는지 확인
    const { data: existingCategory, error: checkError } = await supabase
      .from("categories")
      .select("id")
      .or(`name.eq.${name},slug.eq.${slug || name.toLowerCase().replace(/\s+/g, "-")}`)
      .neq("id", id)
      .limit(1)

    if (checkError) {
      console.error("Error checking category:", checkError)
      return NextResponse.json({ error: "카테고리 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    if (existingCategory && existingCategory.length > 0) {
      return NextResponse.json({ error: `'${name}' 카테고리가 이미 존재합니다.` }, { status: 400 })
    }

    // 카테고리 업데이트
    const updateData: any = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      color,
      display_order,
      updated_at: new Date().toISOString(),
      is_default,
    }

    // 카테고리 업데이트
    const { data, error } = await supabase.from("categories").update(updateData).eq("id", id).select()

    if (error) {
      console.error("Error updating category:", error)
      return NextResponse.json({ error: "카테고리 업데이트 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `'${name}' 카테고리가 업데이트되었습니다.`,
      data: data[0],
    })
  } catch (error) {
    console.error("Unexpected error in category update API:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 카테고리 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "삭제할 카테고리 ID가 필요합니다." }, { status: 400 })
    }

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

    // 해당 카테고리의 게시글 수 확인
    const { count, error: countError } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id)

    if (countError) {
      console.error("Error counting posts:", countError)
      return NextResponse.json({ error: "게시글 수 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 카테고리 정보 가져오기
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("name, is_default")
      .eq("id", id)
      .single()

    if (categoryError) {
      console.error("Error checking category:", categoryError)
      return NextResponse.json({ error: "카테고리 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 기본 카테고리인 경우 삭제 불가
    if (categoryData.is_default) {
      return NextResponse.json(
        {
          error: `'${categoryData.name}' 카테고리는 기본 카테고리이므로 삭제할 수 없습니다.`,
        },
        { status: 400 },
      )
    }

    // 게시글이 있는 경우 삭제 불가
    if (count && count > 0) {
      return NextResponse.json(
        {
          error: `'${categoryData.name}' 카테고리에 ${count}개의 게시글이 있어 삭제할 수 없습니다.`,
        },
        { status: 400 },
      )
    }

    // 카테고리 삭제
    const { error: deleteError } = await supabase.from("categories").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting category:", deleteError)
      return NextResponse.json({ error: "카테고리 삭제 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `'${categoryData.name}' 카테고리가 삭제되었습니다.`,
    })
  } catch (error) {
    console.error("Unexpected error in category deletion API:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
