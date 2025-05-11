import { createSupabaseServer } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

export default async function InitializeCategoriesPage() {
  const supabase = createSupabaseServer()

  // 카테고리 초기화 함수
  async function initializeCategories() {
    "use server"

    const supabase = createSupabaseServer()

    try {
      // 카테고리 테이블 확인
      const { count, error: countError } = await supabase.from("categories").select("*", { count: "exact", head: true })

      if (countError) {
        return { success: false, error: "카테고리 테이블 확인 중 오류가 발생했습니다." }
      }

      // 기본 카테고리 데이터
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

      // 카테고리가 없으면 기본 카테고리 추가
      if (count === 0) {
        const { error: insertError } = await supabase.from("categories").insert(defaultCategories)

        if (insertError) {
          return { success: false, error: "기본 카테고리 생성 중 오류가 발생했습니다." }
        }

        return { success: true, message: "기본 카테고리가 성공적으로 생성되었습니다." }
      }

      return { success: true, message: "카테고리가 이미 존재합니다. 초기화가 필요하지 않습니다." }
    } catch (error) {
      console.error("카테고리 초기화 중 오류:", error)
      return { success: false, error: "카테고리 초기화 중 예기치 않은 오류가 발생했습니다." }
    }
  }

  // 현재 카테고리 목록 가져오기
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("display_order")

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>카테고리 초기화</CardTitle>
          <CardDescription>
            블로그 카테고리를 초기화합니다. 카테고리가 없는 경우 기본 카테고리를 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">현재 카테고리 상태</h3>
            {categoriesError ? (
              <p className="text-red-500">카테고리 정보를 가져오는 중 오류가 발생했습니다.</p>
            ) : categories && categories.length > 0 ? (
              <div>
                <p className="mb-2">등록된 카테고리: {categories.length}개</p>
                <ul className="list-disc pl-5 space-y-1">
                  {categories.map((category) => (
                    <li key={category.id}>
                      {category.name} {category.is_default && "(기본)"}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>등록된 카테고리가 없습니다.</p>
            )}
          </div>

          <form action={initializeCategories}>
            <Button type="submit" className="mr-2">
              카테고리 초기화
            </Button>
            <Link href="/admin/categories">
              <Button variant="outline">카테고리 관리로 이동</Button>
            </Link>
          </form>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <h3 className="text-amber-800 font-medium mb-2">주의사항</h3>
            <p className="text-amber-700 text-sm">
              이 기능은 카테고리가 없는 경우에만 기본 카테고리를 생성합니다. 기존 카테고리는 삭제되지 않습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
