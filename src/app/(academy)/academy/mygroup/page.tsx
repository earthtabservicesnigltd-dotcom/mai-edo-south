import { Badge, Panel, SectionHead } from '@/components/ui/shared'
import { GROUP_MEMBERS } from '@/lib/constant'

export default function MyGroupPage() {
  return (
    <div>
      <p className="text-[13px] text-[#6B7280] font-light leading-relaxed mb-5">
        Your assigned cohort group for this week's group tasks and capstone work.
      </p>

      {/* Group info card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 mb-5 hover:border-[rgba(249,115,22,0.3)] hover:shadow-[0_2px_16px_rgba(1,56,29,0.07)] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center text-lg bg-[#faeeda] text-[#854f0b]">
            <i className="ti ti-users" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[#111827]">Group B — Business cohort</div>
            <div className="text-[11.5px] text-[#6B7280]">Business & Entrepreneurship · Cohort 3</div>
          </div>
        </div>
        <Badge variant="success">Active</Badge>
      </div>

      <SectionHead title="Members" />
      <Panel>
        {GROUP_MEMBERS.map((m, i) => (
          <div key={i} className={`flex items-center gap-3 py-2.5 ${i < GROUP_MEMBERS.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}>
            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 bg-[#854f0b]">
              {m.initials}
            </div>
            <div className="flex-1">
              <div className="text-[12.5px] font-medium text-[#111827]">
                {m.name} <span className="text-[#6B7280] font-normal">· {m.role}</span>
              </div>
              <div className="text-[11px] text-[#9CA3AF] font-light">Working on: {m.task}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}
