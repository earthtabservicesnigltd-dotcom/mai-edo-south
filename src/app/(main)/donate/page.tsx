import Link from 'next/link'
import Image from 'next/image'

const AMOUNTS = [
  { value: '1000',  label: '₦1,000' },
  { value: '5000',  label: '₦5,000' },
  { value: '10000', label: '₦10,000' },
  { value: '25000', label: '₦25,000' },
  { value: '50000', label: '₦50,000' },
  { value: 'custom', label: 'Custom Amount' },
]

const IMPACT = [
  { amount: '₦5,000',    desc: 'Prints 100 campaign flyers for community distribution' },
  { amount: '₦10,000',   desc: 'Covers transportation for a campaign mobilizer for one week' },
  { amount: '₦25,000',   desc: 'Sponsors a community outreach event in one polling unit' },
  { amount: '₦50,000',   desc: 'Funds a town hall meeting for an entire ward' },
  { amount: '₦100,000',  desc: 'Covers media coverage of a major campaign event' },
  { amount: '₦500,000+', desc: 'Sponsors a full LGA campaign rally and engagement' },
]

export default function DonatePage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            Support The Campaign
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            DONATE <span className="text-[#f97316]">NOW</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">
            Your contribution fuels the movement. Every naira counts
            towards building a better Edo South.
          </p>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">
              Why Your Support Matters
            </p>
            <h2 className="font-heading text-4xl md:text-5xl">
              FUEL THE <span className="text-[#f97316]">MOVEMENT</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: '📢',
                title: 'Spread the Message',
                desc: 'Fund campaign materials, events and media outreach to reach every voter in Edo South.',
              },
              {
                icon: '🚗',
                title: 'Mobilise Supporters',
                desc: 'Cover logistics, transportation and coordination for grassroots mobilization across all LGAs.',
              },
              {
                icon: '🏘️',
                title: 'Reach Every Community',
                desc: 'Ensure no community in Edo South is left out of the campaign conversation.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Donation form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="font-bold text-2xl mb-6">Choose Your Contribution</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {AMOUNTS.map(a => (
                  <button
                    key={a.value}
                    className="border-2 border-gray-200 rounded-xl py-3 text-sm font-bold hover:border-[#f97316] hover:text-[#f97316] transition-colors"
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Full Name <span className="text-[#f97316]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Email Address <span className="text-[#f97316]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Custom Amount (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount in Naira"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>
              </div>

              <button className="w-full bg-[#f97316] text-white font-bold py-4 rounded-xl hover:bg-[#015b2d] transition-colors uppercase tracking-wider">
                Proceed to Payment
              </button>

              <div className="flex items-center gap-2 mt-4 justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/>
                </svg>
                <p className="text-xs text-gray-400">
                  Payments are secured and processed via Paystack
                </p>
              </div>
            </div>

            {/* Impact */}
            <div>
              <h3 className="font-bold text-2xl mb-6">Your Impact</h3>
              <div className="space-y-4">
                {IMPACT.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="bg-[#f97316] text-white font-bold text-sm px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap">
                      {item.amount}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* ADC logo */}
              <div className="mt-8 p-6 bg-[#015b2d]/5 border border-[#015b2d]/10 rounded-2xl text-center">
                <Image
                  src="/image-3.jpg"
                  alt="ADC"
                  width={80}
                  height={80}
                  className="rounded-xl mx-auto mb-3 object-contain"
                />
                <p className="text-sm text-gray-500 leading-relaxed">
                  This campaign is run under the platform of the
                  Alliance for Democracy and Credibility (ADC).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-5xl mb-4">
            CAN&apos;T DONATE? <span className="text-[#f97316]">VOLUNTEER!</span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Your time and skills are just as valuable as financial support.
            Join our team of volunteers across Edo South.
          </p>
          <Link
            href="/volunteer"
            className="inline-block bg-[#01381d] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#f97316] transition-colors"
          >
            BECOME A VOLUNTEER
          </Link>
        </div>
      </section>
    </>
  )
}