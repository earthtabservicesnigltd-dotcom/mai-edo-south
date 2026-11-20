'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const TAG_COLORS: Record<string, string> = {
  Campaign: 'bg-orange-100 text-orange-700',
  Community: 'bg-green-100 text-green-700',
  Politics: 'bg-blue-100 text-blue-700',
  Development: 'bg-purple-100 text-purple-700',
  'Press Release': 'bg-amber-100 text-amber-700',
  Announcement: 'bg-teal-100 text-teal-700',
}

function shareArticle(platform: string, title: string) {
  if (typeof window === 'undefined') return
  const url = window.location.href
  const links: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  }
  if (links[platform]) {
    window.open(links[platform], '_blank')
  }
}

export default function NewsDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number; ratio: number } | null>(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/news/${id}`)
        .then(res => res.json())
        .then(data => {
          setArticle(data.article)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    if (article?.image_url) {
      const img = new window.Image()
      img.src = article.image_url
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setImgDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
            ratio: img.naturalWidth / img.naturalHeight,
          })
        }
      }
    }
  }, [article?.image_url])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loader" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="font-heading text-4xl text-[#01381d] mb-4">404</h1>
        <p className="text-gray-500 mb-6">We couldn't find this news article.</p>
        <Link href="/news" className="bg-[#f97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#01381d] transition-colors">
          ← Back to all news
        </Link>
      </div>
    )
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="bg-white min-h-screen">
      {/* HERO / HEADER SECTION */}
      <section className="relative bg-gradient-to-br from-[#01381d] via-[#012d17] to-[#015b2d] text-white pt-8 pb-12 sm:pb-16 md:pb-20 px-4 overflow-hidden">
        {/* Subtle decorative circles aligned with main site branding */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link 
            href="/news" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition-colors group"
          >
            <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#f97316] flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            Back to News
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${TAG_COLORS[article.tag] ?? 'bg-white/20 text-white'}`}>
              {article.tag}
            </span>
            <span className="text-white/40 text-sm">•</span>
            <p className="text-gray-300 text-xs sm:text-sm font-medium">
              📅 {formatDate(article.date)}
            </p>
          </div>
          
          <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl leading-tight text-white mb-4">
            {article.title}
          </h1>

          {/* Social share buttons */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-white/60 font-medium mr-1">Share:</span>
            {['twitter', 'facebook', 'whatsapp', 'linkedin'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => shareArticle(p, article.title)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-[#f97316] hover:text-white transition-colors flex items-center justify-center text-xs font-bold text-white/90"
                title={`Share on ${p}`}
              >
                {p === 'twitter' ? '𝕏' : p === 'facebook' ? 'f' : p === 'whatsapp' ? '💬' : 'in'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED IMAGE CONTAINER */}
      {article.image_url && (
        <section className="max-w-4xl mx-auto px-4 -mt-8 sm:-mt-12 md:-mt-14 relative z-20">
          <div
            className={`mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center ${
              imgDimensions && imgDimensions.ratio < 0.95
                ? 'max-w-md md:max-w-lg'
                : 'w-full'
            }`}
            style={{
              aspectRatio: imgDimensions ? `${imgDimensions.width} / ${imgDimensions.height}` : undefined,
              maxHeight: '80vh',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="w-full h-full object-cover object-center block"
              loading="eager"
              onLoad={(e) => {
                const target = e.currentTarget
                if (target.naturalWidth && target.naturalHeight) {
                  setImgDimensions({
                    width: target.naturalWidth,
                    height: target.naturalHeight,
                    ratio: target.naturalWidth / target.naturalHeight,
                  })
                }
              }}
            />
          </div>
        </section>
      )}

      {/* ARTICLE CONTENT */}
      <section className="py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Render full content. Using whitespace-pre-wrap preserves line breaks from the admin textarea */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
            {article.content}
          </div>
        </div>
      </section>
    </div>
  )
}
