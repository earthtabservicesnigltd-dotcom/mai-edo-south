'use client'
import { useState } from 'react'
import Image from 'next/image'

const FILTERS = [
  { label: 'All',        value: 'all' },
  { label: 'Campaign',   value: 'campaign' },
  { label: 'Community',  value: 'community' },
  { label: 'Events',     value: 'events' },
  { label: 'Videos',     value: 'video' },
]

const GALLERY_ITEMS = [
  {
    id: 1,
    type: 'image',
    category: 'campaign',
    src: '/IMG-20260529-WA0007.jpg',
    title: 'MAI Campaign Portrait',
    caption: 'Hon. Matthew Aigbuhenze Iduoriyekemwen',
  },
  {
    id: 2,
    type: 'image',
    category: 'campaign',
    src: '/IMG-20260529-WA0008.jpg',
    title: 'Campaign Photo',
    caption: 'MAI for Edo South Senate 2027',
  },
  {
    id: 3,
    type: 'image',
    category: 'community',
    src: '/Image-2.png',
    title: 'Community Rally',
    caption: 'Supporters rally for MAI across Edo South',
  },
  {
    id: 4,
    type: 'image',
    category: 'campaign',
    src: '/image.png',
    title: 'MAI in Traditional Attire',
    caption: 'Hon. MAI in traditional Edo regalia',
  },
  {
    id: 5,
    type: 'image',
    category: 'campaign',
    src: '/image-1-removebg-preview.png',
    title: 'Official Campaign Portrait',
    caption: 'Official portrait of the senatorial candidate',
  },
  {
    id: 6,
    type: 'video',
    category: 'video',
    src: null,
    videoId: 'dQw4w9WgXcQ',
    title: 'Campaign Launch Video',
    caption: 'Watch the official campaign launch',
  },
]

export default function MediaPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightbox, setLightbox]         = useState<{ src: string; title: string } | null>(null)
  const [videoModal, setVideoModal]     = useState<string | null>(null)

  const filtered = GALLERY_ITEMS.filter(
    item => activeFilter === 'all' || item.category === activeFilter
  )

  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">
            Photos & Videos
          </p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            MEDIA <span className="text-[#f97316]">GALLERY</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-xl">
            Moments from the campaign trail — rallies, town halls, community
            engagements and more.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-6 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                  activeFilter === f.value
                    ? 'bg-[#f97316] border-[#f97316] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-[#f97316]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid — Masonry style */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filtered.map(item => (
              <div
                key={item.id}
                className="break-inside-avoid mb-4 rounded-2xl overflow-hidden relative cursor-pointer group"
                onClick={() => {
                  if (item.type === 'video' && item.videoId) setVideoModal(item.videoId)
                  else if (item.src) setLightbox({ src: item.src, title: item.title })
                }}
              >
                {item.type === 'image' && item.src ? (
                  <div className="relative">
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#01381d]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h6 className="text-white font-bold text-sm">{item.title}</h6>
                      <span className="text-[#f97316] text-xs font-semibold uppercase tracking-wide">{item.category}</span>
                      <div className="absolute top-3 right-3 w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-[#01381d] min-h-[200px] flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="w-14 h-14 bg-[#f97316] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <h6 className="font-bold text-sm">{item.title}</h6>
                      <p className="text-gray-300 text-xs mt-1">{item.caption}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center text-white hover:bg-[#015b2d] transition-colors"
            >
              ✕
            </button>
            <Image
              src={lightbox.src}
              alt={lightbox.title}
              width={900}
              height={600}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <p className="text-white text-center mt-4 text-sm opacity-80">{lightbox.title}</p>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setVideoModal(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setVideoModal(null)}
              className="absolute -top-10 right-0 w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center text-white hover:bg-[#015b2d] transition-colors"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videoModal}?autoplay=1`}
              className="w-full h-[450px] rounded-xl"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}