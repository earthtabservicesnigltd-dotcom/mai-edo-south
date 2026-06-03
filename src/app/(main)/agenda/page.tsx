import Link from 'next/link'

const AGENDA_ITEMS = [
  {
    number: '01',
    title: 'Infrastructure & Development',
    color: 'bg-orange-500',
    icon: '🏗️',
    summary: 'Massive investment in roads, bridges, public utilities and urban renewal across all LGAs in Edo South.',
    points: [
      'Rehabilitation of major roads and highways across Edo South',
      'Construction of bridges connecting rural communities',
      'Upgrade of public utilities — water, electricity and sanitation',
      'Urban renewal projects in Benin City and surrounding areas',
      'Advocacy for federal allocation to Edo South infrastructure',
    ],
  },
  {
    number: '02',
    title: 'Education & Youth Empowerment',
    color: 'bg-blue-500',
    icon: '🎓',
    summary: 'Creating world-class educational opportunities and equipping young people with skills for the 21st century economy.',
    points: [
      'Scholarship programmes for indigent students at tertiary level',
      'Upgrade of public primary and secondary schools',
      'Establishment of vocational and skills acquisition centres',
      'Youth entrepreneurship grants and startup support',
      'Digital literacy programmes for young people',
    ],
  },
  {
    number: '03',
    title: 'Healthcare Access for All',
    color: 'bg-green-500',
    icon: '🏥',
    summary: 'Improving healthcare delivery, building new facilities and ensuring every resident of Edo South has access to quality medical care.',
    points: [
      'Renovation and equipping of general hospitals across Edo South',
      'Establishment of primary healthcare centres in rural communities',
      'Free maternal and child health programmes',
      'Medical outreach and mobile healthcare units',
      'Advocacy for increased federal health budget allocation',
    ],
  },
  {
    number: '04',
    title: 'Jobs & Economic Growth',
    color: 'bg-purple-500',
    icon: '📈',
    summary: 'Stimulating economic activity, attracting investment and creating sustainable employment opportunities for all.',
    points: [
      'Agricultural investment and support for farmers',
      'Attraction of local and foreign direct investment',
      'Support for small and medium enterprises (SMEs)',
      'Tourism development — leveraging Edo cultural heritage',
      'Creation of industrial and technology parks',
    ],
  },
  {
    number: '05',
    title: 'Effective Representation',
    color: 'bg-red-500',
    icon: '🏛️',
    summary: 'Giving Edo South a strong, credible and active voice in the Senate that fights for the interest of our people.',
    points: [
      'Active sponsorship and passage of bills benefiting Edo South',
      'Regular constituency engagement and town hall meetings',
      'Transparent reporting of senatorial activities to constituents',
      'Collaboration with state and local government on development',
      'Advocacy for Niger Delta rights and resource control',
    ],
  },
  {
    number: '06',
    title: 'Women & Community Development',
    color: 'bg-pink-500',
    icon: '🌺',
    summary: 'Empowering women, supporting communities and ensuring inclusive development that leaves no one behind.',
    points: [
      'Women entrepreneurship and empowerment programmes',
      'Support for women in leadership and governance',
      'Community development grants for grassroots projects',
      'Support for persons with disabilities',
      'Senior citizen welfare and social protection programmes',
    ],
  },
]

export default function AgendaPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            Our Plan for Edo South
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            THE <span className="text-[#f97316]">AGENDA</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-lg text-center">
            A comprehensive, people-centred development agenda for
            Edo South Senatorial District — focused on real results.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-3">
              A Clear Vision
            </p>
            <h2 className="font-heading text-4xl md:text-5xl mb-6">
              WHAT MAI WILL DO FOR{' '}
              <span className="text-[#f97316]">EDO SOUTH</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              The MAI agenda is built on a foundation of experience, grassroots
              consultation and a deep understanding of the challenges facing
              Edo South. These are not empty promises — they are actionable
              commitments backed by a proven track record of delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Agenda Items */}
      <section className="py-10 pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {AGENDA_ITEMS.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
                {/* Left panel */}
                <div className={`${item.color} p-8 text-white flex flex-col justify-center`}>
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <p className="font-heading text-6xl opacity-30 leading-none mb-2">{item.number}</p>
                  <h3 className="font-bold text-xl leading-snug">{item.title}</h3>
                </div>

                {/* Right panel */}
                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">
                    {item.summary}
                  </p>
                  <ul className="space-y-3">
                    {item.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#015b2d] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#01381d]">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="font-heading text-5xl md:text-6xl mb-6">
            SUPPORT THE <span className="text-[#f97316]">AGENDA</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            Help us make this vision a reality. Join the movement,
            volunteer your time or support the campaign financially.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/volunteer"
              className="bg-[#f97316] text-white font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-[#f97316] transition-colors"
            >
              VOLUNTEER
            </Link>
            <Link
              href="/donate"
              className="border-2 border-white text-white font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-[#01381d] transition-colors"
            >
              DONATE NOW
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}