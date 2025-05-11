import { Skeleton } from "@/components/ui/skeleton"

export default function CourseDetailLoading() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <section className="py-12 px-4 md:px-8">
        <div className="container-width mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* 헤더 스켈레톤 */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <Skeleton className="h-8 w-64 mb-2 bg-white/30" />
                  <Skeleton className="h-4 w-24 bg-white/30" />
                </div>

                <div className="mt-4 md:mt-0">
                  <Skeleton className="h-6 w-20 rounded-full bg-white/30" />
                </div>
              </div>
            </div>

            {/* 본문 스켈레톤 */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 왼쪽: 과정 정보 */}
                <div className="md:col-span-2">
                  <div className="mb-8">
                    <Skeleton className="h-7 w-32 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>

                  <div className="mb-8">
                    <Skeleton className="h-7 w-32 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>

                  <div className="mb-8">
                    <Skeleton className="h-7 w-32 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 신청 정보 */}
                <div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <Skeleton className="h-6 w-24 mb-4" />

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Skeleton className="h-5 w-5 mr-2 rounded" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Skeleton className="h-5 w-5 mr-2 rounded" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Skeleton className="h-5 w-5 mr-2 rounded" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  </div>

                  {/* 신청 폼 스켈레톤 */}
                  <div className="mt-6">
                    <Skeleton className="h-10 w-full rounded mb-4" />
                    <Skeleton className="h-32 w-full rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
