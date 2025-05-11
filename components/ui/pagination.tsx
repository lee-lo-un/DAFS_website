"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PaginationContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-full items-center justify-center", className)} {...props} />
  ),
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "h-8 w-8 p-0 border-input bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  ),
)
PaginationItem.displayName = "PaginationItem"

const PaginationLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <Link ref={ref} className={cn(buttonVariants({ variant: "outline", size: "icon" }), className)} {...props} />
  ),
)
PaginationLink.displayName = "PaginationLink"

const PaginationNext = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <Link ref={ref} className={cn(buttonVariants({ variant: "outline", size: "icon" }), className)} {...props}>
      <span className="sr-only">Go to next page</span>
      <ChevronRight className="h-4 w-4" />
    </Link>
  ),
)
PaginationNext.displayName = "PaginationNext"

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <Link ref={ref} className={cn(buttonVariants({ variant: "outline", size: "icon" }), className)} {...props}>
      <span className="sr-only">Go to previous page</span>
      <ChevronLeft className="h-4 w-4" />
    </Link>
  ),
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("h-8 w-8 text-center [&:not([hidden])]:inline-flex", className)} {...props}>
      &hellip;
    </span>
  ),
)
PaginationEllipsis.displayName = "PaginationEllipsis"

interface PaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  totalItems: number
  baseUrl: string
  onPerPageChange?: (value: string) => void
}

export function Pagination({
  currentPage,
  totalPages,
  perPage,
  totalItems,
  baseUrl,
  onPerPageChange,
}: PaginationProps) {
  // 페이지 번호 생성 (최대 5개)
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // 전체 페이지가 5개 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // 전체 페이지가 5개 초과면 현재 페이지 주변 페이지만 표시
      let startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

      // 끝 페이지가 최대값에 도달하면 시작 페이지 조정
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers
  }

  // 페이지 URL 생성
  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, "http://localhost")
    const params = new URLSearchParams(url.search)

    if (page > 1) {
      params.set("page", page.toString())
    } else {
      params.delete("page")
    }

    if (perPage !== 6) {
      params.set("per_page", perPage.toString())
    }

    const queryString = params.toString()
    return `${url.pathname}${queryString ? `?${queryString}` : ""}`
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm text-muted-foreground">
          전체 {totalItems}개 중 {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, totalItems)}개 표시
        </div>

        {onPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">표시 개수:</span>
            <Select value={perPage.toString()} onValueChange={onPerPageChange}>
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue placeholder="6" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-1">
        {currentPage > 1 && <PaginationPrevious href={getPageUrl(currentPage - 1)} />}

        {getPageNumbers().map((page) => (
          <PaginationLink
            key={page}
            href={getPageUrl(page)}
            className={cn("h-8 w-8", page === currentPage && "bg-primary text-primary-foreground hover:bg-primary/90")}
          >
            {page}
          </PaginationLink>
        ))}

        {currentPage < totalPages && <PaginationNext href={getPageUrl(currentPage + 1)} />}
      </nav>
    </div>
  )
}

export { PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext }
