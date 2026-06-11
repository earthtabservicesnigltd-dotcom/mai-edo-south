import { Skeleton } from '@/components/ui/skeleton';

export default function Loader() {
  return (
    <div className="w-full bg-white">
      {/* ── HERO SKELETON (Dark Green) ── */}
      <section className="relative min-h-screen bg-[#01381d] flex items-center overflow-hidden">
        {/* Wave separator background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#01381d]/95 via-[#01381d]/80 to-[#015b2d]/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Left Column — Text */}
            <div className="relative flex flex-col justify-center items-start order-2 lg:order-1 space-y-6">
              {/* Badge line */}
              <Skeleton className="h-4 w-48 bg-white/10" />
              
              {/* Heading (3 lines) */}
              <div className="space-y-3 w-full">
                <Skeleton className="h-12 md:h-16 w-3/4 bg-white/15" />
                <Skeleton className="h-12 md:h-16 w-1/2 bg-white/15" />
                <Skeleton className="h-12 md:h-16 w-2/3 bg-white/15" />
              </div>

              {/* Paragraph (3 lines) */}
              <div className="space-y-2 w-full max-w-lg pt-4">
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-11/12 bg-white/10" />
                <Skeleton className="h-4 w-4/5 bg-white/10" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 w-full">
                <Skeleton className="h-12 w-36 rounded-xl bg-white/20" />
                <Skeleton className="h-12 w-36 rounded-xl bg-white/10" />
              </div>
            </div>

            {/* Right Column — Photo & Badge */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[480px]">
                {/* Photo frame */}
                <div className="bg-linear-to-b from-[#015b2d] to-[#01381d] rounded-3xl p-1 border border-white/10">
                  <Skeleton className="w-full h-[350px] md:h-[500px] rounded-3xl bg-white/5" />
                </div>

                {/* Floating Badge (Bottom Right) */}
                <div className="absolute right-1 bottom-4 bg-white rounded-2xl p-4 shadow-xl w-36 space-y-2.5">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                  <Skeleton className="h-3 w-20 mx-auto" />
                  <Skeleton className="h-2.5 w-16 mx-auto" />
                  <Skeleton className="h-5 w-24 rounded-full mx-auto" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MISSION PILLARS SKELETON (White) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14 space-y-3">
            <Skeleton className="h-4 w-36 mx-auto" />
            <Skeleton className="h-10 md:h-12 w-80 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center space-y-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE SKELETON (Dark Green) ── */}
      <section className="py-20 bg-[#01381d]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-14 space-y-3 text-center">
            <Skeleton className="h-4 w-40 mx-auto bg-white/10" />
            <Skeleton className="h-10 md:h-12 w-96 mx-auto bg-white/15" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-center px-4 py-6 flex flex-col items-center space-y-4 border-r border-white/10 last:border-0">
                <Skeleton className="w-12 h-12 rounded-full bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/15" />
                <div className="space-y-1.5 w-full">
                  <Skeleton className="h-3 w-full bg-white/10" />
                  <Skeleton className="h-3 w-5/6 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOVEMENT SKELETON (White) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <Skeleton className="h-10 md:h-12 w-11/12" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-12 w-40 rounded-xl" />
                <Skeleton className="h-12 w-32 rounded-xl" />
              </div>
            </div>
            {/* Right Image */}
            <Skeleton className="w-full h-[350px] rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  )
}