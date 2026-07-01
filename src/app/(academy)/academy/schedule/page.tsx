import { Badge, Panel, SectionHead } from '@/components/ui/shared'

const days = [
  { name: 'Mon', label: 'Individual', today: false, events: [
    { bg: '#e6f1fb', color: '#0c447c', text: 'PPG: Foundations of Politics' },
    { bg: '#e1f5ee', color: '#085041', text: 'LM: Foundations of Leadership' },
    { bg: '#faeeda', color: '#633806', text: 'BE: Business Foundations' },
  ]},
  { name: 'Tue', label: 'Group', today: false, events: [
    { bg: '#e6f1fb', color: '#0c447c', text: 'PPG: Community Problem Selection' },
    { bg: '#e1f5ee', color: '#085041', text: 'LM: Team Dynamics & Challenges' },
    { bg: '#faeeda', color: '#633806', text: 'BE: Market & Team Formation' },
  ]},
  { name: 'Wed', label: 'Individual', today: true, events: [
    { bg: '#e6f1fb', color: '#0c447c', text: 'PPG: Political Communication' },
    { bg: '#e1f5ee', color: '#085041', text: 'LM: Personal Management Skills' },
    { bg: '#faeeda', color: '#633806', text: 'BE: Business Planning' },
  ]},
  { name: 'Thu', label: 'Group', today: false, events: [
    { bg: '#e6f1fb', color: '#0c447c', text: 'PPG: Governance & Accountability' },
    { bg: '#e1f5ee', color: '#085041', text: 'LM: Team Execution & Strategy' },
    { bg: '#faeeda', color: '#633806', text: 'BE: Product Dev & Marketing' },
  ]},
  { name: 'Fri', label: 'Capstone', today: false, events: [
    { bg: '#fcebeb', color: '#791f1f', text: 'PPG: Policy Design Lab — Full Day' },
    { bg: '#fcebeb', color: '#791f1f', text: 'LM: Capstone Project Build' },
    { bg: '#fcebeb', color: '#791f1f', text: 'BE: Business Capstone Build' },
  ]},
  { name: 'Sat', label: 'Grad 🎓', today: false, events: [
    { bg: 'rgba(249,115,22,.1)', color: '#f97316', text: 'Presentations & Graduation' },
    { bg: 'rgba(249,115,22,.1)', color: '#f97316', text: 'Certificate Awarding' },
    { bg: 'rgba(249,115,22,.1)', color: '#f97316', text: 'Award Recognition' },
  ]},
]

const upcoming = [
  { dot: '#0f6e56', name: 'Personal Productivity Plan', time: 'Leadership & Management · Wednesday · Individual task due' },
  { dot: '#0f6e56', name: 'Draft a Leadership Message to a Team', time: 'Leadership & Management · Wednesday · Individual task due' },
  { dot: '#ba7517', name: 'Mini Business Plan Draft', time: 'Business & Entrepreneurship · Wednesday · Individual task due' },
  { dot: '#185fa5', name: 'Policy Design Lab — Capstone Build Day', time: 'Politics & Governance · Friday · Full day intensive' },
  { dot: '#f97316', name: 'Graduation & Certificate Presentation', time: 'Politics & Governance · Saturday · Edo South cohort' },
]

export default function SchedulePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] text-[#6B7280] font-light">Your week at a glance — Mon to Sat intensive format.</p>
        <Badge variant="orange">Cohort 3 · Week 1</Badge>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
        {days.map((d, i) => (
          <div key={i} className={`bg-white border rounded-xl p-3.5 ${d.today ? 'border-[#f97316]' : 'border-[#E5E7EB]'}`}>
            <div className="text-center pb-2.5 mb-2.5 border-b border-[#E5E7EB]">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.08em]">{d.name}</div>
              <div className={`font-[Syne] text-[16px] font-extrabold mt-0.5 ${d.today ? 'text-[#f97316]' : 'text-[#111827]'}`}>{d.label}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              {d.events.map((e, ei) => (
                <div key={ei} className="text-[10.5px] leading-snug px-2 py-1.5 rounded" style={{ background: e.bg, color: e.color }}>{e.text}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionHead title="Upcoming this week" />
      <Panel>
        {upcoming.map((s, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
              {i < upcoming.length - 1 && <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />}
            </div>
            <div className={`${i < upcoming.length - 1 ? 'pb-3' : ''} flex-1`}>
              <div className="text-[12.5px] font-semibold text-[#111827] mb-0.5">{s.name}</div>
              <div className="text-[11px] text-[#6B7280] font-light">{s.time}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}
