import Link from 'next/link'

const PILLARS = [
  {
    icon: '🏛️',
    tag: 'Governance',
    title: 'Transparent Leadership',
    desc: 'Accountability and transparency in public service delivery and resource management.',
    points: [
      'Open budget process and public financial reporting',
      'Zero tolerance for corruption and mismanagement',
      'Regular town hall meetings with constituents',
      'Independent oversight of constituency projects',
      'Accessible and responsive representation',
    ],
  },
  {
    icon: '📈',
    tag: 'Economy',
    title: 'Job Creation & Economic Growth',
    desc: 'Empowering SMEs, agriculture, and industry to reduce unemployment and increase income.',
    points: [
      'Micro-finance support for small businesses',
      'Agricultural modernisation and farmer support',
      'Industrial development zones in Edo South',
      'Tax incentives to attract local and foreign investment',
      'Export promotion for local goods and produce',
    ],
  },
  {
    icon: '🎓',
    tag: 'Education',
    title: 'Quality Education for All',
    desc: 'Modern learning systems, teacher development, and improved school infrastructure.',
    points: [
      'Renovation and equipping of public schools',
      'Scholarship programmes for outstanding students',
      'Teacher recruitment, training and welfare improvement',
      'Digital learning tools and ICT infrastructure',
      'Technical and vocational education expansion',
    ],
  },
  {
    icon: '🏥',
    tag: 'Health',
    title: 'Healthcare Access',
    desc: 'Affordable and accessible healthcare systems across all communities in Edo South.',
    points: [
      'Upgrade of primary and secondary healthcare facilities',
      'Free maternal and child healthcare programmes',
      'Mobile health units for rural communities',
      'Recruitment and welfare of healthcare workers',
      'Affordable drugs and medical supplies',
    ],
  },
  {
    icon: '⚡',
    tag: 'Infrastructure',
    title: 'Modern Development',
    desc: 'Roads, electricity, and digital systems that support economic growth and quality of life.',
    points: [
      'Rehabilitation of roads and bridges across Edo South',
      'Rural electrification and power supply improvement',
      'Broadband internet infrastructure expansion',
      'Clean water supply and sanitation projects',
      'Urban renewal and housing development',
    ],
  },
  {
    icon: '👥',
    tag: 'Social Impact',
    title: 'Youth & Women Empowerment',
    desc: 'Skills development, funding opportunities, and leadership inclusion for youth and women.',
    points: [
      'Youth entrepreneurship grants and mentorship',
      'Women leadership development programmes',
      'Sports and recreation facilities for communities',
      'Support for persons with disabilities',
      'Senior citizen welfare and social protection',
    ],
  },
]

export default function ManifestoPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            Our Vision
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            MANIFESTO <span className="text-[#f97316]">2027</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">
            A structured roadmap for development, governance, and
            prosperity in Edo South Senatorial District.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-3">
            Core Pillars
          </p>
          <h2 className="font-heading text-5xl md:text-6xl mb-6">
            WHAT WE <span className="text-[#f97316]">STAND FOR</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            This manifesto presents a structured development agenda focused on
            governance, economy, education, health, infrastructure and social
            impact. These are our commitments to the people of Edo South.
          </p>
        </div>
      </section>

      {/* Policy Cards */}
      <section className="pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-gray-100"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-[#f97316]/10 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {pillar.icon}
                </div>

                {/* Tag */}
                <span className="inline-block bg-[#015b2d]/10 text-[#015b2d] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {pillar.tag}
                </span>

                <h5 className="font-bold text-lg mb-2">{pillar.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{pillar.desc}</p>

                <ul className="space-y-2">
                  {pillar.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-gray-500 text-[13px] leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[#01381d] to-[#015b2d] rounded-3xl p-10 md:p-16 text-white text-center">
            <h2 className="font-heading text-5xl md:text-6xl mb-4">
              READ THE FULL <span className="text-[#f97316]">MANIFESTO</span>
            </h2>
            <p className="text-gray-200 text-lg max-w-xl mx-auto mb-8">
              Download the complete MAI 2027 manifesto document for a
              detailed breakdown of all our policies and commitments.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-[#f97316] text-white font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-[#f97316] transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Download PDF
              </button>
              <Link
                href="/agenda"
                className="border-2 border-white text-white font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-[#01381d] transition-colors"
              >
                VIEW AGENDA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-5xl mb-4">
            SUPPORT THE <span className="text-[#f97316]">VISION</span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Join thousands of Edo South residents who believe in this vision.
            Volunteer, donate or simply spread the word.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/volunteer"
              className="bg-[#01381d] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#f97316] transition-colors"
            >
              VOLUNTEER
            </Link>
            <Link
              href="/donate"
              className="border-2 border-[#01381d] text-[#01381d] font-bold px-10 py-4 rounded-xl hover:bg-[#01381d] hover:text-white transition-colors"
            >
              DONATE
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}