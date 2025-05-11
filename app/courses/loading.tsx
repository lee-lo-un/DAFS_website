import { Skeleton } from "@/components/ui/skeleton"

export default function CoursesLoading() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <section className="py-12 px-4 md:px-8">
        <div className="container-width mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-16" />

          {/* 정규 과정 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <div className="flex justify-center mb-6">
                  <Skeleton className="h-20 w-20 rounded-full" />
                </div>

                <Skeleton className="h-6 w-40 mx-auto mb-6" />

                <div className="space-y-3 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-start">
                      <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                      <Skeleton className="h-4 flex-grow" />
                    </div>
                  ))}
                </div>

                <Skeleton className="h-5 w-32 mx-auto mb-4" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            ))}
          </div>

          {/* 특별 세미나 및 워크샵 스켈레톤 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-12" />

            <div className="space-y-16">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative">
                  <div className="flex">
                    <div className="w-1/2">
                      {i % 2 === 0 && (
                        <>
                          <Skeleton className="h-6 w-36 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4 mb-4" />
                          <Skeleton className="h-8 w-24 rounded" />
                        </>
                      )}
                    </div>
                    <div className="w-12 flex items-start justify-center">
                      <Skeleton className="w-5 h-5 rounded-full mt-2" />
                    </div>
                    <div className="w-1/2">
                      {i % 2 !== 0 && (
                        <>
                          <Skeleton className="h-6 w-36 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4 mb-4" />
                          <Skeleton className="h-8 w-24 rounded" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Skeleton className="h-5 w-36 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
