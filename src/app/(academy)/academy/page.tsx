import Link from 'next/link'
import { Badge, Panel, SectionHead } from '@/components/ui/shared';

export default function DashboardPage() {
  return (
    <div>
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-5 p-7" style={{ background: 'linear-gradient(135deg, #01381d 0%, #024d26 100%)' }}>
        <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[#f97316] text-[11px] font-bold uppercase tracking-widest mb-3">
              <i className="ti ti-flame" /> Week 1 · In Progress
            </div>
            <h1 className="font-[Syne] text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-2">
              Learning Today.<br /><span className="text-[#f97316]">Leading Tomorrow.</span>
            </h1>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-5">
              You&apos;re enrolled in 3 schools this cohort. Keep up your momentum — your capstone deadline for Politics &amp; Governance is this Friday.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/academy/assignments" className="inline-flex items-center gap-1.5 bg-white text-[#01381d] text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#f0ede6] transition-colors">
                <i className="ti ti-clipboard-list text-sm" /> View my tasks
              </Link>
              <Link href="/academy/capstone" className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                <i className="ti ti-trophy text-sm" /> Capstone projects
              </Link>
            </div>
          </div>
          <div className="flex gap-3 lg:shrink-0">
            {[
              { val: '3', sup: '/5', label: 'Schools enrolled' },
              { val: '11', sup: '', label: 'Tasks submitted' },
              { val: '1', sup: '', label: 'Certificate earned' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center min-w-[80px]">
                <div className="font-[Syne] text-2xl font-extrabold text-white leading-none mb-0.5">
                  {s.val}<span className="text-base text-white/40">{s.sup}</span>
                </div>
                <div className="text-white/50 text-[10px] font-light leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Schools enrolled', val: '3', sub: 'of 5 available', trend: '· 2 to go', iconBg: '#e1f5ee', iconColor: '#0f6e56', icon: 'ti-book-2' },
          { label: 'Days completed', val: '4', sub: 'this week', trend: '· on track', iconBg: '#e6f1fb', iconColor: '#185fa5', icon: 'ti-calendar-check' },
          { label: 'Tasks submitted', val: '11', sub: '2 overdue', trend: '', iconBg: '#faeeda', iconColor: '#854f0b', icon: 'ti-clipboard-check', subColor: '#854f0b' },
          { label: 'Certificates', val: '1', sub: '2 in progress', trend: '', iconBg: 'rgba(249,115,22,.1)', iconColor: '#f97316', icon: 'ti-certificate' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[11px] text-[#6B7280] font-medium mb-1">{s.label}</div>
                <div className="font-[Syne] text-2xl font-extrabold text-[#111827]">{s.val}</div>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: s.iconBg, color: s.iconColor }}>
                <i className={`ti ${s.icon}`} />
              </div>
            </div>
            <div className="text-[11px]" style={{ color: (s as any).subColor || '#6B7280' }}>
              {s.sub}{s.trend && <span className="text-[#6B7280]"> {s.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Schools + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div>
          <SectionHead title="My Schools" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { icon: 'ti-building-community', iconBg: '#e6f1fb', iconColor: '#185fa5', name: 'Politics, Policy & Governance', meta: '1-week intensive · Day 5 of 6', progress: 80, progressColor: '#185fa5', label: 'Day 5 — Local Government' },
              { icon: 'ti-users', iconBg: '#e1f5ee', iconColor: '#0f6e56', name: 'Leadership & Management', meta: '1-week intensive · Day 3 of 6', progress: 50, progressColor: '#0f6e56', label: 'Day 3 — Personal Management' },
              { icon: 'ti-briefcase', iconBg: '#faeeda', iconColor: '#854f0b', name: 'Business & Entrepreneurship', meta: '1-week intensive · Day 2 of 6', progress: 33, progressColor: '#ba7517', label: 'Day 2 — Market Understanding' },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: s.iconBg, color: s.iconColor }}>
                    <i className={`ti ${s.icon}`} />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-semibold text-[#111827] leading-tight">{s.name}</div>
                    <div className="text-[11px] text-[#6B7280]">{s.meta}</div>
                  </div>
                </div>
                <div className="h-1.5 bg-[#f0ede6] rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.progress}%`, background: s.progressColor }} />
                </div>
                <div className="flex justify-between text-[10.5px] text-[#6B7280]">
                  <span>{s.label}</span><span>{s.progress}%</span>
                </div>
              </div>
            ))}
            <Link href="/academy/enroll" className="bg-[#F7F4EE] border border-dashed border-[#E5E7EB] rounded-xl p-3.5 hover:border-[#f97316] transition-colors">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  <i className="ti ti-circle-plus" />
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-[#6B7280] leading-tight">Enroll in a new school</div>
                  <div className="text-[11px] text-[#9CA3AF]">Public Service · Tech · AI & ML</div>
                </div>
              </div>
              <div className="text-[11.5px] text-[#f97316] font-semibold flex items-center gap-1">
                Browse available schools <i className="ti ti-arrow-right text-xs" />
              </div>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#111827]">
              <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block" /> This week
            </div>
            <Badge variant="orange">Week 1</Badge>
          </div>
          <Panel>
            {[
              { dot: '#ba7517', name: 'Market Understanding', time: 'Business · Tuesday · Group work', badgeBg: '#faeeda', badgeColor: '#633806', badgeLabel: 'Group Day', last: false },
              { dot: '#0f6e56', name: 'Personal Management Skills', time: 'Leadership · Wednesday · Individual', badgeBg: '#e1f5ee', badgeColor: '#085041', badgeLabel: 'Individual', last: false },
              { dot: '#185fa5', name: 'Capstone Build Day', time: 'Politics & Governance · Friday · Full day', badgeBg: '#fcebeb', badgeColor: '#791f1f', badgeLabel: 'Capstone', last: false },
              { dot: '#f97316', name: 'Graduation & Presentation', time: 'Politics & Governance · Saturday', badgeBg: 'rgba(249,115,22,0.1)', badgeColor: '#f97316', badgeLabel: 'Graduation', last: true },
            ].map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                  {!s.last && <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="text-[12.5px] font-semibold text-[#111827] mb-0.5">{s.name}</div>
                  <div className="text-[11px] text-[#6B7280] mb-1.5">{s.time}</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.badgeBg, color: s.badgeColor }}>{s.badgeLabel}</span>
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>

      {/* Recent Activity */}
      <SectionHead title="Recent activity" />
      <Panel>
        {[
          { iconBg: '#e1f5ee', iconColor: '#0f6e56', icon: 'ti-check', text: 'Leadership reflection sheet submitted', time: '2 hours ago' },
          { iconBg: '#faeeda', iconColor: '#854f0b', icon: 'ti-users', text: 'Joined Group B — Business cohort', time: 'Yesterday' },
          { iconBg: '#e6f1fb', iconColor: '#185fa5', icon: 'ti-file-text', text: 'Policy problem statement approved by facilitator', time: '2 days ago' },
          { iconBg: 'rgba(249,115,22,.1)', iconColor: '#f97316', icon: 'ti-certificate', text: 'Certificate in Public Service — unlocked', time: '3 days ago' },
        ].map((a, i) => (
          <div key={i} className={`flex items-start gap-3 py-2.5 ${i < 3 ? 'border-b border-[#E5E7EB]' : ''}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: a.iconBg, color: a.iconColor }}>
              <i className={`ti ${a.icon}`} />
            </div>
            <div>
              <div className="text-[12.5px] font-medium text-[#111827]">{a.text}</div>
              <div className="text-[11px] text-[#9CA3AF]">{a.time}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}