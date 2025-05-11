import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function DatabaseTestPage() {
  let supabaseStatus = { success: false, error: "테스트가 실행되지 않았습니다." }
  let categoriesData = null
  let postsData = null
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "설정됨" : "설정안됨",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "설정됨" : "설정안됨",
  }

  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      supabaseStatus = {
        success: false,
        error: "Supabase 환경 변수가 설정되지 않았습니다.",
      }
    } else {
      // Supabase 클라이언트 생성
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

      // 카테고리 테이블 테스트
      try {
        const { data: categories, error: categoriesError } = await supabase.from("categories").select("*").limit(5)

        if (categoriesError) {
          throw categoriesError
        }

        categoriesData = categories
      } catch (error: any) {
        categoriesData = { error: error.message }
      }

      // 블로그 포스트 테이블 테스트
      try {
        const { data: posts, error: postsError } = await supabase
          .from("blog_posts")
          .select("id, title, slug, published_at")
          .limit(5)

        if (postsError) {
          throw postsError
        }

        postsData = posts
      } catch (error: any) {
        postsData = { error: error.message }
      }

      supabaseStatus = {
        success: true,
        error: null,
      }
    }
  } catch (error: any) {
    supabaseStatus = {
      success: false,
      error: error.message || "알 수 없는 오류가 발생했습니다.",
    }
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">데이터베이스 연결 테스트</h1>

      <div className="space-y-8">
        {/* 환경 변수 상태 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">환경 변수 상태</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium">{key}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    value === "설정됨" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Supabase 연결 상태 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Supabase 연결 상태</h2>
          <div
            className={`p-4 rounded-md ${
              supabaseStatus.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            <p className="font-medium">{supabaseStatus.success ? "연결 성공" : "연결 실패"}</p>
            {!supabaseStatus.success && supabaseStatus.error && <p className="mt-2 text-sm">{supabaseStatus.error}</p>}
          </div>
        </div>

        {/* 카테고리 테이블 테스트 결과 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">카테고리 테이블 테스트</h2>
          {categoriesData && !("error" in categoriesData) ? (
            <div>
              <p className="text-green-600 mb-4">카테고리 테이블 조회 성공 ({categoriesData.length}개 항목)</p>
              {categoriesData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이름
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          슬러그
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoriesData.map((category: any) => (
                        <tr key={category.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-yellow-600">카테고리가 없습니다.</p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-red-50 rounded-md">
              <p className="text-red-600">카테고리 테이블 조회 실패</p>
              {categoriesData && "error" in categoriesData && (
                <p className="mt-2 text-sm text-red-500">{categoriesData.error}</p>
              )}
            </div>
          )}
        </div>

        {/* 블로그 포스트 테이블 테스트 결과 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">블로그 포스트 테이블 테스트</h2>
          {postsData && !("error" in postsData) ? (
            <div>
              <p className="text-green-600 mb-4">블로그 포스트 테이블 조회 성공 ({postsData.length}개 항목)</p>
              {postsData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제목
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          슬러그
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          발행일
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {postsData.map((post: any) => (
                        <tr key={post.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {post.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.slug}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(new Date(post.published_at))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-yellow-600">블로그 포스트가 없습니다.</p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-red-50 rounded-md">
              <p className="text-red-600">블로그 포스트 테이블 조회 실패</p>
              {postsData && "error" in postsData && <p className="mt-2 text-sm text-red-500">{postsData.error}</p>}
            </div>
          )}
        </div>

        {/* 데이터베이스 초기화 버튼 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">데이터베이스 초기화</h2>
          <p className="text-sm text-gray-600 mb-4">
            데이터베이스에 문제가 있는 경우, 초기 데이터를 다시 생성할 수 있습니다. 이 작업은 기존 데이터를 삭제하지
            않고 필요한 테이블과 기본 데이터만 추가합니다.
          </p>
          <form action="/api/admin/initialize-db" method="POST">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              데이터베이스 초기화
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
