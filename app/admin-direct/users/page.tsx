import { Suspense } from "react"
import UserManagement from "@/components/admin/user-management"
import { Loader2 } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// 동적 렌더링 설정
export const dynamic = "force-dynamic"

// 서버 컴포넌트에서 사용자 데이터 가져오기
async function UserManagementWithData() {
  try {
    // Supabase 클라이언트 생성 (올바른 방법)
    const supabase = createServerComponentClient({ cookies })
    
    // 사용자 데이터 가져오기
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, is_admin, created_at")
      .order("created_at", { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return <UserManagement users={users || []} />
  } catch (error: any) {
    console.error("Error in UserManagementWithData:", error)
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-red-800 font-bold">사용자 데이터 로딩 오류</h3>
        <p className="text-red-600">{error?.message || "알 수 없는 오류가 발생했습니다."}</p>
        <div className="mt-4 bg-white p-4 rounded-md">
          <p className="font-bold">오류 내용</p>
          <pre className="text-xs overflow-auto mt-2 p-2 bg-gray-100 rounded">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    )
  }
}

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">사용자 관리 (직접 접근)</h1>
            <p className="text-xl text-foreground/70 mb-8">사이트 사용자를 관리하세요.</p>
            <p className="text-green-600 mb-6">✅ 관리자 권한이 확인되었습니다.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <UserManagementWithData />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
