import { createSupabaseServer } from "@/utils/supabase/server"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "간산안내 - 동아풍수문화연구원",
  description: "동아풍수문화연구원의 간산안내 및 업데이트 소식을 확인하세요.",
}

export const revalidate = 3600 // 1시간마다 재검증

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: { page?: string; per_page?: string }
}) {
  // 페이지네이션 파라미터
  const params = await searchParams;
  const currentPage = Number(params.page) || 1
  const perPage = Number(params.per_page) || 10

  try {
    const supabase = await createSupabaseServer()

    // 고정된 공지사항 가져오기
    const { data: pinnedNotices, error: pinnedError } = await supabase
      .from("notices")
      .select("id, title, published_at, author_id")
      .eq("pinned", true)
      .order("published_at", { ascending: false })

    if (pinnedError) {
      console.error("고정 공지사항 조회 오류:", pinnedError)
    }

    // 일반 공지사항 가져오기 (페이지네이션 적용)
    const from = (currentPage - 1) * perPage
    const to = from + perPage - 1

    const {
      data: notices,
      error: noticesError,
      count,
    } = await supabase
      .from("notices")
      .select("id, title, published_at, author_id", { count: "exact" })
      .eq("pinned", false)
      .order("published_at", { ascending: false })
      .range(from, to)

    if (noticesError) {
      console.error("공지사항 조회 오류:", noticesError)
    }

    return (
      <div className="container mx-auto py-24 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8 mt-8">간산안내</h1>

        {/* 고정 공지사항 */}
        {pinnedNotices && pinnedNotices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">중요 공지</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg divide-y">
              {pinnedNotices.map((notice) => (
                <div key={notice.id} className="p-4 hover:bg-amber-100 transition-colors">
                  <Link href={`/notices/${notice.id}`} className="block">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">{notice.title}</h3>
                      <span className="text-sm text-gray-500">{formatDate(notice.published_at)}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 일반 공지사항 */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {notices && notices.length > 0 ? (
            <div className="divide-y">
              {notices.map((notice) => (
                <div key={notice.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Link href={`/notices/${notice.id}`} className="block">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium dark:text-white">{notice.title}</h3>
                      <span className="text-sm text-gray-500">{formatDate(notice.published_at)}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-300">간산안내가 없습니다.</div>
          )}
        </div>

        {/* 페이지네이션 */}
        {count !== null && count > perPage ? (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(count / perPage)}
              baseUrl="/notices"
              searchParams={searchParams}
            />
          </div>
        ) : null}
      </div>
    )
  } catch (error) {
    console.error("공지사항 페이지 오류:", error)

    // 오류 발생 시 대체 UI 표시
    return (
      <div className="container mx-auto py-24 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8 mt-8">간산안내</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-700">일시적인 오류가 발생했습니다</h2>
          <p className="mb-6 text-gray-700">공지사항을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }
}
