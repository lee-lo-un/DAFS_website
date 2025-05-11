import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, BookOpen, Hand } from "lucide-react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "풍수교육 프로그램 | 모던 풍수",
  description:
    "모던 풍수의 다양한 풍수지리 교육 프로그램을 확인하세요. 입문 과정부터 전문가 과정까지 체계적인 커리큘럼을 제공합니다.",
};

// 정적 렌더링 비활성화
export const dynamic = "force-dynamic";

async function getCourses() {
  const supabase = createServerComponentClient({ cookies });

  // 정규 과정 가져오기
  const { data: regularCourses, error: regularError } = await supabase
    .from("fengshui_courses")
    .select("*")
    .eq("category", "정규과정")
    .order("start_date", { ascending: true });

  // 세미나/워크샵 가져오기
  const { data: seminars, error: seminarError } = await supabase
    .from("fengshui_courses")
    .select("*")
    .in("category", ["세미나", "워크샵"])
    .order("start_date", { ascending: true })
    .limit(4);

  if (regularError || seminarError) {
    console.error("Error fetching courses:", regularError || seminarError);
    return { regularCourses: [], seminars: [] };
  }

  return { regularCourses, seminars };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

export default async function CoursesPage() {
  const { regularCourses, seminars } = await getCourses();

  // 아이콘 매핑
  const courseIcons = {
    "풍수지리 입문 과정": (
      <GraduationCap className="h-12 w-12 text-amber-500" />
    ),
    "풍수지리 전문가 과정": <BookOpen className="h-12 w-12 text-amber-500" />,
    "풍수 인테리어 과정": <Hand className="h-12 w-12 text-amber-500" />,
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <section className="py-12 px-4 md:px-8">
        <div className="container-width mx-auto">
          {/* 풍수지리 교육 프로그램 제목 영역 */}
          <div className="mb-16">
            <div className="bg-yellow-400 rounded-lg py-3 mb-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold">
                풍수지리 교육 프로그램
              </h1>
            </div>
            <div className="bg-green-500 rounded-lg p-6 text-center relative">
              <div className="absolute left-24 top-1/2 -translate-y-1/2">
                <div className="border-4 border-yellow-400 rounded-full p-8 bg-green-500">
                  <div className="text-red-600 font-bold text-2xl">명당</div>
                  <div className="text-red-600 font-bold text-2xl">쪽 집게</div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center">
                  <div className="w-14 h-14 mr-3 border-2 border-gray-800 rounded-full p-1 bg-white flex-shrink-0">
                    <img
                      src="/images/injea-logo.png"
                      alt="인제대학교"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-4xl font-bold text-black-600 mb-2">
                    인제대학교 미래교육원
                  </h2>
                </div>
                <h3 className="text-3xl font-bold text-red-600 mb-2">
                  宜 실전 풍수지리
                </h3>
                <p className="text-xl font-bold">문의 : 010-4135-9319</p>
              </div>

              <div className="absolute right-24 top-1/2 -translate-y-1/2">
                <div className="border-4 border-yellow-400 rounded-full p-8 bg-green-500">
                  <div className="text-red-600 font-bold text-2xl">
                    묘, 집, 공장,
                  </div>
                  <div className="text-red-600 font-bold text-2xl">
                    사무실 등
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 정규 과정 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {regularCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-4">
                    {courseIcons[course.title as keyof typeof courseIcons] || (
                      <GraduationCap className="h-12 w-12 text-amber-500" />
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-center mb-4">
                  {course.title}
                </h3>

                <ul className="space-y-3 mb-6 flex-grow">
                  {course.description?.split("\n").map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2">●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center mb-4">교육 기간: {course.time}</div>

                <Link href={`/courses/${course.id}`}>
                  <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded transition-colors">
                    자세히 보기
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* 특별 세미나 및 워크샵 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-center mb-12">
              특별 세미나 및 워크샵
            </h2>

            <div className="relative">
              {/* 타임라인 중앙선 */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-500"></div>

              {/* 세미나/워크샵 목록 */}
              <div className="space-y-16">
                {seminars.map((seminar, index) => (
                  <div key={seminar.id} className="relative">
                    {/* 날짜 태그 */}
                    <div
                      className={`absolute top-0 ${
                        index % 2 === 0 ? "right-0" : "left-0"
                      } bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm`}
                    >
                      {formatDate(seminar.start_date)}
                    </div>

                    {/* 컨텐츠 */}
                    <div
                      className={`flex ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div className="w-1/2"></div>
                      <div className="w-12 flex items-start justify-center relative z-10">
                        <div className="w-5 h-5 bg-amber-500 rounded-full mt-2"></div>
                      </div>
                      <div className="w-1/2">
                        <h3 className="text-lg font-bold mb-2">
                          {seminar.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {seminar.description}
                        </p>
                        <Link href={`/courses/${seminar.id}`}>
                          <button className="bg-transparent hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500 py-1 px-4 rounded text-sm transition-colors">
                            자세히 보기
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/courses/all"
                className="text-amber-500 hover:text-amber-600 font-medium inline-flex items-center"
              >
                전체 교육 일정 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
