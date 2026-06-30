import Image from 'next/image'
import Link from 'next/link'

const TIMELINE = [
  {
    years: '1999 – 2003',
    title: 'Member & Majority Leader',
    org: 'Edo State House of Assembly',
    desc: 'Elected as member representing Ikpoba-Okha constituency and rose to become Majority Leader, championing legislation that benefited constituents.',
  },
  {
    years: '2003 – 2007',
    title: 'Continued Legislative Service',
    org: 'Edo State House of Assembly',
    desc: 'Continued his legislative duties with a focus on education reform, infrastructure development, and community empowerment.',
  },
  {
    years: '2005 – 2009',
    title: 'State Commissioner',
    org: 'Niger Delta Development Commission (NDDC)',
    desc: 'Appointed as Edo State Commissioner at the NDDC, overseeing developmental projects across the Niger Delta region.',
  },
  {
    years: '2012 | 2016',
    title: 'Governorship Aspirant',
    org: 'Edo State',
    desc: 'Contested for the governorship of Edo State, demonstrating his commitment to leadership and service at the highest level.',
  },
  {
    years: '2022',
    title: 'Senatorial Candidate',
    org: 'PDP — Edo South Senatorial District',
    desc: 'Contested the Edo South Senatorial seat, building a strong political network and deepening his connection with constituents.',
  },
  {
    years: '2027',
    title: 'Senatorial Candidate',
    org: 'ADC — Edo South Senatorial District',
    desc: 'Now running under the ADC platform, MAI brings decades of experience and a clear vision for Edo South to the 2027 elections.',
  },
]

const VALUES = [
  { title: 'Integrity',        desc: 'Committed to honest, transparent governance and accountability to the people.' },
  { title: 'Service',          desc: 'A lifelong dedication to putting the needs of Edo South people first.' },
  { title: 'Experience',       desc: 'Decades of legislative and executive experience ready to serve the Senate.' },
  { title: 'Vision',           desc: 'A clear roadmap for the development and transformation of Edo South.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col justify-center items-center">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            The Man Behind The Movement
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            BIOG<span className="text-[#f97316]">RAPHY</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-lg text-center">
            A tested leader with a proven record of service, legislative
            excellence, and people-first representation.
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className="bg-gradient-to-b from-[#015b2d] to-[#01381d] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/img-2.jpeg"
                  alt="Hon. Matthew Aigbuhenze Iduoriyekemwen"
                  width={500}
                  height={750}
                  className="w-full object-cover object-top h-full"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-[#f97316] text-white rounded-2xl p-5 shadow-xl">
                <p className="font-heading text-4xl leading-none">25+</p>
                <p className="text-xs font-bold mt-1">Years of Service</p>
              </div>
            </div>

            <div>
              <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-3">
                Biography
              </p>
              <h2 className="font-heading text-4xl md:text-5xl mb-6 leading-tight">
                HON. MATTHEW
                AIGBUHENZE<br />
                <span className="text-[#f97316]">IDUORIYEKEMWEN</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Hon. Matthew Aigbuhenze Iduoriyekemwen, popularly known as MAI,
                  is a distinguished Nigerian politician, legislator, and statesman
                  from Edo South Senatorial District in Edo State.
                </p>
                <p>
                  With over two decades of active public service, MAI has
                  demonstrated an unwavering commitment to the development of Edo
                  South and the wellbeing of its people. His legislative career in
                  the Edo State House of Assembly — where he served as both member
                  and Majority Leader — cemented his reputation as a principled and
                  effective lawmaker.
                </p>
                <p>
                  As a Commissioner at the Niger Delta Development Commission, he
                  played a pivotal role in directing resources and developmental
                  projects to benefit communities across the Niger Delta region,
                  including Edo State.
                </p>
                <p>
                  Now, as the ADC senatorial candidate for Edo South in 2027, MAI
                  brings his wealth of experience, political maturity, and genuine
                  love for his people to the most important race of his career.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: 'State',       value: 'Edo State' },
                  { label: 'District',    value: 'Edo South' },
                  { label: 'Party',       value: 'ADC' },
                  { label: 'Position',    value: 'Senatorial Candidate' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                    <p className="font-bold text-sm text-[#01381d]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">
              Career Highlights
            </p>
            <h2 className="font-heading text-5xl md:text-6xl">
              POLITICAL <span className="text-[#f97316]">TIMELINE</span>
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#015b2d]/20 -translate-x-1/2" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-0 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#f97316] rounded-full -translate-x-1/2 mt-6 z-10" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <span className="inline-block bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                        {item.years}
                      </span>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-[#015b2d] text-sm font-semibold mb-2">{item.org}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">
              What Drives Him
            </p>
            <h2 className="font-heading text-5xl md:text-6xl">
              CORE <span className="text-[#f97316]">VALUES</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="text-center p-8 border border-gray-100 rounded-2xl hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                <div className="w-14 h-14 bg-[#015b2d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-heading text-2xl">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#01381d]">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="font-heading text-5xl md:text-6xl mb-6">
            JOIN THE <span className="text-[#f97316]">MOVEMENT</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            Be part of the change. Support MAI's vision for a stronger,
            better and more prosperous Edo South.
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