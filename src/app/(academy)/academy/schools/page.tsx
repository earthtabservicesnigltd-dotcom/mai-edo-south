import Link from 'next/link'
import { Badge } from '@/components/ui/shared'

export default function SchoolsPage() {
  const schools = [
    { icon: 'ti-building-community', iconBg: '#e6f1fb', iconColor: '#185fa5', num: 'School 01 · Enrolled', title: 'Politics, Policy & Governance', desc: "Understand power, civic responsibility, Nigeria's government structures, public policy cycles, and how to design community-centered policy solutions.", days: [{ label: 'Mon: Foundations', active: true }, { label: 'Tue: Policy Making', active: true }, { label: 'Wed: Communication', active: true }, { label: 'Thu: Accountability', active: true }, { label: 'Fri: Capstone Build', active: true }, { label: 'Sat: Graduation', active: false }], cert: 'MAI Professional Certificate in Politics, Policy & Governance', badge: <Badge variant="success">Day 5 of 6 · 80% complete</Badge>, enrolled: true },
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
          <div key={i} className={`bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col gap-3 transition-all hover:border-[#f97316] hover:shadow-md hover:-translate-y-0.5 ${!s.enrolled ? 'opacity-75' : ''}`}>
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
              <Link href="/academy/enroll" className="self-start inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#f97316] hover:text-[#015b2d] transition-colors">
                Enroll in this school <i className="ti ti-arrow-right text-xs" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}