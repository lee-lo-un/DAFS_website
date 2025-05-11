"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { Search, Eye, Trash2, Star } from "lucide-react"

interface Review {
  id: string
  rating: number
  content: string
  created_at: string
  user_id: string
  product_id: string
  products: {
    name: string
  } | null
  profiles: {
    email: string
    full_name: string | null
  } | null
}

interface ReviewManagementProps {
  reviews?: Review[]
}

export default function ReviewManagement({ reviews = [] }: ReviewManagementProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [reviewsState, setReviews] = useState<Review[]>(reviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)

  // 검색 필터링
  const filteredReviews = reviewsState.filter(
    (review) =>
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.profiles?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (review.profiles?.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (review.products?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  // 상세 보기 다이얼로그 열기
  const openViewDialog = (review: Review) => {
    setSelectedReview(review)
    setShowViewDialog(true)
  }

  // 삭제 다이얼로그 열기
  const openDeleteDialog = (reviewId: string) => {
    setReviewToDelete(reviewId)
    setShowDeleteDialog(true)
  }

  // 리뷰 삭제 함수를 수정합니다
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return

    setIsSubmitting(true)

    try {
      const supabase = createSupabaseClient()
      console.log("Deleting review with ID:", reviewToDelete)

      // 리뷰 삭제
      const { error } = await supabase.from("reviews").delete().eq("id", reviewToDelete)

      if (error) {
        console.error("Error deleting review:", error)
        throw error
      }

      toast({
        title: "리뷰 삭제 성공",
        description: "리뷰가 성공적으로 삭제되었습니다.",
      })

      // 리뷰 목록 업데이트
      setReviews(reviewsState.filter((r) => r.id !== reviewToDelete))
      setReviewToDelete(null)
      setShowDeleteDialog(false)

      // 페이지 새로고침
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting review:", error)
      toast({
        title: "리뷰 삭제 실패",
        description: error.message || "리뷰를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* 검색 필드 */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="내용, 이메일, 이름 또는 서비스로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 리뷰 테이블 */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>평점</TableHead>
              <TableHead>서비스</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{review.products?.name || "풍수 컨설팅"}</TableCell>
                  <TableCell>{review.profiles?.full_name || review.profiles?.email || "익명"}</TableCell>
                  <TableCell>{formatDate(new Date(review.created_at))}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openViewDialog(review)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(review.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {searchTerm ? "검색 결과가 없습니다." : "등록된 리뷰가 없습니다."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 상세 보기 다이얼로그 */}
      {selectedReview && (
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>리뷰 상세 정보</DialogTitle>
              <DialogDescription>
                {selectedReview.products?.name || "풍수 컨설팅"} | {formatDate(new Date(selectedReview.created_at))}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <p className="font-medium">평점:</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < selectedReview.rating ? "fill-accent text-accent" : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium">작성자:</p>
                <p>
                  {selectedReview.profiles?.full_name || "익명"} ({selectedReview.profiles?.email || "이메일 없음"})
                </p>
              </div>
              <div>
                <p className="font-medium">내용:</p>
                <p className="whitespace-pre-wrap">{selectedReview.content}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReviewToDelete(null)}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
