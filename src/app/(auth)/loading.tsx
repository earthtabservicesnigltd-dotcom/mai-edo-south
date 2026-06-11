import { Skeleton } from '@/components/ui/skeleton'

export default function SignInSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">

      {/* ── LEFT PANEL SKELETON (Dark Green) ── */}
      <div className="hidden lg:flex w-[52%] bg-linear-to-br from-[#01381d] via-[#015b2d] to-[#024d25] flex-col justify-between px-14 py-12 relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#f97316] opacity-[0.07]" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white opacity-[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.06]" />

        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-lg bg-white/10" />
          <Skeleton className="h-7 w-32 rounded-full bg-[#f97316]/20 border border-[#f97316]/20" />
        </div>

        {/* Main Pillars Copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10 space-y-6">
          {/* Header Lines */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-4/5 bg-white/15" />
            <Skeleton className="h-10 w-2/3 bg-white/15" />
          </div>
          {/* Paragraph Lines */}
          <div className="space-y-2 max-w-[380px] pt-2">
            <Skeleton className="h-3.5 w-full bg-white/10" />
            <Skeleton className="h-3.5 w-11/12 bg-white/10" />
            <Skeleton className="h-3.5 w-4/5 bg-white/10" />
          </div>
          {/* Pillars List (4 items) */}
          <div className="flex flex-col gap-3.5 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3 max-w-[360px]">
                <Skeleton className="w-[34px] h-[34px] rounded-lg bg-[#f97316]/30" />
                <Skeleton className="h-4 w-48 bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <Skeleton className="relative z-10 h-3 w-64 bg-white/5" />
      </div>

      {/* ── RIGHT PANEL SKELETON (Form Panel) ── */}
      <div className="flex-1 flex flex-col items-center justify-start lg:pt-12 bg-gray-50 w-full">
        <div className="w-full px-4 lg:px-12 pb-8 max-w-md space-y-6">
          {/* LOG IN Title strip */}
          <Skeleton className="h-10 w-full" />
          
          {/* Welcome subtitle */}
          <div className="space-y-3 pt-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        {/* Form Inputs Skeleton */}
        <div className="space-y-6 px-4 w-full lg:px-12 max-w-md pb-12">
          {/* Email input field */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Password input field */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3.5 w-24" />
          </div>

          {/* Buttons & Links */}
          <div className="space-y-4 pt-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>

    </div>
  )
}