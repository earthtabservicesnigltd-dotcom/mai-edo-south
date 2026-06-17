'use client'
import { useState } from 'react'
import Image from 'next/image'

const NEWS = [
  {
    id: 1,
    tag: 'Campaign',
    title: 'MAI Officially Declares Senatorial Bid for Edo South 2027',
    excerpt: 'Hon. Matthew Aigbuhenze Iduoriyekemwen has officially declared his intention to contest the Edo South Senatorial seat under the ADC platform in the 2027 general elections.',
    date: 'May 15, 2026',
    image: '/IMG-20260529-WA0007.jpg',
    featured: true,
  },
  {
    id: 2,
    tag: 'Community',
    title: 'MAI Meets with Youth Leaders Across Edo South LGAs',
    excerpt: 'In a series of town hall meetings, MAI engaged with youth leaders from all seven local government areas of Edo South, discussing employment, education and development.',
    date: 'May 20, 2026',
    image: '/Image-2.png',
    featured: false,
  },
  {
    id: 3,
    tag: 'Politics',
    title: 'ADC Endorses MAI as Preferred Senatorial Candidate',
    excerpt: 'The Alliance for Democracy and Credibility has formally endorsed Hon. MAI as their senatorial candidate for Edo South in the upcoming 2027 elections.',
    date: 'May 25, 2026',
    image: '/image-3.jpg',
    featured: false,
  },
  {
    id: 4,
    tag: 'Development',
    title: 'MAI Unveils Comprehensive Development Agenda for Edo South',
    excerpt: 'A detailed policy document outlining specific plans for infrastructure, education, healthcare and economic development across Edo South was released by the campaign.',
    date: 'June 1, 2026',
    image: '/IMG-20260529-WA0008.jpg',
    featured: false,
  },
  {
    id: 5,
    tag: 'Campaign',
    title: 'Campaign Kicks Off Grassroots Mobilization Drive',
    excerpt: 'The MAI campaign has launched a massive grassroots mobilization exercise targeting over 500 polling units across Edo South Senatorial District.',
    date: 'June 5, 2026',
    image: null,
    featured: false,
  },
  {
    id: 6,
    tag: 'Community',
    title: 'MAI Foundation Donates to Schools in Orhionmwon LGA',
    excerpt: 'As part of his commitment to education, Hon. MAI donated school supplies and equipment to five public primary schools in Orhionmwon local government area.',
    date: 'June 10, 2026',
    image: null,
    featured: false,
  },
]

const TAGS = ['All', 'Campaign', 'Community', 'Politics', 'Development']

const TAG_COLORS: Record<string, string> = {
  Campaign:    'bg-orange-100 text-orange-700',
  Community:   'bg-green-100 text-green-700',
  Politics:    'bg-blue-100 text-blue-700',
  Development: 'bg-purple-100 text-purple-700',
}

function shareArticle(platform: string, title: string) {
  const url = window.location.href
  const links: Record<string, string> = {
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  }
  window.open(links[platform], '_blank')
}

export default function NewsPage() {
  const [activeTag, setActiveTag] = useState('All')

  const featured = NEWS.find(n => n.featured)
  const rest = NEWS.filter(n => !n.featured).filter(
    n => activeTag === 'All' || n.tag === activeTag
  )

  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            Latest From The Campaign
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            MAI <span className="text-[#f97316]">NEWS</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-xl">
            Stay informed with the latest news, press releases and
            updates from the MAI campaign.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-heading text-4xl md:text-5xl">
                FEATURED <span className="text-[#f97316]">STORY</span>
              </h2>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-72 lg:h-auto bg-gradient-to-br from-[#01381d] to-[#015b2d]">
                  {featured.image && (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover object-top"
                    />
                  )}
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit ${TAG_COLORS[featured.tag] ?? 'bg-gray-100 text-gray-700'}`}>
                    {featured.tag}
                  </span>
                  <h3 className="font-bold text-2xl md:text-3xl leading-snug mb-4">
                    {featured.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="text-sm text-gray-400">{featured.date}</span>
                    <div className="flex items-center gap-2">
                      {['twitter', 'facebook', 'whatsapp', 'linkedin'].map(p => (
                        <button
                          key={p}
                          onClick={() => shareArticle(p, featured.title)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#f97316] hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                        >
                          {p === 'twitter' ? '𝕏' : p === 'facebook' ? 'f' : p === 'whatsapp' ? '💬' : 'in'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter + News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                  activeTag === tag
                    ? 'bg-[#f97316] border-[#f97316] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-[#f97316]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* News grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(article => (
              <div
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="relative h-52 bg-gradient-to-br from-[#f97316] to-[#c2410c]">
                  {article.image && (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover object-top"
                    />
                  )}
                </div>
                <div className="p-6">
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${TAG_COLORS[article.tag] ?? 'bg-gray-100 text-gray-700'}`}>
                    {article.tag}
                  </span>
                  <h5 className="font-bold text-[16px] leading-snug mb-2">{article.title}</h5>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <span className="text-xs text-gray-400">{article.date}</span>
                    <div className="flex items-center gap-1.5">
                      {['twitter', 'facebook', 'whatsapp'].map(p => (
                        <button
                          key={p}
                          onClick={() => shareArticle(p, article.title)}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#f97316] hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                        >
                          {p === 'twitter' ? '𝕏' : p === 'facebook' ? 'f' : '💬'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press mentions */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-4xl md:text-5xl">
              IN THE <span className="text-[#f97316]">PRESS</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { source: 'Vanguard Newspaper', title: 'MAI Promises Infrastructure Revolution for Edo South', date: 'June 8, 2026' },
              { source: 'Punch Newspaper', title: 'Edo South Senatorial Race: MAI Emerges Frontrunner', date: 'June 3, 2026' },
              { source: 'ThisDay', title: 'ADC Candidate MAI Draws Massive Support in Edo South', date: 'May 28, 2026' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 border-l-4 border-[#f97316] bg-white shadow-sm rounded-r-xl">
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#f97316] uppercase tracking-wide mb-1">{item.source}</p>
                  <h5 className="font-bold text-[15px]">{item.title}</h5>
                </div>
                <span className="text-xs text-gray-400 shrink-0 mt-1">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[#01381d] to-[#015b2d] rounded-3xl p-10 md:p-16 text-center text-white">
            <h2 className="font-heading text-5xl mb-3">STAY UPDATED</h2>
            <p className="text-gray-200 mb-8">
              Subscribe to get the latest news and updates from the campaign.
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 px-5 py-3 rounded-xl focus:outline-none focus:border-[#f97316] text-sm"
              />
              <button className="bg-[#f97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-[#f97316] transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}