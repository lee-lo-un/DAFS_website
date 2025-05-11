import { Skeleton } from "@/components/ui/skeleton"

export default function NoticesLoading() {
  return (
    <div className="container-width py-24 px-4 md:px-8">
      <Skeleton className="h-10 w-48 mb-8 mt-8" />

      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-7 w-32" />
          <div className="bg-muted/50 rounded-lg divide-y">
            {[1, 2].map((i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-6 w-full max-w-lg mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="bg-card rounded-lg divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-6 w-full max-w-lg mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Skeleton className="h-10 w-80" />
        </div>
      </div>
    </div>
  )
}
