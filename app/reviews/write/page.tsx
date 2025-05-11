"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function WriteReviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    productId: "",
    rating: "5",
    content: "",
  })
  const supabase = createSupabaseClient()

  // 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*").order("name")

      if (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "상품 목록 불러오기 실패",
          description: "상품 목록을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } else {
        setProducts(data || [])
      }
    }

    fetchProducts()
  }, [supabase, toast])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductChange = (value: string) => {
    setFormData((prev) => ({ ...prev, productId: value }))
  }

  const handleRatingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rating: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 폼 유효성 검사
      if (!formData.productId || !formData.rating || !formData.content.trim()) {
        toast({
          title: "입력 오류",
          description: "모든 필드를 입력해주세요.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "후기를 작성하려면 먼저 로그인해주세요.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      // 결제 내역 확인
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", formData.productId)
        .eq("status", "paid")
        .single()

      if (paymentError || !payment) {
        toast({
          title: "결제 내역이 없습니다",
          description: "해당 상품에 대한 결제 내역이 없습니다. 결제 후 후기를 작성해주세요.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        product_id: formData.productId,
        rating: Number.parseInt(formData.rating),
        content: formData.content,
      })

      if (error) {
        throw error
      }

      toast({
        title: "후기가 등록되었습니다",
        description: "성공적으로 후기가 등록되었습니다.",
      })

      router.push("/reviews")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "후기 등록 실패",
        description: "후기를 등록하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">상담 후기 작성</h1>
            <p className="text-xl text-foreground/70 mb-8">풍수 컨설팅 서비스에 대한 후기를 남겨주세요</p>
          </div>
        </div>
      </section>

      {/* Review Form Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container-width relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>후기 작성</CardTitle>
                  <CardDescription>이용하신 서비스에 대한 솔직한 후기를 남겨주세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">서비스 선택</Label>
                    <Select value={formData.productId} onValueChange={handleProductChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="서비스 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>평점</Label>
                    <RadioGroup value={formData.rating} onValueChange={handleRatingChange} className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center space-x-1">
                          <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                          <Label htmlFor={`rating-${rating}`}>{rating}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">후기 내용</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="서비스에 대한 후기를 자세히 작성해주세요"
                      className="min-h-[200px]"
                      value={formData.content}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "제출 중..." : "후기 등록하기"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
