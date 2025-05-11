import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// formatDate 함수를 수정하여 유효하지 않은 날짜 값을 처리하도록 합니다.
export function formatDate(dateInput: string | Date | null): string {
  if (!dateInput) return "날짜 없음"

  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return "유효하지 않은 날짜"
    }

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  } catch (error) {
    console.error("날짜 형식 오류:", error)
    return "유효하지 않은 날짜"
  }
}

// formatDateTime 함수도 같은 방식으로 수정
export function formatDateTime(dateInput: string | Date | null): string {
  if (!dateInput) return "날짜 없음"

  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return "유효하지 않은 날짜"
    }

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    console.error("날짜 형식 오류:", error)
    return "유효하지 않은 날짜"
  }
}

// HTML 태그 제거 함수
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

// 텍스트 길이 제한 함수
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Supabase 스토리지 URL에서 경로 추출 함수
export function extractStoragePathFromUrl(url: string): { bucket: string; filePath: string } | null {
  const regex = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/
  const match = url.match(regex)
  if (!match) {
    console.warn("유효하지 않은 Supabase 이미지 URL입니다:", url)
    return null
  }

  const bucket = match[1] // 예: "images"
  const filePath = match[2] // 예: "blog/filename.jpg"

  return { bucket, filePath }
}

export function isWithin24Hours(date: Date): boolean {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = diff / (1000 * 60 * 60)
  return hours <= 24
}
