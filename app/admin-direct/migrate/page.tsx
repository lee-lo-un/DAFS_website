"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// 항상 동적으로 렌더링되도록 설정
export const dynamic = "force-dynamic"

export default function MigrateCategoriesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    categories?: any[]
    error?: string
  } | null>(null)
  const { toast } = useToast()

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/migrate-categories", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "마이그레이션 중 오류가 발생했습니다.")
      }

      setResult(data)
      toast({
        title: "마이그레이션 성공",
        description: data.message,
      })
    } catch (error) {
      console.error("Migration error:", error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "마이그레이션 중 오류가 발생했습니다.",
      })
      toast({
        title: "마이그레이션 실패",
        description: error instanceof Error ? error.message : "마이그레이션 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>카테고리 마이그레이션</CardTitle>
          <CardDescription>
            블로그 포스트의 카테고리 데이터를 새로운 카테고리 테이블로 마이그레이션합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>주의</AlertTitle>
            <AlertDescription>
              이 작업은 새로운 카테고리 테이블을 생성하고, 기존 블로그 포스트의 카테고리 데이터를 마이그레이션합니다.
              이미 마이그레이션을 실행한 경우 다시 실행해도 안전합니다.
            </AlertDescription>
          </Alert>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "마이그레이션 성공" : "마이그레이션 실패"}</AlertTitle>
              <AlertDescription>
                {result.message || result.error}
                {result.success && result.categories && (
                  <div className="mt-2">
                    <p className="font-medium">마이그레이션된 카테고리:</p>
                    <ul className="list-disc pl-5 mt-1">
                      {result.categories.map((category, index) => (
                        <li key={index}>
                          {category.name} ({category.slug}){category.is_default && " - 기본 카테고리"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runMigration} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                마이그레이션 실행 중...
              </>
            ) : (
              "마이그레이션 실행"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
