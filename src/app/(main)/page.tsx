import Image from 'next/image'
import Link from 'next/link'

const MISSION_PILLARS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    title: 'Effective Representation',
    desc: 'Giving Edo South a strong, credible voice in the Senate.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
      </svg>
    ),
    title: 'Infrastructure & Development',
    desc: 'Attracting and supporting projects that improve lives and livelihoods.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
      </svg>
    ),
    title: 'Education & Youth Empowerment',
    desc: 'Creating opportunities for our young people to learn, grow and lead.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
      </svg>
    ),
    title: 'Healthcare Access for All',
    desc: 'Improving healthcare delivery and advocating for better facilities.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
      </svg>
    ),
    title: 'Jobs & Economic Growth',
    desc: 'Supporting businesses and creating sustainable economic opportunities.',
  },
]

const EXPERIENCE = [
  { years: '1999 – 2007', title: 'Member, Edo State House of Assembly (Ikpoba-Okha Constituency)', icon: '🏛️' },
  { years: '1999 – 2003', title: 'Majority Leader, Edo State House of Assembly', icon: '🤝' },
  { years: '2005 – 2009', title: 'Edo State Commissioner, Niger Delta Development Commission (NDDC)', icon: '🏅' },
  { years: '2012 | 2016', title: 'Governorship Aspirant, Edo State', icon: '🚩' },
  { years: '2022',        title: 'PDP Candidate, Edo South Senatorial District', icon: '👤' },
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen  overflow-hidden flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/image-edited.png"
            alt=""
            fill
            className="object-cover object-center opacity-20"
            priority
          />
        </div>

        {/* Green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#01381d]/95 via-[#01381d]/80 to-[#015b2d]/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left — text */}
            <div className='relative flex flex-col justify-center items-start order-2 lg:order-1'>
              <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-4">
                Edo South Deserves Better
              </p>
              <h1 className="font-heading text-6xl md:text-7xl text-white leading-tight mb-6">
                EXPERIENCED.<br />
                PREPARED.<br />
                <span className="text-[#f97316]">READY TO SERVE.</span>
              </h1>
              <p className="text-gray-200 text-lg leading-relaxed max-w-lg mb-8">
                Hon. Mathew Aigbuhenze Iduoriyekemwen (MAI) is a tested leader with a proven
                record of service, legislative excellence, and people-first representation.
                Now, he seeks your mandate to take Edo South to the Senate in 2027.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="bg-[#f97316] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white hover:text-[#f97316] transition-colors"
                >
                  ABOUT MAI
                </Link>
                <Link
                  href="/agenda"
                  className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white hover:text-[#01381d] transition-colors"
                >
                  OUR AGENDA
                </Link>
              </div>
            </div>

            {/* Right — candidate photo + badge */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="bg-linear-to-b h-100 md:h-full from-[#015b2d] to-[#01381d] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  
                  {/* ADC Logo — top left */}
                  <div className="absolute top-4 left-4 z-10">
                    <Image
                      src="/image-21.jpg"
                      alt="ADC Logo"
                      width={100}
                      height={100}
                      className="object-contain rounded-lg shadow-md w-20 lg:w-25 h-20 lg:h-25"
                    />
                  </div>

                  {/* Candidate photo */}
                  <Image
                  src="/image-24.png"
                  alt="Hon. Matthew Aigbuhenze Iduoriyekemwen"
                  width={480}
                  height={560}
                  className="object-cover object-top w-full h-full"
                  priority
                />
                </div>

                {/* MAI Badge — top right */}
                <div className="absolute right-1 bottom-4 bg-white rounded-2xl p-3 shadow-xl text-center max-w-35">
                  <Image
                    src="/image_4.png"
                    alt="MAI"
                    width={70}
                    height={70}
                    className="object-contain mx-auto"
                  />
                  <p className="text-[#01381d] font-bold text-[10px] leading-tight">
                    Edo South 2027
                  </p>
                  <p className="text-[9px] text-gray-500 leading-tight">
                    Hon Mathew Aigbuhenze<br />Iduoriyekemwen
                  </p>
                  <div className="mt-1 bg-[#f97316] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    4 SENATE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── MISSION PILLARS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">
              What I Stand For
            </p>
            <h2 className="font-heading text-5xl md:text-6xl">
              A STRONGER <span className="text-[#f97316]">EDO SOUTH</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {MISSION_PILLARS.map((p, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className="w-16 h-16 bg-[#015b2d] text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#f97316] transition-colors">
                  {p.icon}
                </div>
                <h4 className="font-bold text-[15px] mb-2 leading-snug">{p.title}</h4>
                <p className="text-gray-500 text-[13px] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section
        className="py-20 bg-[#01381d] relative overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url(/Image-2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-14">
            <p className="text-[#f97316] text-center font-bold text-sm uppercase tracking-widest mb-2">
              A Proven Track Record
            </p>
            <h2 className="font-heading text-5xl md:text-6xl text-white text-center">
              EXPERIENCE THAT DELIVERS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {EXPERIENCE.map((e, i) => (
              <div key={i} className="text-center border-r border-white/20 last:border-0 px-4 py-6">
                <div className="text-4xl mb-3">{e.icon}</div>
                <h4 className="font-bold text-white text-lg mb-2">{e.years}</h4>
                <p className="text-gray-300 text-[13px] leading-relaxed">{e.title}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/about"
              className="inline-block border-2 border-white text-white font-bold px-10 py-3.5 rounded-xl hover:bg-white hover:text-[#01381d] transition-colors"
            >
              VIEW FULL PROFILE
            </Link>
          </div>
        </div>
      </section>

      {/* ── MOVEMENT ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-6xl leading-tight mb-6">
                TOGETHER, LET&apos;S BUILD<br />
                A GREATER <span className="text-[#f97316]">EDO SOUTH</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                This is our time. This is our chance. Let&apos;s work together
                for real representation, meaningful development and
                a better future for our people.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/volunteer"
                  className="bg-[#f97316] text-white px-2 py-3.5 rounded-xl hover:bg-[#015b2d] transition-colors"
                >
                  JOIN THE MOVEMENT
                </Link>
                <Link
                  href="/donate"
                  className="border-2 border-gray-800 text-gray-800 px-4 py-3.5 rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
                >
                  DONATE NOW
                </Link>
              </div>
            </div>
            <div>
              <Image
                src="/Image-2.png"
                alt="MAI Campaign Movement"
                width={600}
                height={400}
                className="w-full rounded-2xl object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTY SECTION ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
              <Image
                src="/image-3.jpg"
                alt="ADC Logo"
                width={180}
                height={180}
                className="object-contain mx-auto mb-6 rounded-xl"
              />
              <h3 className="font-bold text-2xl mb-3">Proudly Associated With ADC</h3>
              <p className="text-gray-500 leading-relaxed">
                Building a stronger political movement focused on people,
                development, accountability and inclusive governance.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-4xl md:text-6xl leading-tight mb-6">
                A NEW VISION FOR{' '}
                <span className="text-[#f97316]">NIGERIA</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Through strategic leadership, youth empowerment, quality education,
                infrastructure development and people-focused governance, MAI remains
                committed to building a better future for Edo South and Nigeria.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { title: 'People First Leadership', desc: 'Focused on transparency and service.' },
                  { title: 'Youth Empowerment', desc: 'Creating jobs and opportunities.' },
                  { title: 'Quality Education', desc: 'Investing in the next generation.' },
                  { title: 'Infrastructure', desc: 'Building roads, hospitals and schools.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#015b2d] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <div>
                      <h5 className="font-bold text-sm">{item.title}</h5>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}