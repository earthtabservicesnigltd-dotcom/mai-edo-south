import { Badge } from '@/components/ui/shared'

export default function CertificatesPage() {
  const certs = [
    { iconBg: '#e1f5ee', iconColor: '#0f6e56', title: 'MAI Professional Certificate in Public Service & Civic Delivery', school: 'School of Public Service · Cohort 3', status: 'earned', progress: 0, reqs: ['5 of 5 days attended', '2 tasks submitted', 'Capstone submitted & presented'] },
    { iconBg: '#e6f1fb', iconColor: '#185fa5', title: 'MAI Professional Certificate in Politics, Policy & Governance', school: 'School of Politics · Cohort 3', status: 'progress', progress: 80, reqs: ['5 of 6 days attended', 'Capstone due Friday', 'Presentation: Saturday'] },
    { iconBg: '#e1f5ee', iconColor: '#0f6e56', title: 'MAI Professional Certificate in Leadership & Management', school: 'School of Leadership · Cohort 3', status: 'progress', progress: 50, reqs: ['3 of 6 days attended', 'Group task pending', 'Capstone: this Friday'] },
    { iconBg: '#faeeda', iconColor: '#854f0b', title: 'MAI Professional Certificate in Business & Entrepreneurship', school: 'School of Business · Cohort 3', status: 'progress', progress: 33, reqs: ['2 of 6 days attended', 'Mini plan due tomorrow', 'Capstone: this Friday'] },
    { iconBg: '#f0eaff', iconColor: '#6d28d9', title: 'MAI Professional Certificate in Technology & Digital Skills', school: 'School of Technology · Cohort 3', status: 'locked', progress: 0, reqs: ['Enroll to begin', 'Complete 6 days', 'Submit capstone'] },
    { iconBg: '#fce7f3', iconColor: '#831843', title: 'MAI Professional Certificate in AI & Machine Learning', school: 'School of AI & ML · Cohort 3', status: 'locked', progress: 0, reqs: ['Enroll to begin', 'Complete 6 days', 'Submit capstone'] },
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
                  <div className="h-1.5 bg-[#f0ede6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#015b2d] rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              )}
              {c.status === 'locked' && (
                <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                  <i className="ti ti-lock text-xs" /> Not enrolled
                </span>
              )}
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