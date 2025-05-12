export const dynamic = "force-dynamic";

import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Home,
  Building2,
  Landmark,
  Check,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function ServicesPage() {
  // 블로그 포스트 가져오기
  const supabase = createServerComponentClient({ cookies });
  const { data: blogPosts, error } = await supabase
    .from("blog_posts")
    .select("id, title, tags")
    .order("published_at", { ascending: false })
    .limit(3);

  // 서비스별 관련 블로그 포스트 필터링
  const residentialPosts =
    blogPosts?.filter(
      (post) =>
        post.tags &&
        post.tags.some((tag) => ["주거", "주택", "아파트", "집"].includes(tag))
    ) || [];

  const officePosts =
    blogPosts?.filter(
      (post) =>
        post.tags &&
        post.tags.some((tag) =>
          ["사무실", "사업장", "상업공간", "오피스"].includes(tag)
        )
    ) || [];

  const gravePosts =
    blogPosts?.filter(
      (post) =>
        post.tags &&
        post.tags.some((tag) => ["묘지", "묫자리", "명당"].includes(tag))
    ) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="container-width">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              맞춤형 풍수 컨설팅 서비스
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              공간의 목적과 특성에 맞는 전문적인 풍수 컨설팅으로 최적의 에너지
              흐름을 만들어 드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16 px-4 md:px-8">
        <div className="container-width">
          <Tabs defaultValue="residential" className="w-full">
            <TabsList className="h-14 items-center justify-center text-muted-foreground grid w-full grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg">
              <TabsTrigger
                value="residential"
                className="py-3.5 px-4 w-full flex items-center justify-center data-[state=active]:bg-amber-500 data-[state=active]:text-white dark:data-[state=active]:bg-amber-600 dark:data-[state=active]:text-white font-medium rounded-md"
              >
                <Home className="mr-2 h-5 w-5" />
                주거 풍수
              </TabsTrigger>
              <TabsTrigger
                value="office"
                className="py-3.5 px-4 w-full flex items-center justify-center data-[state=active]:bg-amber-500 data-[state=active]:text-white dark:data-[state=active]:bg-amber-600 dark:data-[state=active]:text-white font-medium rounded-md"
              >
                <Building2 className="mr-2 h-5 w-5" />
                사무실 풍수
              </TabsTrigger>
              <TabsTrigger
                value="grave"
                className="py-3.5 px-4 w-full flex items-center justify-center data-[state=active]:bg-amber-500 data-[state=active]:text-white dark:data-[state=active]:bg-amber-600 dark:data-[state=active]:text-white font-medium rounded-md"
              >
                <Landmark className="mr-2 h-4 w-4" />
                묘지 풍수
              </TabsTrigger>
            </TabsList>

            {/* 주거 풍수 */}
            <TabsContent value="residential">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800/90 p-6 rounded-lg shadow-md border border-transparent dark:border-amber-600/30 dark:bg-gradient-to-br dark:from-gray-800 dark:to-amber-950/20">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white">
                    주거 풍수 컨설팅
                  </h2>
                  <p className="text-foreground/70 dark:text-gray-300 mb-6">
                    아파트, 주택 등 주거공간의 풍수 분석을 통해 가족의 건강과
                    행복을 증진시키는 최적의 공간을 만들어 드립니다. 현대적인
                    주거 환경에 맞는 실용적인 풍수 솔루션을 제공합니다.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>주거 공간 전체 구조 및 배치 분석</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>가족 구성원별 방향성 및 침실 배치 조언</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>가구 배치 및 인테리어 색상 제안</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>에너지 흐름 개선을 위한 실천 방안 제시</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>주거 환경 개선을 위한 맞춤형 솔루션</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <Link href="/contact">
                        상담 신청하기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/blog?tag=주거">
                        <BookOpen className="mr-2 h-4 w-4" />
                        관련 사례 보기
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="주거 풍수 컨설팅"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {residentialPosts.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-white">
                    주거 풍수 관련 블로그
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {residentialPosts.map((post) => (
                      <Card
                        key={post.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <CardTitle className="line-clamp-2 text-lg">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Button asChild variant="ghost" className="w-full">
                            <Link href={`/blog/${post.id}`}>자세히 보기</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* 사무실 풍수 */}
            <TabsContent value="office">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800/90 p-6 rounded-lg shadow-md border border-transparent dark:border-blue-600/30 dark:bg-gradient-to-br dark:from-gray-800 dark:to-blue-950/20">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white">
                    사무실 풍수 컨설팅
                  </h2>
                  <p className="text-foreground/70 dark:text-gray-300 mb-6">
                    사업장, 오피스 공간의 풍수 분석을 통해 비즈니스 성공과
                    직원들의 생산성을 높이는 최적의 환경을 조성합니다. 업종별
                    특성을 고려한 맞춤형 풍수 솔루션을 제공합니다.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>사업장 위치 및 전체 구조 분석</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>업종별 최적 배치 및 동선 설계</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>경영자 및 직원 자리 배치 조언</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>비즈니스 성장을 위한 색상 및 인테리어 제안</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>
                        고객 유입 및 직원 생산성 향상을 위한 환경 조성
                      </span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <Link href="/contact">
                        상담 신청하기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/blog?tag=사무실">
                        <BookOpen className="mr-2 h-4 w-4" />
                        관련 사례 보기
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="사무실 풍수 컨설팅"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {officePosts.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-white">
                    사무실 풍수 관련 블로그
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {officePosts.map((post) => (
                      <Card
                        key={post.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <CardTitle className="line-clamp-2 text-lg">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Button asChild variant="ghost" className="w-full">
                            <Link href={`/blog/${post.id}`}>자세히 보기</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* 묘지 풍수 */}
            <TabsContent value="grave">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800/90 p-6 rounded-lg shadow-md border border-transparent dark:border-green-600/30 dark:bg-gradient-to-br dark:from-gray-800 dark:to-green-950/20">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white">
                    묘지 풍수 컨설팅
                  </h2>
                  <p className="text-foreground/70 dark:text-gray-300 mb-6">
                    전통적인 묘지 터 상담과 현대적 해석을 통해 최적의 장소를
                    선정해 드립니다. 고전 풍수 이론과 현대적 환경 요소를 모두
                    고려한 균형 잡힌 접근법을 제공합니다.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>묘지 터 분석 및 최적 위치 선정</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>주변 환경 및 지형 분석</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>현대적 관점의 풍수 해석 제공</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>가족 운세와의 연관성 분석</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>장기적 관점의 입지 분석 및 조언</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <Link href="/contact">
                        상담 신청하기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/blog?tag=묘지">
                        <BookOpen className="mr-2 h-4 w-4" />
                        관련 사례 보기
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="묘지 풍수 컨설팅"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {gravePosts.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-white">
                    묘지 풍수 관련 블로그
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {gravePosts.map((post) => (
                      <Card
                        key={post.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <CardTitle className="line-clamp-2 text-lg">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Button asChild variant="ghost" className="w-full">
                            <Link href={`/blog/${post.id}`}>자세히 보기</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-background to-muted/50">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-white">
              풍수 컨설팅 사례
            </h2>
            <p className="text-foreground/70 dark:text-gray-300 max-w-2xl mx-auto">
              모던 풍수의 실제 컨설팅 사례를 통해 어떤 변화가 있었는지
              확인해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 주거 풍수 사례 */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-primary/10">
              <div className="h-48 overflow-hidden">
                <img
                  src="/placeholder.svg?height=200&width=400&text=주거 풍수 사례"
                  alt="주거 풍수 사례"
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>아파트 풍수 개선 사례</CardTitle>
                <CardDescription>강남구 아파트 풍수 컨설팅</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  가족 구성원의 건강 문제로 상담을 요청한 고객님의 아파트 풍수를
                  분석하고 개선한 사례입니다. 침실 배치와 색상 조정을 통해
                  에너지 흐름을 개선했습니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blog?tag=주거">사례 더 보기</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* 사무실 풍수 사례 */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-primary/10">
              <div className="h-48 overflow-hidden">
                <img
                  src="/placeholder.svg?height=200&width=400&text=사무실 풍수 사례"
                  alt="사무실 풍수 사례"
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>스타트업 사무실 풍수 컨설팅</CardTitle>
                <CardDescription>성수동 IT 스타트업 사례</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  투자 유치와 팀 확장을 앞둔 스타트업의 사무실 풍수를 개선한
                  사례입니다. 경영진 자리 배치와 회의실 구조 변경을 통해
                  의사결정 효율성을 높였습니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blog?tag=사무실">사례 더 보기</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* 묘지 풍수 사례 */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-primary/10">
              <div className="h-48 overflow-hidden">
                <img
                  src="/placeholder.svg?height=200&width=400&text=묘지 풍수 사례"
                  alt="묘지 풍수 사례"
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>가족 선산 풍수 분석</CardTitle>
                <CardDescription>경기도 양평 묘지 풍수 컨설팅</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  3대째 내려오는 가족 선산의 풍수를 현대적 관점에서 재해석하고
                  개선 방안을 제시한 사례입니다. 주변 환경 변화에 따른 풍수적
                  영향을 분석했습니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blog?tag=묘지">사례 더 보기</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Link href="/blog">모든 사례 블로그 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 md:px-8 bg-muted">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground dark:text-white">
              상담 비용 안내
            </h2>
            <p className="text-foreground/70 dark:text-gray-300 max-w-2xl mx-auto">
              다양한 니즈에 맞춤 합리적인 상담 패키지를 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 기본 문의 및 출장 */}
            <Card className="border-2 border-border hover:border-primary/30 transition-all duration-300 p-6">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  기본 문의 및 출장
                </h3>
              </div>

              <div className="mb-6">
                <div className="font-bold mb-2">
                  <p>● 고객의 상황에 대한 기본적인 사항과</p>
                  <p className="ml-3">서비스가 필요한 내용 확인 및 출장</p>
                </div>

                <div className="ml-4 mb-4">
                  <p className="mb-1">
                    ▶ 간단한 전화 상담
                    <span className="text-blue-600 font-medium">(무료)</span>
                  </p>
                  <p className="mb-1">
                    ▶ 현장 환경을 위한 출장비
                    <span className="text-blue-600 font-medium">
                      (실비 수준)
                    </span>
                  </p>
                  <p className="mb-1">* 교통비, 식비, 숙박비 등</p>
                  <p className="mb-1">▶ 현장 탑색, 분석, 현황 설명, 방안제시</p>
                  <p className="mb-1">
                    - 소요 시간{" "}
                    <span className="text-blue-600 font-medium">1시간</span>{" "}
                    이내:{" "}
                    <span className="text-blue-600 font-medium">150,000원</span>
                  </p>
                  <p className="mb-1">
                    - 소요 시간{" "}
                    <span className="text-blue-600 font-medium">2시간</span>{" "}
                    이내:{" "}
                    <span className="text-blue-600 font-medium">300,000원</span>
                  </p>
                </div>

                <p className="text-sm">→ 비용: 무료 또는 출장비 + 소요시간별</p>
              </div>
            </Card>

            {/* 프리미엄 상담 */}
            <Card className="border-2 border-primary shadow-lg hover:shadow-primary/20 transition-all duration-300 p-6 relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                인기
              </div>

              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  프리미엄 상담
                </h3>
              </div>

              <div className="mb-6">
                <div className="font-bold mb-2">
                  <p>● 고객의 집, 묘, 사업장 등 종합적인 사항에</p>
                  <p className="ml-3">대한 서비스 내용 확인 및 출장</p>
                </div>

                <div className="ml-4 mb-4">
                  <p className="mb-1">
                    ▶ 간단한 전화 상담
                    <span className="text-blue-600 font-medium">(무료)</span>
                  </p>
                  <p className="mb-1">
                    ▶ 현장 환경을 위한 출장비
                    <span className="text-blue-600 font-medium">
                      (실비 수준)
                    </span>
                  </p>
                  <p className="mb-1">* 교통비, 식비, 숙박비 등</p>
                  <p className="mb-1">▶ 현장 탑색, 분석, 현황 설명, 방안제시</p>
                  <p className="mb-1">
                    - 소요 시간{" "}
                    <span className="text-blue-600 font-medium">3시간</span>{" "}
                    이내:{" "}
                    <span className="text-blue-600 font-medium">500,000원</span>
                  </p>
                  <p className="mb-1">
                    - 소요 시간{" "}
                    <span className="text-blue-600 font-medium">4시간</span>{" "}
                    이내:{" "}
                    <span className="text-blue-600 font-medium">600,000원</span>
                  </p>
                  <p className="mb-1">
                    - 소요 시간{" "}
                    <span className="text-blue-600 font-medium">5시간</span>{" "}
                    이내:{" "}
                    <span className="text-blue-600 font-medium">700,000원</span>
                  </p>
                  <p className="mb-1">
                    - 소요 시간{" "}
                    <span className="text-blue-600 font-medium">6시간</span>{" "}
                    이내:{" "}
                    <span className="text-blue-600 font-medium">800,000원</span>
                  </p>
                </div>

                <p className="text-sm">→ 비용: 무료 또는 출장비 + 소요시간별</p>
              </div>
            </Card>

            {/* VIP 상담 */}
            <Card className="border-2 border-border hover:border-primary/30 transition-all duration-300 p-6">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  VIP 상담
                </h3>
              </div>

              <div className="mb-6">
                <div className="font-bold mb-2">
                  <p>● 고객의 집/묘/사업장 등 종합적인 판단과</p>
                  <p className="ml-3 text-blue-600 font-medium">
                    명당 발굴 및 점혈
                  </p>
                </div>

                <div className="ml-4 mb-4">
                  <p className="mb-1">▶ 수요 발생 시 수시 상담 및 자문</p>
                  <p className="mb-1">▶ 단체 및 기관 특강, 세미나</p>
                  <p className="mb-1">▶ 장거리 1일 이상 소요 출장 필요</p>
                </div>

                <p className="text-sm">
                  → 비용:{" "}
                  <span className="text-blue-600 font-medium">상호 협의</span>
                </p>
              </div>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">
                상담 신청하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-white">
              상담 진행 과정
            </h2>
            <p className="text-foreground/70 dark:text-gray-300 max-w-2xl mx-auto">
              동아풍수의 체계적인 상담 프로세스를 통해 최적의 솔루션을
              제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">상담 신청</h3>
              <p className="text-foreground/70">
                전화 또는 웹사이트를 통해 상담 신청
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">일정 조율</h3>
              <p className="text-foreground/70">상담 일정과 세부 사항을 조율</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">현장 조사 및 분석</h3>
              <p className="text-foreground/70">
                일정에 맞춰 방문 또는 현장 조사 진행
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">솔루션 및 결과보고</h3>
              <p className="text-foreground/70">
                상담 결과와 개선 방안이 담긴 맞춤형 솔루션 제공
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-primary text-primary-foreground">
        <div className="container-width text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
            지금 바로 상담을 신청하세요
          </h2>
          <p className="text-primary-foreground max-w-2xl mx-auto mb-8">
            동아풍수는 당신의 공간에 최적의 에너지를 불어넣어 드립니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full"
            >
              <Link href="/contact">
                상담 신청하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link href="/faq">자주 묻는 질문</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
