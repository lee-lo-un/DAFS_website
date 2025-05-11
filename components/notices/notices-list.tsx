"use client"

import Link from "next/link"
import { PinIcon } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from "next/navigation"
import { formatDate } from "@/lib/utils"

type Notice = {
  id: number
  title: string
  published_at: string
  author_id: string
  profiles: {
    email: string
  } | null
}

interface NoticesListProps {
  pinnedNotices: Notice[]
  notices: Notice[]
  currentPage: number
  perPage: number
  totalCount: number
}

export default function NoticesList({ pinnedNotices, notices, currentPage, perPage, totalCount }: NoticesListProps) {
  const router = useRouter()
  const pathname = usePathname()

  const totalPages = Math.ceil(totalCount / perPage)

  const handlePageChange = (page: number) => {
    router.push(`${pathname}?page=${page}&per_page=${perPage}`)
  }

  const handlePerPageChange = (value: string) => {
    router.push(`${pathname}?page=1&per_page=${value}`)
  }

  return (
    <div className="space-y-6">
      {/* 고정된 공지사항 */}
      {pinnedNotices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">중요 공지</h2>
          <div className="bg-muted/50 rounded-lg divide-y">
            {pinnedNotices.map((notice) => (
              <div key={notice.id} className="p-4 flex items-start">
                <PinIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <Link
                    href={`/notices/${notice.id}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {notice.title}
                  </Link>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center space-x-2">
                    <span>{formatDate(notice.published_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일반 공지사항 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">공지사항</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">표시:</span>
            <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={perPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {notices.length > 0 ? (
          <div className="bg-card rounded-lg divide-y">
            {notices.map((notice) => (
              <div key={notice.id} className="p-4">
                <Link
                  href={`/notices/${notice.id}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {notice.title}
                </Link>
                <div className="text-sm text-muted-foreground mt-1 flex items-center space-x-2">
                  <span>{formatDate(notice.published_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg p-8 text-center text-muted-foreground">공지사항이 없습니다.</div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(currentPage - 1)
                      }}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(currentPage + 1)
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
