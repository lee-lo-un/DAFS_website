import { Skeleton } from "@/components/ui/skeleton"

export default function NoticeDetailLoading() {
  return (
    <div className="container-width py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>

        <article className="bg-card rounded-lg p-6 md:p-8 shadow-sm">
          <header className="mb-8 pb-6 border-b">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Skeleton className="h-5 w-40" />
            </div>
          </header>

          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </article>
      </div>
    </div>
  )
}
