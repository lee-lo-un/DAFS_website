// 정적 렌더링 비활성화
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  BadgeIcon,
  ChevronLeft,
} from "lucide-react";
import CourseApplicationForm from "@/components/courses/course-application-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CoursePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const parameters = await params;
  const supabase = await createSupabaseServer();
  const { data: course } = await supabase
    .from("fengshui_courses")
    .select("*")
    .eq("id", parameters.id)
    .single();

  if (!course) {
    return {
      title: "교육 과정을 찾을 수 없습니다 | 모던 풍수",
      description: "요청하신 교육 과정을 찾을 수 없습니다.",
    };
  }

  return {
    title: `${course.title} | 모던 풍수 교육`,
    description:
      course.description?.substring(0, 160) || "모던 풍수의 교육 과정입니다.",
  };
}

async function getCourse(id: string) {
  const supabase = await createSupabaseServer();
  const { data: course, error } = await supabase
    .from("fengshui_courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !course) {
    console.error("Error fetching course:", error);
    return null;
  }

  return course;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CoursePage({ params }: CoursePageProps) {
  const parameters = await params;
  const course = await getCourse(parameters.id);

  if (!course) {
    notFound();
  }

  // 신청 가능 여부 확인
  const isAvailable =
    course.is_active &&
    (course.max_attendees === null ||
      course.current_attendees < course.max_attendees);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <section className="py-12 px-4 md:px-8">
        <div className="container-width mx-auto">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/courses" className="flex items-center">
                <ChevronLeft className="mr-1 h-4 w-4" />
                교육안내 목록으로
              </Link>
            </Button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-8 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {course.title}
                  </h1>
                  <div className="flex items-center">
                    <BadgeIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{course.category}</span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  {isAvailable ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      신청 가능
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      마감
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 본문 */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 왼쪽: 과정 정보 */}
                <div className="md:col-span-2">
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">
                      과정 소개
                    </h2>
                    <p className="whitespace-pre-line">{course.description}</p>
                  </div>

                  {course.curriculum && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold mb-4 border-b pb-2">
                        커리큘럼
                      </h2>
                      <div className="whitespace-pre-line">
                        {course.curriculum}
                      </div>
                    </div>
                  )}

                  {course.target_audience && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold mb-4 border-b pb-2">
                        교육 대상
                      </h2>
                      <p className="whitespace-pre-line">
                        {course.target_audience}
                      </p>
                    </div>
                  )}
                </div>

                {/* 오른쪽: 신청 정보 */}
                <div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">교육 정보</h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CalendarIcon className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                        <div>
                          <div className="font-medium">교육 기간</div>
                          <div>
                            {formatDate(course.start_date)}
                            {course.end_date &&
                              ` ~ ${formatDate(course.end_date)}`}
                          </div>
                        </div>
                      </div>

                      {course.time && (
                        <div className="flex items-start">
                          <ClockIcon className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                          <div>
                            <div className="font-medium">교육 시간</div>
                            <div>{course.time}</div>
                          </div>
                        </div>
                      )}

                      {course.location && (
                        <div className="flex items-start">
                          <MapPinIcon className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                          <div>
                            <div className="font-medium">교육 장소</div>
                            <div>{course.location}</div>
                          </div>
                        </div>
                      )}

                      {course.max_attendees && (
                        <div className="flex items-start">
                          <UsersIcon className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                          <div>
                            <div className="font-medium">수강 인원</div>
                            <div>
                              {course.current_attendees}/{course.max_attendees}
                              명
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <div className="font-medium mb-1">수강료</div>
                        <div className="text-xl font-bold text-amber-600">
                          {course.price === 0
                            ? "무료"
                            : `${course.price.toLocaleString()}원`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 신청 폼 */}
                  <div className="mt-6">
                    <CourseApplicationForm
                      courseId={course.id}
                      isAvailable={isAvailable}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
