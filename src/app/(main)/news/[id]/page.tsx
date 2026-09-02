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
}

export default function NewsDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetch(`/api/news/${id}`)
        .then(res => res.json())
        .then(data => {
          setArticle(data.article)
          setLoading(false)
        })
    }
  }, [id])

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
      {/* HERO IMAGE / HEADER */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-[#01381d]">
        {article.image_url && (
          <Image 
            src={article.image_url} 
            alt={article.title} 
            fill 
            className="object-cover opacity-60" 
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#01381d] via-[#01381d]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto p-6 md:p-10 text-white">
          <Link href="/news" className="inline-flex items-center gap-2 pr-4 text-white/80 hover:text-white text-sm font-semibold mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to News
          </Link>
          
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${TAG_COLORS[article.tag] ?? 'bg-gray-100 text-gray-700'}`}>
            {article.tag}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl leading-tight mb-4">{article.title}</h1>
          <p className="text-gray-300 text-sm">{formatDate(article.date)}</p>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="py-12 md:py-16">
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