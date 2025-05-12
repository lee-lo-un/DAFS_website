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
      <section className="pt-12 pb-0 px-4 md:px-8">
        <div className="container-width mx-auto">
          {/* 풍수지리 교육 프로그램 제목 영역 */}
          <div className="mb-16 relative">
            <div className="w-2/5 mx-auto bg-yellow-400 py-3 mb-0 text-center border-2 border-black rounded-lg relative z-10 transform translate-y-6">
              <h1 className="text-4xl font-bold">풍수지리 교육 프로그램</h1>
            </div>
            <div className="bg-green-500 py-16 px-4 text-center relative overflow-hidden -mt-3">
              <div className="absolute left-10 top-1/2 -translate-y-1/2">
                <div className="border-8 border-yellow-400 rounded-full p-6 bg-green-500 w-56 h-56 flex flex-col items-center justify-center">
                  <div className="text-red-600 font-bold flex flex-col items-center space-y-1">
                    <span className="text-5xl">명당</span>
                    <span className="text-[2.1rem]">쪽 집게</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-16 h-16 mr-2 border-2 border-gray-800 rounded-full p-1 bg-white flex-shrink-0">
                    <img
                      src="/images/injea-logo.png"
                      alt="인제대학교"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-5xl font-bold text-black mb-0">
                    인제대학교 미래교육원
                  </h2>
                </div>
                <h3 className="text-6xl font-bold text-red-600 mb-4">
                  氣 실전 풍수지리
                </h3>
                <p className="text-5xl font-bold">문의 : 010-4135-9319</p>
              </div>

              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="border-8 border-yellow-400 rounded-full p-6 bg-green-500 w-56 h-56 flex flex-col items-center justify-center">
                  <div className="text-red-600 font-bold text-[1.9rem] flex flex-col items-center space-y-1">
                    <span>묘, 집, 공장,</span>
                    <span>사무실 등</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 정규 과정 */}
          <h2 className="text-3xl font-bold text-center mb-8">
            정규 과정
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 mt-8">
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

                <div className="mb-6 flex-grow">
                  <p className="whitespace-pre-line mb-4">{course.description}</p>
                  
                  {course.curriculum && (
                    <div className="mb-4">
                      <p className="whitespace-pre-line">{course.curriculum}</p>
                    </div>
                  )}
                  
                  {course.time && (
                    <div className="mb-2">
                      <p>▶ 교육시간: {course.time}</p>
                    </div>
                  )}
                  
                  {course.target_audience && (
                    <div className="mb-2">
                      <p>▶ 교육대상: {course.target_audience}</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {course.start_date && formatDate(course.start_date)}
                      {course.end_date && ` ~ ${formatDate(course.end_date)}`}
                    </div>
                    <div className="text-amber-600 font-bold">
                      {course.price === 0 ? "무료" : `${course.price.toLocaleString()}원`}
                    </div>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="block w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md text-center transition-colors"
                  >
                    자세히 보기
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 특별 세미나 및 워크샵 */}
          <h2 className="text-3xl font-bold text-center mb-8">
            특별 세미나 및 워크샵
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {seminars.map((course) => (
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

                <div className="mb-6 flex-grow">
                  <p className="whitespace-pre-line mb-4">{course.description}</p>
                  
                  {course.curriculum && (
                    <div className="mb-4">
                      <h4 className="font-bold mb-2">세미나 및 특강제목(예시)</h4>
                      <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">
                        {course.curriculum}
                      </p>
                    </div>
                  )}
                  
                  {course.time && (
                    <div className="mb-2">
                      <p>▶ 교육시간: {course.time}</p>
                    </div>
                  )}
                  
                  {course.target_audience && (
                    <div className="mb-2">
                      <p>▶ 교육대상: {course.target_audience}</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {course.start_date && formatDate(course.start_date)}
                      {course.end_date && ` ~ ${formatDate(course.end_date)}`}
                    </div>
                    <div className="text-amber-600 font-bold">
                      {course.price === 0 ? "무료" : `${course.price.toLocaleString()}원`}
                    </div>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="block w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md text-center transition-colors"
                  >
                    자세히 보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
