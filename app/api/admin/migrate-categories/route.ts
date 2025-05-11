import { createSupabaseServer } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const supabase = createSupabaseServer()

    // 1. 카테고리 테이블이 존재하는지 확인
    const { data: tableExists, error: tableCheckError } = await supabase.rpc("check_table_exists", {
      table_name: "categories",
    })

    if (tableCheckError) {
      console.error("Error checking table:", tableCheckError)
      return NextResponse.json({ error: "테이블 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 테이블이 없으면 생성
    if (!tableExists) {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          color TEXT DEFAULT '#3b82f6',
          display_order INTEGER NOT NULL DEFAULT 0,
          is_default BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- 컬럼 존재 여부를 확인하는 함수 생성
        CREATE OR REPLACE FUNCTION check_column_exists(table_name text, column_name text)
        RETURNS boolean
        LANGUAGE plpgsql
        AS $$
        DECLARE
          column_exists boolean;
        BEGIN
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = $1
            AND column_name = $2
          ) INTO column_exists;
          
          RETURN column_exists;
        END;
        $$;
        
        -- 테이블 존재 여부를 확인하는 함수 생성
        CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
        RETURNS boolean
        LANGUAGE plpgsql
        AS $$
        DECLARE
          table_exists boolean;
        BEGIN
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = $1
          ) INTO table_exists;
          
          RETURN table_exists;
        END;
        $$;
        
        -- blog_posts 테이블에 category_id 컬럼 추가
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);
      `

      const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableQuery })

      if (createError) {
        console.error("Error creating table:", createError)
        return NextResponse.json({ error: "테이블 생성 중 오류가 발생했습니다." }, { status: 500 })
      }
    }

    // 2. 기존 블로그 포스트에서 고유한 카테고리 추출
    const { data: posts, error: postsError } = await supabase
      .from("blog_posts")
      .select("id, category")
      .not("category", "is", null)

    if (postsError) {
      console.error("Error fetching posts:", postsError)
      return NextResponse.json({ error: "게시글 가져오기 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 고유한 카테고리 추출
    const uniqueCategories = Array.from(new Set(posts.map((post) => post.category)))
      .filter((category) => category && category.trim() !== "")
      .map((category) => ({
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
      }))

    // 3. 기본 카테고리 추가
    const defaultCategories = [
      { name: "미분류", slug: "uncategorized", is_default: true },
      { name: "사례 모음", slug: "case-studies" },
      { name: "명당 소개", slug: "feng-shui-spots" },
      { name: "풍수 팁", slug: "feng-shui-tips" },
      { name: "풍수 이론", slug: "feng-shui-theory" },
    ]

    // 기존 카테고리와 기본 카테고리 병합 (중복 제거)
    const allCategories = [
      ...defaultCategories,
      ...uniqueCategories.filter((uc) => !defaultCategories.some((dc) => dc.name === uc.name || dc.slug === uc.slug)),
    ]

    // 4. 카테고리 테이블에 데이터 삽입
    const insertPromises = allCategories.map(async (category, index) => {
      const { data, error } = await supabase.from("categories").select("id").eq("slug", category.slug).maybeSingle()

      if (error) {
        console.error(`Error checking category ${category.name}:`, error)
        return null
      }

      // 이미 존재하면 건너뛰기
      if (data) {
        return data
      }

      // 새 카테고리 삽입
      const { data: newCategory, error: insertError } = await supabase
        .from("categories")
        .insert({
          name: category.name,
          slug: category.slug,
          description: `${category.name} 카테고리`,
          color: getRandomColor(),
          display_order: index + 1,
          is_default: category.is_default || false,
        })
        .select()
        .single()

      if (insertError) {
        console.error(`Error inserting category ${category.name}:`, insertError)
        return null
      }

      return newCategory
    })

    const insertedCategories = await Promise.all(insertPromises)
    const validCategories = insertedCategories.filter(Boolean)

    // 5. 블로그 포스트의 category_id 업데이트
    const updatePromises = posts.map(async (post) => {
      if (!post.category) return null

      // 해당 카테고리 찾기
      const category = validCategories.find(
        (c) => c.name === post.category || c.slug === post.category.toLowerCase().replace(/\s+/g, "-"),
      )

      if (!category) return null

      // 포스트 업데이트
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({ category_id: category.id })
        .eq("id", post.id)

      if (updateError) {
        console.error(`Error updating post ${post.id}:`, updateError)
        return null
      }

      return post.id
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: "카테고리 마이그레이션이 완료되었습니다.",
      categories: validCategories,
    })
  } catch (error) {
    console.error("Unexpected error in migration:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 랜덤 색상 생성 함수
function getRandomColor() {
  const colors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
    "#84cc16", // lime
    "#6366f1", // indigo
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
