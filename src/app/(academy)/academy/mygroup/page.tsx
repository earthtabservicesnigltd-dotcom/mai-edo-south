import { Badge, Panel, SectionHead } from '@/components/ui/shared'
import { GROUP_MEMBERS } from '@/lib/constant'

export default function MyGroupPage() {
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