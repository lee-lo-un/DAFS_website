"use client"

import { useState } from "react"
import { createSupabaseClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function TestSocialLoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  const handleSocialLogin = async (providerName: "google" | "kakao") => {
    setIsLoading(true)
    setProvider(providerName)

    try {
      // 리디렉션 방식으로 소셜 로그인 시도
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerName,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false, // 브라우저 리디렉션 활성화
        },
      })

      if (error) {
        throw error
      }

      // 리디렉션 방식에서는 이 코드가 실행되지 않음 (페이지가 이미 리디렉션됨)
    } catch (error: any) {
      toast({
        title: "소셜 로그인 실패",
        description: error.message || `${providerName} 로그인 중 오류가 발생했습니다.`,
        variant: "destructive",
      })
      setIsLoading(false)
      setProvider(null)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />

        <div className="container-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">소셜 로그인 테스트</h1>
            <p className="text-xl text-foreground/70 mb-8">Supabase 소셜 로그인 설정을 테스트합니다</p>
          </div>
        </div>
      </section>

      {/* Test Social Login Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-md mx-auto">
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>리디렉션 방식 사용</AlertTitle>
              <AlertDescription>이 테스트는 팝업 대신 리디렉션 방식을 사용하여 CSP 제한을 우회합니다.</AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>소셜 로그인 테스트</CardTitle>
                <CardDescription>
                  아래 버튼을 클릭하여 소셜 로그인 설정이 올바르게 작동하는지 테스트하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                    className="flex items-center justify-center"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {provider === "google" && isLoading ? "리디렉션 중..." : "Google 로그인"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin("kakao")}
                    disabled={isLoading}
                    className="bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 border-[#FEE500] flex items-center justify-center"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2.5C6.201 2.5 1.5 6.253 1.5 10.893C1.5 13.81 3.411 16.37 6.252 17.863L5.106 21.196C5.021 21.455 5.311 21.663 5.537 21.515L9.639 18.86C10.399 18.99 11.19 19.06 12 19.06C17.799 19.06 22.5 15.307 22.5 10.667C22.5 6.253 17.799 2.5 12 2.5Z"
                        fill="currentColor"
                      />
                    </svg>
                    {provider === "kakao" && isLoading ? "리디렉션 중..." : "Kakao 로그인"}
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  소셜 로그인 버튼을 클릭하면 해당 제공자의 로그인 페이지로 리디렉션됩니다.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
