'use client'

import { useState } from 'react'
import Image from 'next/image'

// ─── Types ───────────────────────────────────────────────────────────────────

type PageKey =
  | 'dashboard'
  | 'schools'
  | 'schedule'
  | 'assignments'
  | 'capstone'
  | 'certificates'
  | 'enroll'
  | 'mygroup'
  | 'notifications'
  | 'settings'

interface Task {
  id: number
  title: string
  desc: string
  school: string
  schoolLabel: string
  tagClass: string
  typeLabel: string
  typeIcon: string
  day: string
  dayOrder: number
  urgencyClass: string
  urgencyLabel: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<PageKey, string> = {
  dashboard: 'Overview',
  schools: 'My Schools',
  schedule: 'Weekly Schedule',
  assignments: 'Assignments',
  capstone: 'Capstone Projects',
  certificates: 'Certificates',
  enroll: 'Enroll in a School',
  mygroup: 'My Group',
  notifications: 'Notifications',
  settings: 'Settings',
}

const TASKS: Task[] = [
  { id: 1, title: 'Community policy solution — capstone submission', desc: 'Final capstone: problem definition, root cause analysis, policy solution, implementation plan, expected outcomes. Must be Edo South centered.', school: 'ppg', schoolLabel: 'Politics & Governance', tagClass: 'tag-blue', typeLabel: 'Group · Capstone', typeIcon: 'ti-users', day: 'Overdue', dayOrder: 0, urgencyClass: 'urgent', urgencyLabel: 'Overdue' },
  { id: 2, title: '2-minute community change speech', desc: 'Deliver a 2-minute speech on a change you want to see in your community. Builds on Day 3 leadership messaging and political communication.', school: 'ppg', schoolLabel: 'Politics & Governance', tagClass: 'tag-blue', typeLabel: 'Individual', typeIcon: 'ti-user', day: 'Overdue', dayOrder: 0, urgencyClass: 'urgent', urgencyLabel: 'Overdue' },
  { id: 3, title: 'Personal productivity plan — 1 week', desc: 'Create a 1-week personal productivity plan. Include how you handle pressure and responsibility as a leader. Part of Day 3 personal management skills.', school: 'lm', schoolLabel: 'Leadership & Management', tagClass: 'tag-teal', typeLabel: 'Individual · Wed', typeIcon: 'ti-user', day: 'Today', dayOrder: 1, urgencyClass: 'today', urgencyLabel: 'Due today' },
  { id: 4, title: 'Draft a leadership message to a team', desc: 'Write a leadership message you would send to a team you are leading. Ties into the communication skills and leadership messaging session.', school: 'lm', schoolLabel: 'Leadership & Management', tagClass: 'tag-teal', typeLabel: 'Individual · Wed', typeIcon: 'ti-user', day: 'Today', dayOrder: 1, urgencyClass: 'today', urgencyLabel: 'Due today' },
  { id: 5, title: 'Mini business plan draft', desc: 'Write a simple mini business plan: what you sell, who you sell to, and how you make money. Improve your group\'s business idea from Tuesday.', school: 'be', schoolLabel: 'Business & Entrepreneurship', tagClass: 'tag-amber', typeLabel: 'Individual · Wed', typeIcon: 'ti-user', day: 'Tomorrow', dayOrder: 2, urgencyClass: 'upcoming', urgencyLabel: 'Tomorrow' },
  { id: 6, title: 'Group execution strategy document', desc: 'Develop a full solution to the leadership challenge from Tuesday. Assign clear responsibilities and create an execution timeline and plan.', school: 'lm', schoolLabel: 'Leadership & Management', tagClass: 'tag-teal', typeLabel: 'Group · Thu', typeIcon: 'ti-users', day: 'Tomorrow', dayOrder: 2, urgencyClass: 'upcoming', urgencyLabel: 'Tomorrow' },
  { id: 7, title: 'Group business model + marketing plan', desc: 'Finalize product/service design, create brand name and simple identity, develop marketing strategy, and plan how to attract your first customers.', school: 'be', schoolLabel: 'Business & Entrepreneurship', tagClass: 'tag-amber', typeLabel: 'Group · Thu', typeIcon: 'ti-users', day: 'This week', dayOrder: 3, urgencyClass: 'upcoming', urgencyLabel: 'Thu' },
  { id: 8, title: 'Leadership & management capstone project', desc: 'Final document: problem definition, leadership strategy, execution plan, team coordination model, and expected outcomes. Full group submission.', school: 'lm', schoolLabel: 'Leadership & Management', tagClass: 'tag-teal', typeLabel: 'Group · Fri', typeIcon: 'ti-users', day: 'This week', dayOrder: 3, urgencyClass: 'upcoming', urgencyLabel: 'Fri' },
  { id: 9, title: 'Business capstone project', desc: 'Full business project: idea, target market, business model, pricing strategy, marketing plan, and execution roadmap. Full group submission.', school: 'be', schoolLabel: 'Business & Entrepreneurship', tagClass: 'tag-amber', typeLabel: 'Group · Fri', typeIcon: 'ti-users', day: 'This week', dayOrder: 3, urgencyClass: 'upcoming', urgencyLabel: 'Fri' },
]

const GROUP_MEMBERS = [
  { initials: 'EA', name: 'Emeka Ade', role: 'You', task: 'Marketing plan draft' },
  { initials: 'CO', name: 'Chiamaka Okoye', role: 'Member', task: 'Pricing strategy' },
  { initials: 'TI', name: 'Tega Ighodaro', role: 'Member', task: 'Target market research' },
  { initials: 'FU', name: 'Faith Uwagboe', role: 'Group lead', task: 'Coordinating capstone build' },
]

const NOTIFICATIONS = [
  { icon: 'ti-alert-circle', bg: '#fde8e8', color: '#b42318', text: 'Capstone submission for Politics & Governance is overdue', time: '1 hour ago', unread: true },
  { icon: 'ti-clock', bg: '#faeeda', color: '#854f0b', text: 'Personal productivity plan due today — Leadership & Management', time: '3 hours ago', unread: true },
  { icon: 'ti-check', bg: '#e1f5ee', color: '#0f6e56', text: 'Leadership reflection sheet submitted', time: '2 hours ago', unread: false },
  { icon: 'ti-users', bg: '#faeeda', color: '#854f0b', text: 'Joined Group B — Business cohort', time: 'Yesterday', unread: false },
  { icon: 'ti-file-text', bg: '#e6f1fb', color: '#185fa5', text: 'Policy problem statement approved by facilitator', time: '2 days ago', unread: false },
  { icon: 'ti-certificate', bg: 'rgba(249,115,22,.1)', color: '#f97316', text: 'Certificate in Public Service — unlocked', time: '3 days ago', unread: false },
]

const ENROLL_SCHOOLS = [
  { id: 'ppg', icon: 'ti-building-community', bg: '#e6f1fb', color: '#185fa5', label: 'Politics, Policy & Governance', sub: 'Civic responsibility · Policy design' },
  { id: 'lm', icon: 'ti-users', bg: '#e1f5ee', color: '#0f6e56', label: 'Leadership & Management', sub: 'Team dynamics · Strategic execution' },
  { id: 'be', icon: 'ti-briefcase', bg: '#faeeda', color: '#854f0b', label: 'Business & Entrepreneurship', sub: 'Idea to launch · Business planning' },
  { id: 'ps', icon: 'ti-landmark', bg: '#f0eaff', color: '#6d28d9', label: 'Public Service', sub: 'Civic delivery · Stakeholder mapping' },
  { id: 'td', icon: 'ti-devices', bg: '#e0e7ff', color: '#3730a3', label: 'Technology & Digital Skills', sub: 'Digital marketing · Cybersecurity' },
  { id: 'ai', icon: 'ti-brain', bg: '#fce7f3', color: '#831843', label: 'AI & Machine Learning', sub: 'AI tools · ML project development' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ variant, children }: { variant: 'success' | 'warn' | 'info' | 'orange', children: React.ReactNode }) {
  const styles = {
    success: 'bg-[#eaf3de] text-[#27500a]',
    warn: 'bg-[#faeeda] text-[#633806]',
    info: 'bg-[#e6f1fb] text-[#0c447c]',
    orange: 'bg-[rgba(249,115,22,0.1)] text-[#f97316]',
  }
  const dotColors = { success: '#3b6d11', warn: '#ba7517', info: '#185fa5', orange: '#f97316' }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${styles[variant]}`}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dotColors[variant] }} />
      {children}
    </span>
  )
}

function Avatar({ initials, size = 'sm', style }: { initials: string, size?: 'sm' | 'lg', style?: React.CSSProperties }) {
  const base = 'rounded-full flex items-center justify-center font-bold shrink-0 font-[Syne]'
  if (size === 'lg') return <div className={`${base} w-10 h-10 text-sm bg-[#f97316] text-white`} style={style}>{initials}</div>
  return <div className={`${base} w-8 h-8 text-[11px] bg-[rgba(249,115,22,0.15)] text-[#f97316]`} style={style}>{initials}</div>
}

function SectionHead({ title, action, actionLabel }: { title: string, action?: () => void, actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#111827]">
        <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block" />
        {title}
      </div>
      {action && (
        <button onClick={action} className="text-[12px] text-[#6B7280] hover:text-[#111827] flex items-center gap-1 border-none bg-transparent cursor-pointer">
          {actionLabel} <i className="ti ti-arrow-right text-xs" />
        </button>
      )}
    </div>
  )
}

function Panel({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-xl p-4 ${className}`}>
      {children}
    </div>
  )
}

// ─── Page: Dashboard ─────────────────────────────────────────────────────────

function PageDashboard({ navigate }: { navigate: (p: PageKey) => void }) {
  return (
    <div>
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-5 p-7 bg-[#01381d]" style={{ background: 'linear-gradient(135deg, #01381d 0%, #024d26 100%)' }}>
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
              You're enrolled in 3 schools this cohort. Keep up your momentum — your capstone deadline for Politics &amp; Governance is this Friday.
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => navigate('assignments')} className="inline-flex items-center gap-1.5 bg-white text-[#01381d] text-xs font-semibold px-4 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#f0ede6] transition-colors">
                <i className="ti ti-clipboard-list text-sm" /> View my tasks
              </button>
              <button onClick={() => navigate('capstone')} className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                <i className="ti ti-trophy text-sm" /> Capstone projects
              </button>
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
          { label: 'Tasks submitted', val: '11', sub: '2 overdue', trend: '', iconBg: '#faeeda', iconColor: '#854f0b', icon: 'ti-clipboard-check', subColor: '#854f0b', subAction: () => navigate('assignments') },
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
            <div className="text-[11px]" style={{ color: s.subColor || '#6B7280' }}>
              {s.sub}{s.trend && <span className="text-[#6B7280]"> {s.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Schools + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* My Schools */}
        <div>
          <SectionHead title="My Schools" action={() => navigate('schools')} actionLabel="See all" />
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
            {/* Enroll card */}
            <div onClick={() => navigate('enroll')} className="bg-[#F7F4EE] border border-dashed border-[#E5E7EB] rounded-xl p-3.5 cursor-pointer hover:border-[#f97316] transition-colors">
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
            </div>
          </div>
        </div>

        {/* This Week */}
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
                <div className={`pb-3 flex-1 ${s.last ? '' : ''}`}>
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

// ─── Page: Assignments ────────────────────────────────────────────────────────

function PageAssignments({ navigate }: { navigate: (p: PageKey) => void }) {
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState('all')

  const toggle = (id: number) => {
    setDoneSet(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = filter === 'all' ? TASKS : TASKS.filter(t => t.school === filter)
  const groups: Record<string, Task[]> = {}
  filtered.forEach(t => { if (!groups[t.day]) groups[t.day] = []; groups[t.day].push(t) })
  const dayOrder = ['Overdue', 'Today', 'Tomorrow', 'This week']

  const tagStyles: Record<string, string> = {
    'tag-blue': 'bg-[#e6f1fb] text-[#0c447c]',
    'tag-teal': 'bg-[#e1f5ee] text-[#085041]',
    'tag-amber': 'bg-[#faeeda] text-[#633806]',
  }
  const urgencyStyles: Record<string, string> = {
    urgent: 'bg-[#fcebeb] text-[#791f1f]',
    today: 'bg-[#faeeda] text-[#633806]',
    upcoming: 'bg-[#F7F4EE] text-[#6B7280]',
  }

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: 'ti-calendar-due', iconBg: '#faeeda', iconColor: '#854f0b', label: 'Due this week', val: '7', valColor: '#111827' },
          { icon: 'ti-alert-circle', iconBg: '#fcebeb', iconColor: '#791f1f', label: 'Overdue', val: '2', valColor: '#791f1f' },
          { icon: 'ti-circle-check', iconBg: '#e1f5ee', iconColor: '#0f6e56', label: 'Completed', val: '11', valColor: '#015b2d' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: s.iconBg, color: s.iconColor }}>
              <i className={`ti ${s.icon}`} />
            </div>
            <div>
              <div className="text-[11px] text-[#6B7280]">{s.label}</div>
              <div className="font-[Syne] text-xl font-extrabold" style={{ color: s.valColor }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all', label: 'All schools' },
          { key: 'ppg', label: 'Politics & Governance' },
          { key: 'lm', label: 'Leadership & Management' },
          { key: 'be', label: 'Business & Entrepreneurship' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-[12px] font-medium px-3.5 py-2 rounded-lg border cursor-pointer transition-colors ${filter === f.key ? 'bg-[#01381d] text-white border-[#01381d]' : 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#F7F4EE]'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      {dayOrder.map(day => {
        const dayTasks = groups[day]
        if (!dayTasks) return null
        return (
          <div key={day} className="mb-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2.5">{day}</div>
            <div className="flex flex-col gap-2">
              {dayTasks.map(t => {
                const done = doneSet.has(t.id)
                return (
                  <div key={t.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex gap-3">
                    <button
                      onClick={() => toggle(t.id)}
                      className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${done ? 'bg-[#015b2d] border-[#015b2d]' : 'border-[#D1D5DB] bg-white hover:border-[#f97316]'}`}
                    >
                      {done && <i className="ti ti-check text-white text-[10px]" />}
                    </button>
                    <div className="flex-1">
                      <div className={`text-[13px] font-semibold mb-1 ${done ? 'line-through text-[#9CA3AF]' : 'text-[#111827]'}`}>{t.title}</div>
                      <div className="text-[11.5px] text-[#6B7280] font-light leading-relaxed mb-2">{t.desc}</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full ${tagStyles[t.tagClass] || ''}`}>{t.schoolLabel}</span>
                        <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <i className={`ti ${t.typeIcon} text-xs`} /> {t.typeLabel}
                        </span>
                        <span className={`text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full ${done ? 'bg-[#e1f5ee] text-[#085041]' : urgencyStyles[t.urgencyClass] || ''}`}>
                          {done ? 'Done ✓' : t.urgencyLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="text-center mt-4">
        <button className="inline-flex items-center gap-1.5 bg-[#f97316] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#ea6a05] transition-colors">
          <i className="ti ti-sparkles text-sm" /> Help me with an assignment
        </button>
      </div>
    </div>
  )
}

// ─── Page: My Schools ─────────────────────────────────────────────────────────

function PageSchools({ navigate }: { navigate: (p: PageKey) => void }) {
  const schools = [
    { icon: 'ti-building-community', iconBg: '#e6f1fb', iconColor: '#185fa5', num: 'School 01 · Enrolled', title: 'Politics, Policy & Governance', desc: 'Understand power, civic responsibility, Nigeria\'s government structures, public policy cycles, and how to design community-centered policy solutions.', days: [{ label: 'Mon: Foundations', active: true }, { label: 'Tue: Policy Making', active: true }, { label: 'Wed: Communication', active: true }, { label: 'Thu: Accountability', active: true }, { label: 'Fri: Capstone Build', active: true }, { label: 'Sat: Graduation', active: false }], cert: 'MAI Professional Certificate in Politics, Policy & Governance', badge: <Badge variant="success">Day 5 of 6 · 80% complete</Badge>, enrolled: true },
    { icon: 'ti-users', iconBg: '#e1f5ee', iconColor: '#0f6e56', num: 'School 02 · Enrolled', title: 'Leadership & Management', desc: 'Build emotional intelligence, team dynamics, personal management systems, and strategic execution skills through individual reflection and group challenges.', days: [{ label: 'Mon: Foundations', active: true }, { label: 'Tue: Team Dynamics', active: true }, { label: 'Wed: Personal Mgmt', active: true }, { label: 'Thu: Execution', active: false }, { label: 'Fri: Capstone Build', active: false }, { label: 'Sat: Graduation', active: false }], cert: 'MAI Professional Certificate in Leadership & Management', badge: <Badge variant="info">Day 3 of 6 · 50% complete</Badge>, enrolled: true },
    { icon: 'ti-briefcase', iconBg: '#faeeda', iconColor: '#854f0b', num: 'School 03 · Enrolled', title: 'Business & Entrepreneurship', desc: 'From idea generation to business model design, market analysis, branding, and pitching — build a real business from scratch in one week.', days: [{ label: 'Mon: Foundations', active: true }, { label: 'Tue: Market Research', active: true }, { label: 'Wed: Business Plan', active: false }, { label: 'Thu: Marketing', active: false }, { label: 'Fri: Capstone Build', active: false }, { label: 'Sat: Graduation', active: false }], cert: 'MAI Professional Certificate in Business & Entrepreneurship', badge: <Badge variant="warn">Day 2 of 6 · 33% complete</Badge>, enrolled: true },
    { icon: 'ti-landmark', iconBg: '#f0eaff', iconColor: '#6d28d9', num: 'School 04 · Not enrolled', title: 'Public Service', desc: 'Understand civic responsibility, service delivery systems, stakeholder mapping, and design practical improvements for public services in your community.', days: [], cert: 'MAI Professional Certificate in Public Service & Civic Delivery', badge: null, enrolled: false },
    { icon: 'ti-devices', iconBg: '#e0e7ff', iconColor: '#3730a3', num: 'School 05 · Not enrolled', title: 'Technology & Digital Skills', desc: 'Cybersecurity, digital marketing, social media management, graphic design, and website management — become a certified digital professional.', days: [], cert: 'MAI Professional Certificate in Technology & Digital Skills', badge: null, enrolled: false },
    { icon: 'ti-brain', iconBg: '#fce7f3', iconColor: '#831843', num: 'School 06 · Not enrolled', title: 'Artificial Intelligence & Machine Learning', desc: 'From AI foundations and prompt engineering to machine learning project development — build and pitch a real AI solution in one week.', days: [], cert: 'MAI Professional Certificate in AI & Machine Learning', badge: null, enrolled: false },
  ]

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-5">
        MAI Academy offers 6 one-week intensive schools designed for young leaders in Edo South. Each school runs Monday–Saturday with individual tasks, group work, and a capstone project.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {schools.map((s, i) => (
          <div key={i} onClick={!s.enrolled ? () => navigate('enroll') : undefined} className={`bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col gap-3 transition-all hover:border-[#f97316] hover:shadow-md hover:-translate-y-0.5 ${!s.enrolled ? 'opacity-75 cursor-pointer' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: s.iconBg, color: s.iconColor }}>
                <i className={`ti ${s.icon}`} />
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-[#f97316] uppercase tracking-widest mb-1">{s.num}</div>
                <div className="font-[Syne] text-[14px] font-bold text-[#111827] leading-snug">{s.title}</div>
              </div>
            </div>
            <div className="text-[12px] text-[#6B7280] font-light leading-relaxed">{s.desc}</div>
            {s.days.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {s.days.map((d, di) => (
                  <span key={di} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${d.active ? 'bg-[rgba(249,115,22,0.1)] text-[#f97316] border-[rgba(249,115,22,0.25)]' : 'bg-[#F7F4EE] text-[#6B7280] border-[#E5E7EB]'}`}>{d.label}</span>
                ))}
              </div>
            )}
            <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 font-light">
              <i className="ti ti-certificate text-[#f97316]" /> {s.cert}
            </div>
            {s.badge ? s.badge : (
              <button onClick={() => navigate('enroll')} className="self-start inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#f97316] bg-transparent border-none cursor-pointer p-0 hover:text-[#015b2d] transition-colors">
                Enroll in this school <i className="ti ti-arrow-right text-xs" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page: Schedule ───────────────────────────────────────────────────────────

function PageSchedule() {
  const days = [
    { name: 'Mon', label: 'Individual', today: false, events: [{ bg: '#e6f1fb', color: '#0c447c', text: 'PPG: Foundations of Politics' }, { bg: '#e1f5ee', color: '#085041', text: 'LM: Foundations of Leadership' }, { bg: '#faeeda', color: '#633806', text: 'BE: Business Foundations' }] },
    { name: 'Tue', label: 'Group', today: false, events: [{ bg: '#e6f1fb', color: '#0c447c', text: 'PPG: Community Problem Selection' }, { bg: '#e1f5ee', color: '#085041', text: 'LM: Team Dynamics & Challenges' }, { bg: '#faeeda', color: '#633806', text: 'BE: Market & Team Formation' }] },
    { name: 'Wed', label: 'Individual', today: true, events: [{ bg: '#e6f1fb', color: '#0c447c', text: 'PPG: Political Communication' }, { bg: '#e1f5ee', color: '#085041', text: 'LM: Personal Management Skills' }, { bg: '#faeeda', color: '#633806', text: 'BE: Business Planning' }] },
    { name: 'Thu', label: 'Group', today: false, events: [{ bg: '#e6f1fb', color: '#0c447c', text: 'PPG: Governance & Accountability' }, { bg: '#e1f5ee', color: '#085041', text: 'LM: Team Execution & Strategy' }, { bg: '#faeeda', color: '#633806', text: 'BE: Product Dev & Marketing' }] },
    { name: 'Fri', label: 'Capstone', today: false, events: [{ bg: '#fcebeb', color: '#791f1f', text: 'PPG: Policy Design Lab — Full Day' }, { bg: '#fcebeb', color: '#791f1f', text: 'LM: Capstone Project Build' }, { bg: '#fcebeb', color: '#791f1f', text: 'BE: Business Capstone Build' }] },
    { name: 'Sat', label: 'Grad 🎓', today: false, events: [{ bg: 'rgba(249,115,22,.1)', color: '#f97316', text: 'Presentations & Graduation' }, { bg: 'rgba(249,115,22,.1)', color: '#f97316', text: 'Certificate Awarding' }, { bg: 'rgba(249,115,22,.1)', color: '#f97316', text: 'Award Recognition' }] },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-[#6B7280] font-light">Your week at a glance — Mon to Sat intensive format.</p>
        <Badge variant="orange">Cohort 3 · Week 1</Badge>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
        {days.map((d, i) => (
          <div key={i} className={`bg-white border rounded-xl p-3 ${d.today ? 'border-[#f97316]' : 'border-[#E5E7EB]'}`}>
            <div className={`text-center border-b border-[#E5E7EB] pb-2 mb-2.5`}>
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{d.name}</div>
              <div className={`font-[Syne] text-[15px] font-extrabold ${d.today ? 'text-[#f97316]' : 'text-[#111827]'}`}>{d.label}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              {d.events.map((e, ei) => (
                <div key={ei} className="text-[10.5px] px-1.5 py-1.5 rounded leading-snug font-light" style={{ background: e.bg, color: e.color }}>{e.text}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionHead title="Upcoming this week" />
      <Panel>
        {[
          { dot: '#0f6e56', name: 'Personal Productivity Plan', time: 'Leadership & Management · Wednesday · Individual task due', last: false },
          { dot: '#0f6e56', name: 'Draft a Leadership Message to a Team', time: 'Leadership & Management · Wednesday · Individual task due', last: false },
          { dot: '#ba7517', name: 'Mini Business Plan Draft', time: 'Business & Entrepreneurship · Wednesday · Individual task due', last: false },
          { dot: '#185fa5', name: 'Policy Design Lab — Capstone Build Day', time: 'Politics & Governance · Friday · Full day intensive', last: false },
          { dot: '#f97316', name: 'Graduation & Certificate Presentation', time: 'Politics & Governance · Saturday · Edo South cohort', last: true },
        ].map((s, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
              {!s.last && <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />}
            </div>
            <div className="pb-3 flex-1">
              <div className="text-[12.5px] font-semibold text-[#111827]">{s.name}</div>
              <div className="text-[11px] text-[#6B7280]">{s.time}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}

// ─── Page: Capstone ───────────────────────────────────────────────────────────

function PageCapstone() {
  const capstones = [
    { borderColor: '#185fa5', iconBg: '#e6f1fb', iconColor: '#185fa5', icon: 'ti-building-community', schoolColor: '#185fa5', school: 'Politics & Governance', title: 'Community Policy Solution Project', desc: 'Identify one real issue in your Edo South environment and design a full policy solution — from problem identification to implementation plan and expected outcomes.', structure: 'Problem ID · Background & Impact · Stakeholders · Policy Solution · Implementation Plan · Expected Outcomes · Risk & Challenges' },
    { borderColor: '#0f6e56', iconBg: '#e1f5ee', iconColor: '#0f6e56', icon: 'ti-users', schoolColor: '#0f6e56', school: 'Leadership & Management', title: 'Leadership & Management Execution Challenge', desc: 'Build a complete leadership execution system — define a real problem, design your leadership strategy, and map the team coordination model needed to deliver it.', structure: 'Problem ID · Root Cause Analysis · Leadership Strategy · Execution Plan · Team Coordination · Expected Outcomes' },
    { borderColor: '#ba7517', iconBg: '#faeeda', iconColor: '#854f0b', icon: 'ti-briefcase', schoolColor: '#854f0b', school: 'Business & Entrepreneurship', title: 'MAI Business Creation & Entrepreneurship Challenge', desc: 'Launch a complete business — from idea validation and target market analysis to pricing strategy, marketing plan, and a full execution roadmap.', structure: 'Business Idea · Problem Solved · Target Market · Business Model · Marketing Strategy · Financial Plan · Execution Roadmap' },
  ]

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-5">
        Your capstone projects are submitted on Friday and presented on Saturday. All projects must be Edo South centered.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
        {capstones.map((c, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col hover:border-[rgba(249,115,22,0.4)] hover:shadow-md transition-all" style={{ borderTop: `3px solid ${c.borderColor}` }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: c.iconBg, color: c.iconColor }}>
                <i className={`ti ${c.icon}`} />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.schoolColor }}>{c.school}</div>
            </div>
            <div className="font-[Syne] text-[13px] font-bold text-[#111827] mb-2">{c.title}</div>
            <div className="text-[12px] text-[#6B7280] font-light leading-relaxed mb-3">{c.desc}</div>
            <div className="text-[11px] text-[#6B7280] font-light leading-relaxed mb-4">
              <span className="font-medium text-[#111827]">Structure:</span> {c.structure}
            </div>
            <div className="flex items-center justify-between mt-auto">
              <Badge variant="warn">Due Friday</Badge>
              <span className="text-[11px] text-[#6B7280]">Group submission</span>
            </div>
          </div>
        ))}
      </div>

      <SectionHead title="Evaluation criteria" />
      <Panel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: 'ti-eye', bg: 'rgba(249,115,22,.1)', color: '#f97316', title: 'Clarity', desc: 'Clear problem framing and solution communication' },
            { icon: 'ti-hammer', bg: '#e1f5ee', color: '#0f6e56', title: 'Practicality', desc: 'Real-world feasibility and implementation thinking' },
            { icon: 'ti-bulb', bg: '#e6f1fb', color: '#185fa5', title: 'Innovation', desc: 'Creative, original, and forward-thinking approaches' },
            { icon: 'ti-users', bg: '#faeeda', color: '#854f0b', title: 'Team coordination', desc: 'Roles, accountability, and group cohesion' },
          ].map((e, i) => (
            <div key={i} className="text-center p-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mx-auto mb-2" style={{ background: e.bg, color: e.color }}>
                <i className={`ti ${e.icon}`} />
              </div>
              <div className="text-[12px] font-semibold text-[#111827] mb-1">{e.title}</div>
              <div className="text-[11px] text-[#6B7280] font-light leading-relaxed">{e.desc}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

// ─── Page: Certificates ───────────────────────────────────────────────────────

function PageCertificates() {
  const certs = [
    { iconBg: '#e1f5ee', iconColor: '#0f6e56', title: 'MAI Professional Certificate in Public Service & Civic Delivery', school: 'School of Public Service · Cohort 3', status: 'earned', reqs: ['5 of 5 days attended', '2 tasks submitted', 'Capstone submitted & presented'] },
    { iconBg: '#e6f1fb', iconColor: '#185fa5', title: 'MAI Professional Certificate in Politics, Policy & Governance', school: 'School of Politics · Cohort 3', status: 'progress', progress: 80, reqs: ['5 of 6 days attended', 'Capstone due Friday', 'Presentation: Saturday'] },
    { iconBg: '#e1f5ee', iconColor: '#0f6e56', title: 'MAI Professional Certificate in Leadership & Management', school: 'School of Leadership · Cohort 3', status: 'progress', progress: 50, reqs: ['3 of 6 days attended', 'Group task pending', 'Capstone: this Friday'] },
    { iconBg: '#faeeda', iconColor: '#854f0b', title: 'MAI Professional Certificate in Business & Entrepreneurship', school: 'School of Business · Cohort 3', status: 'progress', progress: 33, reqs: ['2 of 6 days attended', 'Mini plan due tomorrow', 'Capstone: this Friday'] },
    { iconBg: '#f0eaff', iconColor: '#6d28d9', title: 'MAI Professional Certificate in Technology & Digital Skills', school: 'School of Technology · Cohort 3', status: 'locked', reqs: ['Enroll to begin', 'Complete 6 days', 'Submit capstone'] },
    { iconBg: '#fce7f3', iconColor: '#831843', title: 'MAI Professional Certificate in AI & Machine Learning', school: 'School of AI & ML · Cohort 3', status: 'locked', reqs: ['Enroll to begin', 'Complete 6 days', 'Submit capstone'] },
  ]

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light mb-5">Earn a certificate from each school by meeting all requirements.</p>
      <div className="flex flex-col gap-3">
        {certs.map((c, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex gap-4 items-start hover:border-[rgba(249,115,22,0.3)] hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: c.iconBg, color: c.iconColor }}>
              <i className="ti ti-certificate" />
            </div>
            <div className="flex-1">
              <div className="font-[Syne] text-[13.5px] font-bold text-[#111827] mb-1">{c.title}</div>
              <div className="text-[12px] text-[#6B7280] font-light mb-2">{c.school}</div>
              {c.status === 'earned' && <Badge variant="success">Earned</Badge>}
              {c.status === 'progress' && (
                <div className="mb-2">
                  <div className="flex justify-between text-[10.5px] text-[#6B7280] mb-1"><span>Progress</span><span>{c.progress}%</span></div>
                  <div className="h-1.5 bg-[#f0ede6] rounded-full overflow-hidden"><div className="h-full bg-[#015b2d] rounded-full" style={{ width: `${c.progress}%` }} /></div>
                </div>
              )}
              {c.status === 'locked' && <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1"><i className="ti ti-lock text-xs" /> Not enrolled</span>}
              <div className="flex flex-wrap gap-2 mt-2">
                {c.reqs.map((r, ri) => (
                  <span key={ri} className="text-[11px] px-2.5 py-1 rounded-full bg-[#F7F4EE] text-[#6B7280]">{r}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page: Enroll ─────────────────────────────────────────────────────────────

function PageEnroll({ navigate }: { navigate: (p: PageKey) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

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
    setTimeout(() => { setSubmitted(false); navigate('dashboard') }, 2000)
  }

  return (
    <div>
      {/* Intro banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 mb-5" style={{ background: 'linear-gradient(135deg, #01381d 0%, #024d26 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)', transform: 'translate(50%, -50%)' }} />
        <h2 className="font-[Syne] text-xl font-extrabold text-white mb-1.5 relative z-10">Enroll in a School</h2>
        <p className="text-[13px] text-white/60 font-light leading-relaxed relative z-10">Choose the schools you want to join this cohort. Each school runs for one intensive week, Monday to Saturday.</p>
      </div>

      {/* School selection */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2.5 text-[13px] font-bold text-[#111827] mb-4">
          <i className="ti ti-book-2 text-[#f97316] text-base" /> Select your schools
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {ENROLL_SCHOOLS.map(s => {
            const isSelected = selected.has(s.id)
            return (
              <label key={s.id} onClick={() => toggle(s.id)} className={`flex items-start gap-3 rounded-lg border-[1.5px] p-3 cursor-pointer transition-all ${isSelected ? 'border-[#f97316] bg-[rgba(249,115,22,0.04)]' : 'border-[#E5E7EB] bg-white hover:border-[#d1d5db]'}`}>
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
        <button onClick={() => navigate('dashboard')} className="text-[12px] font-medium px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Cancel
        </button>
        <button onClick={submit} className="inline-flex items-center gap-1.5 bg-[#f97316] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#ea6a05] transition-colors">
          <i className="ti ti-circle-check text-sm" />
          {submitted ? 'Submitted!' : 'Submit enrollment'}
        </button>
      </div>
    </div>
  )
}

// ─── Page: My Group ───────────────────────────────────────────────────────────

function PageMyGroup() {
  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-5">Your assigned cohort group for this week's group tasks and capstone work.</p>

      <Panel className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-[#faeeda] text-[#854f0b]">
            <i className="ti ti-users" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[#111827]">Group B — Business cohort</div>
            <div className="text-[11.5px] text-[#6B7280]">Business & Entrepreneurship · Cohort 3</div>
          </div>
        </div>
        <Badge variant="success">Active</Badge>
      </Panel>

      <SectionHead title="Members" />
      <Panel>
        {GROUP_MEMBERS.map((m, i) => (
          <div key={i} className={`flex items-center gap-3 py-2.5 ${i < GROUP_MEMBERS.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: '#854f0b' }}>{m.initials}</div>
            <div className="flex-1">
              <div className="text-[12.5px] font-medium text-[#111827]">{m.name} <span className="text-[#6B7280] font-normal">· {m.role}</span></div>
              <div className="text-[11px] text-[#9CA3AF]">Working on: {m.task}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}

// ─── Page: Notifications ──────────────────────────────────────────────────────

function PageNotifications() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS.map(n => ({ ...n })))

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] text-[#6B7280] font-light">Updates on your tasks, groups, and certificates.</p>
        <button onClick={markAllRead} className="text-[12px] font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Mark all as read
        </button>
      </div>
      <Panel>
        {notifs.map((n, i) => (
          <div key={i} className={`flex items-start gap-3 py-3 ${i < notifs.length - 1 ? 'border-b border-[#E5E7EB]' : ''} ${n.unread ? 'bg-[#F7F4EE] -mx-4 px-4 rounded-lg' : ''}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: n.bg, color: n.color }}>
              <i className={`ti ${n.icon}`} />
            </div>
            <div>
              <div className="text-[12.5px] font-medium text-[#111827]">{n.text}</div>
              <div className="text-[11px] text-[#9CA3AF]">{n.time}</div>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-[#f97316] shrink-0 mt-1.5 ml-auto" />}
          </div>
        ))}
      </Panel>
    </div>
  )
}

// ─── Page: Settings ───────────────────────────────────────────────────────────

function PageSettings({ navigate }: { navigate: (p: PageKey) => void }) {
  const [name, setName] = useState('Emeka Ade')
  const [email, setEmail] = useState('emeka.ade@example.com')
  const [prefs, setPrefs] = useState({ deadlines: true, capstone: true, weekly: false })

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-5">Manage your account details and preferences.</p>

      {/* Profile */}
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
              <input
                type={f.type}
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] font-[DM Sans] outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[rgba(249,115,22,0.1)] transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notification prefs */}
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
              <input
                type="checkbox"
                checked={prefs[p.key]}
                onChange={() => setPrefs(prev => ({ ...prev, [p.key]: !prev[p.key] }))}
                className="accent-[#f97316] w-4 h-4"
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 justify-end">
        <button onClick={() => navigate('dashboard')} className="text-[12px] font-medium px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Cancel
        </button>
        <button className="inline-flex items-center gap-1.5 bg-[#f97316] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer hover:bg-[#ea6a05] transition-colors">
          <i className="ti ti-circle-check text-sm" /> Save changes
        </button>
      </div>
    </div>
  )
}

// ─── Root Dashboard ───────────────────────────────────────────────────────────

export default function AcademyDashboard() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const [notifCount] = useState(2)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (page: PageKey) => {
    setActivePage(page)
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }

  const navItems: { key: PageKey; icon: string; label: string; section: 'main' | 'account' }[] = [
    { key: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard', section: 'main' },
    { key: 'schools', icon: 'ti-book-2', label: 'My Schools', section: 'main' },
    { key: 'schedule', icon: 'ti-calendar-week', label: 'Weekly Schedule', section: 'main' },
    { key: 'assignments', icon: 'ti-clipboard-list', label: 'Individual Task', section: 'main' },
    { key: 'capstone', icon: 'ti-trophy', label: 'Capstone Projects', section: 'main' },
    { key: 'certificates', icon: 'ti-certificate', label: 'Certificates', section: 'account' },
    { key: 'enroll', icon: 'ti-circle-plus', label: 'Enroll in School', section: 'account' },
    { key: 'mygroup', icon: 'ti-users', label: 'My Group', section: 'account' },
    { key: 'notifications', icon: 'ti-bell', label: 'Notifications', section: 'account' },
    { key: 'settings', icon: 'ti-settings', label: 'Settings', section: 'account' },
  ]

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.08] mb-3">
        <div className="flex items-center gap-2.5 font-[Syne] text-[15px] font-extrabold text-white tracking-tight">
          <Image src="/image_4.png" alt="MAI" width={36} height={36} className="rounded-lg" />
          MAI Academy
        </div>
      </div>

      {/* Main nav */}
      <div className="px-3.5 mb-1">
        <div className="text-[9px] text-white/30 uppercase tracking-[0.14em] font-bold px-2 py-2">Main</div>
        {navItems.filter(n => n.section === 'main').map(n => (
          <button key={n.key} onClick={() => navigate(n.key)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-normal mb-0.5 cursor-pointer border-none transition-all relative text-left
              ${activePage === n.key ? 'bg-[rgba(249,115,22,0.18)] text-[#f97316] font-medium' : 'bg-transparent text-white/55 hover:bg-white/[0.07] hover:text-white/85'}`}>
            {activePage === n.key && <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-[#f97316]" />}
            <i className={`ti ${n.icon} text-base`} />
            {n.label}
          </button>
        ))}
      </div>

      {/* Account nav */}
      <div className="px-3.5 mt-2">
        <div className="text-[9px] text-white/30 uppercase tracking-[0.14em] font-bold px-2 py-2">Account</div>
        {navItems.filter(n => n.section === 'account').map(n => (
          <button key={n.key} onClick={() => navigate(n.key)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-normal mb-0.5 cursor-pointer border-none transition-all relative text-left
              ${activePage === n.key ? 'bg-[rgba(249,115,22,0.18)] text-[#f97316] font-medium' : 'bg-transparent text-white/55 hover:bg-white/[0.07] hover:text-white/85'}`}>
            {activePage === n.key && <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-[#f97316]" />}
            <i className={`ti ${n.icon} text-base`} />
            {n.label}
            {n.key === 'notifications' && notifCount > 0 && (
              <span className="ml-auto bg-[#f97316] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{notifCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 py-4 border-t border-white/[0.08] flex items-center gap-2.5">
        <Avatar initials="EA" size="lg" />
        <div className="text-[13px] font-semibold text-white tracking-tight">Emeka Ade</div>
      </div>
    </>
  )

  return (
    <>
      {/* Tabler icons CDN */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div className="flex min-h-screen bg-[#f0ede6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-[240px] shrink-0 bg-[#01381d] flex-col sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-[240px] bg-[#01381d] flex flex-col overflow-y-auto">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <div className="bg-white border-b border-[#E5E7EB] px-5 lg:px-7 h-[62px] flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F4EE] transition-colors cursor-pointer">
                <i className="ti ti-menu-2 text-base" />
              </button>
              <div>
                <div className="text-[11px] text-[#6B7280] font-light">MAI Academy</div>
                <div className="font-[Syne] text-[17px] font-extrabold text-[#111827] tracking-tight leading-tight">{PAGE_TITLES[activePage]}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={() => navigate('assignments')} className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
                <i className="ti ti-clipboard-list text-sm" /> View tasks
              </button>
              <button onClick={() => navigate('enroll')} className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-2 rounded-lg bg-[#f97316] text-white border-none cursor-pointer hover:bg-[#ea6a05] transition-colors">
                <i className="ti ti-circle-plus text-sm" /> Enroll
              </button>
              <button onClick={() => navigate('notifications')} className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F4EE] transition-colors cursor-pointer">
                <i className="ti ti-bell text-base" />
                {notifCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f97316]" />}
              </button>
              <Avatar initials="EA" size="sm" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-5 lg:p-7">
              {activePage === 'dashboard' && <PageDashboard navigate={navigate} />}
              {activePage === 'assignments' && <PageAssignments navigate={navigate} />}
              {activePage === 'schools' && <PageSchools navigate={navigate} />}
              {activePage === 'schedule' && <PageSchedule />}
              {activePage === 'capstone' && <PageCapstone />}
              {activePage === 'certificates' && <PageCertificates />}
              {activePage === 'enroll' && <PageEnroll navigate={navigate} />}
              {activePage === 'mygroup' && <PageMyGroup />}
              {activePage === 'notifications' && <PageNotifications />}
              {activePage === 'settings' && <PageSettings navigate={navigate} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}