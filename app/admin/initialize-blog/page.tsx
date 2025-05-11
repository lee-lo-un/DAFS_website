"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function InitializeBlogPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    categories?: number
    posts?: number
  } | null>(null)

  const initializeBlog = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/admin/initialize-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "블로그 초기화 중 오류가 발생했습니다.")
      }

      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "블로그 초기화 중 오류가 발생했습니다.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">블로그 데이터 초기화</h1>

        <Card>
          <CardHeader>
            <CardTitle>블로그 초기화</CardTitle>
            <CardDescription>
              카테고리와 샘플 블로그 포스트를 생성합니다. 기존 데이터가 없는 경우에만 생성됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              이 기능은 블로그 데이터가 없을 때 기본 카테고리와 샘플 포스트를 생성합니다. 기존 데이터는 변경되지
              않습니다.
            </p>

            {result && (
              <Alert
                className={`mt-4 ${
                  result.success
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle>{result.success ? "초기화 성공" : "초기화 실패"}</AlertTitle>
                <AlertDescription>
                  {result.success
                    ? `${result.message} (카테고��: ${result.categories}개, 포스트: ${result.posts}개)`
                    : result.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={initializeBlog} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 초기화 중...
                </>
              ) : (
                "블로그 데이터 초기화"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
