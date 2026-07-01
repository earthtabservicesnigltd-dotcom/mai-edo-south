import { Badge, Panel, SectionHead } from '@/components/ui/shared'

export default function CapstonePage() {
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
          <div key={i}
            className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col hover:border-[rgba(249,115,22,0.4)] hover:shadow-[0_2px_16px_rgba(1,56,29,0.07)] transition-all"
            style={{ borderTop: `3px solid ${c.borderColor}` }}>
            
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                style={{ background: c.iconBg, color: c.iconColor }}>
                <i className={`ti ${c.icon}`} />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.schoolColor }}>{c.school}</div>
            </div>

            <div className="font-[Syne] text-[13px] font-bold text-[#111827] mb-2">{c.title}</div>
            <div className="text-[12px] text-[#6B7280] font-light leading-relaxed mb-3">{c.desc}</div>
            
            <div className="text-[11px] text-[#6B7280] font-light leading-relaxed mb-4">
              <span className="font-medium text-[#111827]">Structure:</span> {c.structure}
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#E5E7EB]">
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
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mx-auto mb-2"
                style={{ background: e.bg, color: e.color }}>
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
