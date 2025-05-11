import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SetupGuidePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Supabase 설정 가이드</h1>
            <p className="text-xl text-foreground/70 mb-8">Supabase 인증 설정을 올바르게 구성하는 방법을 안내합니다</p>
          </div>
        </div>
      </section>

      {/* Setup Guide Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="email">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="email">이메일 설정</TabsTrigger>
                <TabsTrigger value="google">Google 로그인</TabsTrigger>
                <TabsTrigger value="kakao">Kakao 로그인</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>이메일 인증 설정</CardTitle>
                    <CardDescription>Supabase 이메일 인증을 올바르게 설정하는 방법</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-medium">1. SMTP 설정 확인</h3>
                    <p>
                      Supabase 대시보드에서 Authentication &gt; Email Templates로 이동하여 SMTP 설정이 올바르게 구성되어
                      있는지 확인하세요.
                    </p>

                    <h3 className="text-lg font-medium mt-6">2. 이메일 템플릿 확인</h3>
                    <p>
                      이메일 템플릿이 올바르게 설정되어 있는지 확인하세요. 특히 확인 URL이 올바른 형식인지 확인하세요.
                    </p>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>{"{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email"}</code>
                    </pre>

                    <h3 className="text-lg font-medium mt-6">3. URL 설정 확인</h3>
                    <p>
                      Authentication &gt; URL Configuration에서 Site URL과 Redirect URLs가 올바르게 설정되어 있는지
                      확인하세요.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Site URL: <code>https://your-site-url.com</code>
                      </li>
                      <li>
                        Redirect URLs: <code>https://your-site-url.com/auth/callback</code>
                      </li>
                    </ul>

                    <h3 className="text-lg font-medium mt-6">4. 테스트</h3>
                    <p>
                      이메일 인증을 테스트하려면{" "}
                      <a href="/auth/test-email" className="text-primary underline">
                        이메일 테스트 페이지
                      </a>
                      를 사용하세요.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="google">
                <Card>
                  <CardHeader>
                    <CardTitle>Google 로그인 설정</CardTitle>
                    <CardDescription>Supabase에서 Google 소셜 로그인을 설정하는 방법</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-medium">1. Google Cloud Console 설정</h3>
                    <p>Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 생성하세요:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Google Cloud Console로 이동:{" "}
                        <a
                          href="https://console.cloud.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          https://console.cloud.google.com/
                        </a>
                      </li>
                      <li>API 및 서비스 &gt; 사용자 인증 정보로 이동</li>
                      <li>사용자 인증 정보 만들기 &gt; OAuth 클라이언트 ID 선택</li>
                      <li>애플리케이션 유형: 웹 애플리케이션</li>
                      <li>
                        승인된 리디렉션 URI: <code>https://your-project.supabase.co/auth/v1/callback</code>
                      </li>
                    </ul>

                    <h3 className="text-lg font-medium mt-6">2. Supabase 설정</h3>
                    <p>Supabase 대시보드에서 Authentication &gt; Providers &gt; Google로 이동하여:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Google 제공자 활성화</li>
                      <li>Google Cloud Console에서 생성한 클라이언트 ID와 클라이언트 시크릿 입력</li>
                      <li>변경 사항 저장</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-6">3. 테스트</h3>
                    <p>
                      Google 로그인을 테스트하려면{" "}
                      <a href="/auth/test-social" className="text-primary underline">
                        소셜 로그인 테스트 페이지
                      </a>
                      를 사용하세요.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kakao">
                <Card>
                  <CardHeader>
                    <CardTitle>Kakao 로그인 설정</CardTitle>
                    <CardDescription>Supabase에서 Kakao 소셜 로그인을 설정하는 방법</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-medium">1. Kakao Developers 설정</h3>
                    <p>Kakao Developers에서 애플리케이션을 생성하고 설정하세요:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Kakao Developers로 이동:{" "}
                        <a
                          href="https://developers.kakao.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          https://developers.kakao.com/
                        </a>
                      </li>
                      <li>애플리케이션 추가하기</li>
                      <li>플랫폼 &gt; Web 플랫폼 등록</li>
                      <li>
                        사이트 도메인: <code>https://your-site-url.com</code>
                      </li>
                      <li>
                        Redirect URI: <code>https://your-project.supabase.co/auth/v1/callback</code>
                      </li>
                      <li>동의항목 &gt; 필수 동의항목 설정 (프로필 정보, 카카오계정 이메일)</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-6">2. Supabase 설정</h3>
                    <p>Supabase 대시보드에서 Authentication &gt; Providers &gt; Kakao로 이동하여:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Kakao 제공자 활성화</li>
                      <li>Kakao Developers에서 생성한 REST API 키를 Client ID로 입력</li>
                      <li>Client Secret 입력 (Kakao Developers의 보안 &gt; Client Secret에서 확인)</li>
                      <li>변경 사항 저장</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-6">3. 테스트</h3>
                    <p>
                      Kakao 로그인을 테스트하려면{" "}
                      <a href="/auth/test-social" className="text-primary underline">
                        소셜 로그인 테스트 페이지
                      </a>
                      를 사용하세요.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  )
}
