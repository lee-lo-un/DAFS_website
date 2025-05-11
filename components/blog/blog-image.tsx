import Image from "next/image"

interface BlogImageProps {
  src: string
  alt: string
  className?: string
}

export default function BlogImage({ src, alt, className = "" }: BlogImageProps) {
  // 이미지 URL이 placeholder.svg로 시작하는 경우 그대로 사용
  if (src.startsWith("/placeholder.svg")) {
    return (
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={600}
        height={400}
        className={className}
        priority={false}
        unoptimized
      />
    )
  }

  // 외부 URL인 경우 그대로 사용
  if (src.startsWith("http")) {
    return (
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={600}
        height={400}
        className={className}
        priority={false}
        unoptimized
      />
    )
  }

  // 상대 경로인 경우 public 폴더 내의 이미지로 간주
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={600}
      height={400}
      className={className}
      priority={false}
      unoptimized
    />
  )
}
