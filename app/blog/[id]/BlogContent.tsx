"use client"

import { useEffect, useRef } from "react"

// 마크다운 이미지 태그를 HTML로 변환하는 함수
function convertMarkdownImages(content: string): string {
  // ![텍스트](URL) 형식의 마크다운 이미지 태그를 찾아 <img> 태그로 변환
  // 괄호 안의 URL을 정확히 캡처하기 위해 정규식 수정
  const imgRegex = /!\[(.*?)\]$$(.*?)$$/g
  return content.replace(
    imgRegex,
    '<img src="$2" alt="$1" style="display:block; max-width:100%; height:auto; margin:2rem auto; border-radius:0.5rem;">',
  )
}

export default function BlogContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null)

  // 마크다운 이미지 태그를 HTML로 변환
  const processedContent = content ? convertMarkdownImages(content) : ""

  useEffect(() => {
    // 이미지 태그에 스타일 적용
    if (contentRef.current) {
      const images = contentRef.current.querySelectorAll("img")
      console.log(`이미지 태그 수: ${images.length}`) // 디버깅용

      images.forEach((img) => {
        console.log(`이미지 처리: ${img.src}`) // 디버깅용
        img.style.display = "block"
        img.style.maxWidth = "100%"
        img.style.height = "auto"
        img.style.margin = "2rem auto"
        img.style.borderRadius = "0.5rem"

        // 이미지 로드 오류 처리
        img.onerror = () => {
          console.error("이미지 로드 실패:", img.src)
          // 이미지 로드 실패 시 대체 텍스트 표시
          const errorMsg = document.createElement("div")
          errorMsg.textContent = `이미지를 불러올 수 없습니다: ${img.alt || "이미지"}`
          errorMsg.style.padding = "1rem"
          errorMsg.style.backgroundColor = "#f8f9fa"
          errorMsg.style.borderRadius = "0.5rem"
          errorMsg.style.color = "#dc3545"
          errorMsg.style.textAlign = "center"
          img.parentNode?.insertBefore(errorMsg, img)
          img.style.display = "none"
        }
      })
    }
  }, [processedContent])

  return (
    <div className="blog-content prose prose-lg max-w-none">
      <style jsx global>{`
        .blog-content img {
          display: block !important;
          max-width: 100% !important;
          height: auto !important;
          margin: 2rem auto !important;
          border-radius: 0.5rem !important;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        .blog-content a {
          color: #3A7B89;
          text-decoration: underline;
        }
      `}</style>
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: processedContent }} />
    </div>
  )
}
