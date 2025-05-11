import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Calendar,
  GraduationCap,
  BookMarked,
} from "lucide-react";

export default function ExpertsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-20 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">연구원 소개</h1>
            <div className="text-lg text-foreground/80 space-y-4">
              <p>
                동아풍수문화 연구원은 한국 전통 풍수지리학의 계승과 발전을
                목표로 설립되었습니다.
              </p>
              <p>
                오랜 연구와 풍부한 경험을 바탕으로 현대 사회에 맞는 풍수지리
                컨설팅을 제공하고 있습니다.
              </p>
              <p>
                우리 연구원은 풍수지리의 본질인 자연과 인간의 조화로운 공존을
                추구합니다.
              </p>
              <p>
                음택인 묘지(화장 포함), 양택인 집, 사업장(공장, 사무실, 가계)
                등에 대한 부지 선정과 현대적{" "}
                <span style={{ whiteSpace: "nowrap" }}>
                  주거 환경과 사업환경에서
                </span>{" "}
                최적의 공간 배치를 위한 전문적인 지식을 제공합니다.
              </p>
              <p>
                특히, 대중들에게 잘 알려지지 않은 명당을 발굴하고 소개함으로써
                더 많은 사람들이 자연의 기운을{" "}
                <span style={{ whiteSpace: "nowrap" }}>활용한 풍요로운 삶</span>
                을 영위할 수 있도록 노력하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Profile Section */}
      <section className="py-12 px-4 md:px-8 relative">
        {/* 배경 장식 요소 */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            원장 소개
          </h2>

          <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-gradient-to-br from-primary/10 to-transparent p-8 flex flex-col items-center justify-center">
                <div className="mb-6 ring-4 ring-primary/20 ring-offset-4 overflow-hidden rounded-lg shadow-lg">
                  {/* 일반 HTML img 태그 사용 */}
                  <img
                    src="/images/director.png"
                    alt="김성기 원장"
                    className="w-full h-auto max-w-xs mx-auto"
                  />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">
                  김성기 원장
                </h3>
                <p className="text-muted-foreground text-center text-lg mb-6">
                  대한민국 풍수지리학의 권위자
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    주거 풍수
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    사무실 풍수
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    묘지 풍수
                  </Badge>
                </div>
              </div>

              <div className="md:col-span-2 p-8">
                <CardContent className="px-0 space-y-6">
                  <div className="space-y-4">
                    <p className="text-lg">
                      김성기 원장은 25년 이상 풍수지리와 관련한 연구를 하고
                      현장에서 실천해온 전문가입니다.
                    </p>
                    <p className="text-lg">
                      풍수지리학의 이론과 실제를 해석하며 기(氣)의 흐름과 위치
                      그리고 혈(穴) 즉 명당의 크기를 정확히 찾고 기운의 세기를
                      측정하는 뛰어난 기감을 가지고 개인과 기업에 풍수 컨설팅을
                      제공하고 있습니다.
                    </p>
                    <p className="text-lg">
                      동국대학교 불교문화 대학원 풍수지리를 전공하며 전통
                      풍수지리의 깊이 있는 수련을 하였고, 현재 인제대학교
                      미래교육원에서 풍수지리학을 강의하고 있습니다.
                    </p>
                    <p className="text-lg">
                      역대 대통령과 대기업 창업주의 생가와 조상 묘에 대한 탐구로
                      풍수적 발복의 근원을 찾았습니다.
                    </p>
                    <p className="text-lg">
                      풍수지리적 해석을 통한 대통령 당선 예측을 적중 시키며,
                      광역시장과 국회의원 등의 선거사무실을 선정하여
                      당선시켰습니다.
                    </p>
                    <p className="text-lg">
                      명당에서 좋은 기운의 에너지를 받으면 건강, 재물, 명예를
                      얻는데 매우 긍정적인 영향을 미칩니다.
                    </p>
                    <p className="text-lg">
                      조상의 묘, 현재 거주하고 있는 집이나 사업장 이전 그리고
                      부동산 매매 시 명당인지 여부와 이에 대한 궁금한 사항이
                      있으면 지역에 관계없이 언제든지 편하게 연락 주시면 됩니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold flex items-center">
                        <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                        학력
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                          <div>
                            <p className="font-medium">
                              동국대학교 불교문화 대학원 풍수지리 전공
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary" />
                        현재 활동
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                          <div>
                            <p className="font-medium">
                              인제대학교 미래교육원 풍수지리학 강의
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                          <div>
                            <p className="font-medium">
                              동아풍수문화 연구원 원장
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-0 pt-6 flex flex-col items-start">
                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                    <BookMarked className="mr-2 h-5 w-5 text-primary" />
                    상담 철학
                  </h4>
                  <p className="text-foreground/80">
                    "풍수지리는 좋은 기운 즉 에너지와 관련한 것으로 자연과
                    인간의 조화로운 공존을 추구하는 학문입니다. 수천 년간 축적된
                    동양의 지혜를 현대 생활에 적용하여 실질적인 삶의 개선을
                    이끌어내는 것이 제 목표입니다. 특히, 좋은 기운의 흐름을 찾고
                    기의 흐름을 파악하며 좋은 에너지가 맺히는 정확한 위치와 기의
                    세기를 측정합니다. 이를 통해서 거주자의 건강, 재물, 명예,
                    화목, 성공을 지원하는 환경을 만들어 드립니다."
                  </p>
                </CardFooter>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-4 md:px-8 bg-muted relative overflow-hidden">
        {/* 배경 장식 요소 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              동아풍수문화 연구원의 철학
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              우리는 전통적인 풍수지리 원리를 현대적으로 재해석하여 실용적이고
              과학적인 접근법을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>자연과의 조화</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  풍수지리의 본질은 자연과 인간의 조화로운 공존입니다. 자연의
                  기운을 존중하고 활용하여 인간의 삶을 풍요롭게 하는 방법을
                  연구합니다.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>전통과 현대의 융합</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  고대의 풍수 원리를 현대 주거 환경과 라이프스타일에 맞게
                  재해석합니다. 아파트, 오피스텔 등 현대 건축물에 적합한 풍수
                  원리를 적용하여 실용적인 솔루션을 제공합니다.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>맞춤형 컨설팅</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  각 공간과 개인의 특성을 고려한 맞춤형 솔루션을 제공합니다.
                  획일화된 접근이 아닌, 개인의 라이프스타일과 공간의 목적에 맞는
                  최적의 방안을 제시합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5" />

        <div className="container-width relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            전문가와 상담하세요
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-4">
            동아풍수문화 연구원의 전문가가 집(양택)인 주거지, 묘(음택),
            사업장(공장, 사무실, 가게) 등에 정확한 기운의 흐름과 혈이 맺힌 명당
            여부를 확인하고, 좋은 기운을 불어 넣을 수 있는 방안을 제시합니다.
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <span className="inline-block font-bold text-yellow-300 text-lg">
              휴대폰 <span className="underline">010-4135-9319</span> 또는
              카카오톡으로 상담을 신청하고 더 나은 삶을 경험하세요.
            </span>
          </div>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-full group"
          >
            <Link href="/contact">
              상담 신청하기
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
