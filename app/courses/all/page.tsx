import type { Metadata } from "next"
import Link from "next/link"
import { createSupabaseServer } from "@/utils/supabase/server"
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "전체 교육 일정 | 모던 풍수",
  description: "모던 풍수의 모든 교육 과정과 세미나, 워크샵 일정을 확인하세요.",
}

// 정적 렌더링 비활성화
export const dynamic = "force-dynamic"

async function getAllCourses() {
  const supabase = createSupabaseServer()

  const { data: courses, error } = await supabase
    .from("fengshui_courses")
    .select("*")
    .order("start_date", { ascending: true })

  if (error) {
    console.error("Error fetching courses:", error)
    return []
  }

  return courses
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
}

export default async function AllCoursesPage() {
  const courses = await getAllCourses()

  // 카테고리별로 그룹화
  const groupedCourses = courses.reduce((acc: any, course) => {
    if (!acc[course.category]) {
      acc[course.category] = []
    }
    acc[course.category].push(course)
    return acc
  }, {})

  // 카테고리 순서 정의
  const categoryOrder = ["정규과정", "워크샵", "세미나"]

  return (
    <main className="min-h-screen pt-24 pb-16">
      <section className="py-12 px-4 md:px-8">
        <div className="container-width mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-16">전체 교육 일정</h1>

          {categoryOrder.map(
            (category) =>
              groupedCourses[category] &&
              groupedCourses[category].length > 0 && (
                <div key={category} className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category}</h2>

                  <div className="space-y-4">
                    {groupedCourses[category].map((course: any) => {
                      // 신청 가능 여부 확인
                      const isAvailable =
                        course.is_active &&
                        (course.max_attendees === null || course.current_attendees < course.max_attendees)

                      return (
                        <div
                          key={course.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <Link href={`/courses/${course.id}`}>
                                <h3 className="text-xl font-bold mb-2 hover:text-amber-500 transition-colors">
                                  {course.title}
                                </h3>
                              </Link>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                  <CalendarIcon className="h-4 w-4 mr-2 text-amber-500" />
                                  {formatDate(course.start_date)}
                                  {course.end_date && ` ~ ${formatDate(course.end_date)}`}
                                </div>

                                {course.time && (
                                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <ClockIcon className="h-4 w-4 mr-2 text-amber-500" />
                                    {course.time}
                                  </div>
                                )}

                                {course.location && (
                                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <MapPinIcon className="h-4 w-4 mr-2 text-amber-500" />
                                    {course.location}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between">
                              <div className="mb-4 md:mb-0">
                                {isAvailable ? (
                                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                                    신청 가능
                                  </span>
                                ) : (
                                  <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-full text-sm">
                                    마감
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center space-x-2">
                                <div className="text-right">
                                  <div className="text-sm text-gray-600 dark:text-gray-300">수강료</div>
                                  <div className="font-bold text-amber-600">
                                    {course.price === 0 ? "무료" : `${course.price.toLocaleString()}원`}
                                  </div>
                                </div>

                                <Link href={`/courses/${course.id}`}>
                                  <button className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded text-sm transition-colors">
                                    자세히 보기
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ),
          )}
        </div>
      </section>
    </main>
  )
}
