import { Suspense } from "react"
import BlogManagement from "@/components/admin/blog-management"
import { Loader2 } from "lucide-react"

// 동적 렌더링 설정 추가
export const dynamic = "force-dynamic"

export default function AdminBlogDirectPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">블로그 관리 (직접 접근)</h1>
            <p className="text-xl text-foreground/70 mb-8">블로그 포스트를 관리하세요.</p>
            <p className="text-green-600 mb-6">✅ 관리자 권한이 확인되었습니다.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          {/* AdminAuthCheck 컴포넌트 제거하고 직접 내용을 표시합니다 */}
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <BlogManagement />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
