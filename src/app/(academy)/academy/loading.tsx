import { Skeleton } from '@/components/ui/skeleton'

export default function AcademyLoading() {
  return (
    <div className="space-y-5">
      {/* Hero banner skeleton */}
      <Skeleton className="w-full h-[180px] rounded-2xl" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-10" />
              </div>
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Two column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-28" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 space-y-2">
              <div className="flex gap-2.5">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-20" />
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-[#E5E7EB] last:border-0 last:pb-0">
                <div className="flex flex-col items-center pt-1 gap-1">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-px h-8" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E5E7EB] last:border-0">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}