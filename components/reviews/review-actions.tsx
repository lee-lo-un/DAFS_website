"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { isWithin24Hours } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EditReviewForm from "./edit-review-form"

interface ReviewActionsProps {
  review: {
    id: string
    rating: number
    content: string
    created_at: string
    product_id: string
  }
}

export default function ReviewActions({ review }: ReviewActionsProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 후기가 24시간 이내에 작성되었는지 확인
  const canEdit = isWithin24Hours(new Date(review.created_at))

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="px-2"
          disabled={!canEdit}
          title={canEdit ? "후기 수정하기" : "후기는 작성 후 24시간 이내에만 수정 가능합니다"}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>후기 수정</DialogTitle>
          <DialogDescription>후기는 작성 후 24시간 이내에만 수정 가능합니다.</DialogDescription>
        </DialogHeader>
        <EditReviewForm
          review={review}
          onSuccess={() => {
            setIsDialogOpen(false)
            router.refresh()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
