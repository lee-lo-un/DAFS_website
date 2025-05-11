import { Suspense } from "react"
import ReviewManagement from "@/components/admin/review-management"
import { Loader2 } from "lucide-react"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { createSupabaseServer } from "@/utils/supabase/server"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

// 서버 컴포넌트에서 리뷰 데이터 가져오기
async function ReviewManagementWithData() {
  const supabase = createSupabaseServer()

  // 리뷰 데이터 가져오기
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      content,
      created_at,
      user_id,
      product_id,
      products (
        name
      ),
      profiles (
        email,
        full_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return <div className="text-red-500">리뷰를 불러오는 중 오류가 발생했습니다.</div>
  }

  return <ReviewManagement reviews={reviews || []} />
}

export default function AdminReviewsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">리뷰 관리</h1>
            <p className="text-xl text-foreground/70 mb-8">사용자 리뷰를 관리하세요.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <AdminAuthCheck>
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <ReviewManagementWithData />
            </Suspense>
          </AdminAuthCheck>
        </div>
      </section>
    </div>
  )
}
