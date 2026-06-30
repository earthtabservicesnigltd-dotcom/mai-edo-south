'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [name, setName] = useState('Emeka Ade')
  const [email, setEmail] = useState('emeka.ade@example.com')
  const [prefs, setPrefs] = useState({ deadlines: true, capstone: true, weekly: false })
  const router = useRouter()

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-5">Manage your account details and preferences.</p>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-3.5">
        <div className="flex items-center gap-2.5 font-[Syne] text-[13px] font-bold text-[#111827] mb-4">
          <i className="ti ti-user text-[#f97316] text-base" /> Profile
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {[
            { label: 'Full name', value: name, onChange: setName, type: 'text' },
            { label: 'Email', value: email, onChange: setEmail, type: 'email' },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[rgba(249,115,22,0.1)] transition-all" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-5">
        <div className="flex items-center gap-2.5 font-[Syne] text-[13px] font-bold text-[#111827] mb-4">
          <i className="ti ti-bell text-[#f97316] text-base" /> Notification preferences
        </div>
        <div className="flex flex-col gap-3">
          {[
            { key: 'deadlines' as const, label: 'Email me about task deadlines' },
            { key: 'capstone' as const, label: 'Email me about capstone milestones' },
            { key: 'weekly' as const, label: 'Weekly progress summary' },
          ].map(p => (
            <label key={p.key} className="flex items-center gap-2.5 text-[13px] text-[#111827] cursor-pointer">
              <input type="checkbox" checked={prefs[p.key]}
                onChange={() => setPrefs(prev => ({ ...prev, [p.key]: !prev[p.key] }))}
                className="accent-[#f97316] w-4 h-4" />
              {p.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 justify-end">
        <button onClick={() => router.push('/academy')}
          className="text-[12px] font-medium px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Cancel
        </button>
        <button className="inline-flex items-center gap-1.5 bg-[#f97316] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#ea6a05] transition-colors">
          <i className="ti ti-circle-check text-sm" /> Save changes
        </button>
      </div>
    </div>
  )
}