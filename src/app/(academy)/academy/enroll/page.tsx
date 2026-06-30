'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ENROLL_SCHOOLS } from '@/lib/constant'

export default function EnrollPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const submit = () => {
    if (selected.size === 0) return alert('Pick at least one school before submitting.')
    setSubmitted(true)
    setTimeout(() => router.push('/academy'), 2000)
  }

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden p-6 mb-5" style={{ background: 'linear-gradient(135deg, #01381d 0%, #024d26 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)', transform: 'translate(50%, -50%)' }} />
        <h2 className="font-[Syne] text-xl font-extrabold text-white mb-1.5 relative z-10">Enroll in a School</h2>
        <p className="text-[13px] text-white/60 font-light leading-relaxed relative z-10">Choose the schools you want to join this cohort. Each school runs for one intensive week, Monday to Saturday.</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2.5 text-[13px] font-bold text-[#111827] mb-4">
          <i className="ti ti-book-2 text-[#f97316] text-base" /> Select your schools
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {ENROLL_SCHOOLS.map(s => {
            const isSelected = selected.has(s.id)
            return (
              <label key={s.id} onClick={() => toggle(s.id)}
                className={`flex items-start gap-3 rounded-lg border-[1.5px] p-3 cursor-pointer transition-all ${isSelected ? 'border-[#f97316] bg-[rgba(249,115,22,0.04)]' : 'border-[#E5E7EB] bg-white hover:border-[#d1d5db]'}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggle(s.id)} className="mt-0.5 accent-[#f97316] shrink-0" />
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: s.bg, color: s.color }}>
                  <i className={`ti ${s.icon}`} />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#111827] leading-snug">{s.label}</div>
                  <div className="text-[11px] text-[#6B7280] font-light">{s.sub}</div>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex gap-2.5 justify-end">
        <button onClick={() => router.push('/academy')}
          className="text-[12px] font-medium px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Cancel
        </button>
        <button onClick={submit}
          className="inline-flex items-center gap-1.5 bg-[#f97316] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#ea6a05] transition-colors">
          <i className="ti ti-circle-check text-sm" />
          {submitted ? 'Submitted!' : 'Submit enrollment'}
        </button>
      </div>
    </div>
  )
}