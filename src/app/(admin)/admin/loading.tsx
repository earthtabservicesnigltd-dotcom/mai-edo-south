import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      
      {/* ── HEADER SKELETON ── */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-52 bg-[#01381d]/15 animate-pulse" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* ── STAT CARDS GRID SKELETON (8 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                {/* Icon box placeholder */}
                <Skeleton className="w-10 h-10 rounded-xl" />
                {/* Number value placeholder */}
                <Skeleton className="h-8 w-12" />
              </div>
              {/* Card Label placeholder */}
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── RECENT VOLUNTEERS TABLE SKELETON ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Table Header Row */}
          <div className="flex justify-between border-b pb-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
          {/* Table Content Rows (4 items) */}
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5 border-b last:border-0">
              <Skeleton className="h-4 w-24" /> {/* ID */}
              <Skeleton className="h-4 w-36" /> {/* Name */}
              <Skeleton className="h-4 w-20" /> {/* LGA */}
              <Skeleton className="h-5 w-20 rounded-full" /> {/* Status badge */}
              <Skeleton className="h-4 w-24" /> {/* Date */}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── SIDE-BY-SIDE CARDS SKELETON ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Diaspora */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Header row */}
            <div className="flex justify-between border-b pb-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-14" />
              ))}
            </div>
            {/* Body rows */}
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 border-b last:border-0">
                <Skeleton className="h-4 w-20" /> {/* ID */}
                <Skeleton className="h-4 w-32" /> {/* Name */}
                <Skeleton className="h-4 w-16" /> {/* Country */}
                <Skeleton className="h-5 w-20 rounded-full" /> {/* Status */}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Submissions (MAI Listens) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Header row */}
            <div className="flex justify-between border-b pb-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </div>
            {/* Body rows */}
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 border-b last:border-0">
                <Skeleton className="h-4 w-28" /> {/* Name */}
                <Skeleton className="h-4 w-20" /> {/* Category */}
                <Skeleton className="h-4 w-28" /> {/* Subject */}
                <Skeleton className="h-5 w-20 rounded-full" /> {/* Status */}
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}