'use client'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'
import { supabaseBrowser } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import {
  Edit3,
  Trash2,
  Star,
  Search,
  Plus,
  X,
  Upload,
  ExternalLink,
  Calendar,
  Tag,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  tag: string
  date: string
  featured: boolean
  image_url: string
  created_at?: string
}

const TAG_OPTIONS = ['Campaign', 'Community', 'Politics', 'Development', 'Press Release', 'Announcement']

const TAG_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  Campaign: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Community: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Politics: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Development: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Press Release': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Announcement: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [updatingFeaturedId, setUpdatingFeaturedId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editUploadingImage, setEditUploadingImage] = useState(false)
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTagFilter, setSelectedTagFilter] = useState('ALL')
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false)

  // Edit Modal State
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    tag: 'Campaign',
    date: '',
    featured: false,
    image_url: ''
  })
  const [editSubmitting, setEditSubmitting] = useState(false)

  const { toggleSidebar } = useSidebar()
  
  // Create Form State
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    tag: 'Campaign',
    date: new Date().toISOString().split('T')[0],
    featured: false,
    image_url: ''
  })

  useEffect(() => {
    loadArticles()
  }, [])

  async function loadArticles() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/news')
      const data = await res.json()
      if (res.ok) {
        setArticles(data.articles || [])
      } else {
        toast.error('Failed to load articles')
      }
    } catch (e) {
      toast.error('Network error loading articles')
    } finally {
      setLoading(false)
    }
  }

  // Upload handler for Create form
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploadingImage(true)
    try {
      const supabase = supabaseBrowser()
      const filePath = `news/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
      const { error } = await supabase.storage.from('site-uploads').upload(filePath, file)
      if (error) throw error
      const { data } = supabase.storage.from('site-uploads').getPublicUrl(filePath)
      setForm(prev => ({ ...prev, image_url: data.publicUrl }))
      toast.success('Cover image uploaded successfully!')
    } catch (err: any) {
      toast.error('Image upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setUploadingImage(false)
    }
  }

  // Upload handler for Edit modal form
  async function handleEditImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setEditUploadingImage(true)
    try {
      const supabase = supabaseBrowser()
      const filePath = `news/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
      const { error } = await supabase.storage.from('site-uploads').upload(filePath, file)
      if (error) throw error
      const { data } = supabase.storage.from('site-uploads').getPublicUrl(filePath)
      setEditForm(prev => ({ ...prev, image_url: data.publicUrl }))
      toast.success('New cover image uploaded!')
    } catch (err: any) {
      toast.error('Image upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setEditUploadingImage(false)
    }
  }

  // Create article handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Article title is required')
    if (!form.content.trim()) return toast.error('Article content is required')

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok && data.article) {
        // If the newly created article is featured, unset featured on others locally
        setArticles(prev => {
          const updatedPrev = form.featured ? prev.map(a => ({ ...a, featured: false })) : prev
          return [data.article, ...updatedPrev]
        })
        setForm({
          title: '',
          excerpt: '',
          content: '',
          tag: 'Campaign',
          date: new Date().toISOString().split('T')[0],
          featured: false,
          image_url: ''
        })
        toast.success(form.featured ? 'Article published and set as Featured Story!' : 'Article published successfully!')
      } else {
        toast.error(data.error || 'Failed to publish article')
      }
    } catch (err) {
      toast.error('An error occurred while publishing')
    } finally {
      setSubmitting(false)
    }
  }

  // Open Edit Modal
  function handleOpenEdit(article: NewsArticle) {
    setEditingArticle(article)
    setEditForm({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      tag: article.tag || 'Campaign',
      date: article.date ? new Date(article.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      featured: !!article.featured,
      image_url: article.image_url || ''
    })
  }

  // Close Edit Modal
  function handleCloseEdit() {
    setEditingArticle(null)
  }

  // Save Edit Changes
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingArticle) return
    if (!editForm.title.trim()) return toast.error('Article title is required')
    if (!editForm.content.trim()) return toast.error('Article content is required')

    setEditSubmitting(true)
    try {
      const res = await fetch('/api/admin/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingArticle.id,
          ...editForm
        })
      })
      const data = await res.json()
      if (res.ok && data.article) {
        setArticles(prev => {
          return prev.map(a => {
            if (a.id === editingArticle.id) {
              return data.article
            }
            // If the updated article was set as featured, ensure all others have featured = false
            if (editForm.featured) {
              return { ...a, featured: false }
            }
            return a
          })
        })
        toast.success(editForm.featured ? 'Post updated & set as the Featured Story!' : 'Post updated successfully!')
        handleCloseEdit()
      } else {
        toast.error(data.error || 'Failed to update article')
      }
    } catch (err) {
      toast.error('An error occurred while saving changes')
    } finally {
      setEditSubmitting(false)
    }
  }

  // Quick 1-Click Feature Toggle
  async function handleToggleFeatured(article: NewsArticle) {
    const willBeFeatured = !article.featured
    setUpdatingFeaturedId(article.id)
    try {
      const res = await fetch('/api/admin/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: article.id,
          featured: willBeFeatured
        })
      })
      const data = await res.json()
      if (res.ok) {
        setArticles(prev =>
          prev.map(a => {
            if (a.id === article.id) {
              return { ...a, featured: willBeFeatured }
            }
            // If we made this one featured, unfeature all others
            if (willBeFeatured) {
              return { ...a, featured: false }
            }
            return a
          })
        )
        if (willBeFeatured) {
          toast.success(`"${article.title.slice(0, 30)}..." is now the Featured Story!`, {
            icon: '⭐'
          })
        } else {
          toast.info('Removed from featured stories')
        }
      } else {
        toast.error(data.error || 'Failed to update featured status')
      }
    } catch (err) {
      toast.error('Failed to change featured post')
    } finally {
      setUpdatingFeaturedId(null)
    }
  }

  // Delete article handler
  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return
    try {
      const res = await fetch('/api/admin/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setArticles(prev => prev.filter(a => a.id !== id))
        toast.success('Article deleted successfully')
      } else {
        toast.error('Failed to delete article')
      }
    } catch (err) {
      toast.error('Error deleting article')
    }
  }

  // Find currently featured article
  const currentFeaturedArticle = useMemo(() => articles.find(a => a.featured), [articles])

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.tag && a.tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTag = selectedTagFilter === 'ALL' || a.tag === selectedTagFilter
      const matchesFeatured = !filterFeaturedOnly || a.featured

      return matchesSearch && matchesTag && matchesFeatured
    })
  }, [articles, searchQuery, selectedTagFilter, filterFeaturedOnly])

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-[#01381d]/10 text-[#01381d] rounded-lg">
              <Sparkles className="w-5 h-5 text-[#f97316]" />
            </span>
            <h1 className="font-heading text-3xl md:text-4xl text-[#01381d] tracking-wide">NEWS MANAGEMENT</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Publish news articles, edit existing posts, and set the designated spotlight <strong className="text-[#f97316]">Featured Story</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/news"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#01381d] bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Public News
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <button
            onClick={loadArticles}
            disabled={loading}
            className="p-2.5 text-gray-600 hover:text-[#01381d] hover:bg-gray-100 rounded-xl transition-colors"
            title="Refresh articles"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={toggleSidebar}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Featured Banner / Quick Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#01381d] to-[#015b2d] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/15 rounded-full -translate-y-8 translate-x-8 blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f97316] flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#f97316]" /> Spotlight Featured Post
              </span>
              <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-full text-white/90">Max: 1 Active</span>
            </div>
            {currentFeaturedArticle ? (
              <div>
                <h3 className="font-bold text-base line-clamp-1 text-white">{currentFeaturedArticle.title}</h3>
                <p className="text-xs text-emerald-100 mt-1 flex items-center gap-2">
                  <span>📅 {new Date(currentFeaturedArticle.date).toLocaleDateString('en-GB')}</span>
                  <span>•</span>
                  <span>🏷️ {currentFeaturedArticle.tag}</span>
                </p>
              </div>
            ) : (
              <div className="py-1">
                <p className="text-sm text-gray-200">No article is currently set as featured.</p>
                <p className="text-xs text-white/60 mt-0.5">Click ⭐ &quot;Make Featured&quot; on any post below to spotlight it.</p>
              </div>
            )}
          </div>
          {currentFeaturedArticle && (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-emerald-200">Currently showing at the top of /news</span>
              <button
                onClick={() => handleOpenEdit(currentFeaturedArticle)}
                className="text-xs text-[#f97316] font-bold hover:underline inline-flex items-center gap-1"
              >
                Edit Story →
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Published</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-heading text-[#01381d]">{articles.length}</span>
              <span className="text-xs text-gray-500">Articles in archive</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live & available to all campaign visitors
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Rules</span>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Only <strong>1 single post</strong> is active as Featured at a time.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Editing automatically updates live web content instantly.</span>
              </li>
            </ul>
          </div>
          <div className="mt-3 text-[11px] text-[#f97316] font-semibold bg-orange-50 px-2.5 py-1.5 rounded-lg">
            Tip: Setting a new featured story automatically un-features the previous one.
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Create Form Column (5 Cols) */}
        <div className="lg:col-span-5">
          <Card className="border-gray-100 shadow-md sticky top-6">
            <CardHeader className="bg-gradient-to-r from-emerald-50/70 to-orange-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="font-heading text-xl text-[#01381d] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#f97316]" />
                CREATE NEW ARTICLE
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="field font-medium text-gray-900 placeholder:text-gray-400"
                    placeholder="e.g. MAI Launches Historic Youth Empowerment Fund in Benin City"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Category Tag
                    </label>
                    <select
                      value={form.tag}
                      onChange={e => setForm({ ...form, tag: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#01381d]"
                    >
                      {TAG_OPTIONS.map(tag => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Publish Date
                    </label>
                    <Input
                      type="date"
                      required
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Short Excerpt / Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01381d] text-gray-800 placeholder:text-gray-400"
                    rows={2}
                    placeholder="Brief 1-2 sentence preview shown on news cards..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Article Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01381d] text-gray-800 placeholder:text-gray-400 font-normal leading-relaxed"
                    rows={6}
                    placeholder="Write the full press release, event report, or speech details here..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center bg-gray-50/60 hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      id="create-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="create-image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#01381d] shadow-sm hover:bg-gray-100"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImage ? 'Uploading Image...' : 'Choose File from Device'}
                    </label>
                    {form.image_url ? (
                      <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <Image
                          src={form.image_url}
                          alt="Cover Preview"
                          width={400}
                          height={160}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image_url: '' })}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs shadow hover:bg-red-700"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400 mt-2">Recommended: 1200x630 landscape JPG, PNG or WEBP</p>
                    )}
                  </div>
                </div>

                {/* Featured Checkbox Box */}
                <div
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    form.featured
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200/50'
                      : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 mt-0.5 rounded text-[#f97316] accent-[#f97316] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">Set as Primary Featured Story</span>
                        {form.featured && (
                          <span className="bg-[#f97316] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        Will be displayed prominently at the top header of the MAI News page. Setting this replaces any
                        previously featured story.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="w-full py-3 px-4 bg-[#01381d] hover:bg-[#015b2d] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Publishing Article...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Publish Article
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* All Articles List Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-gray-100 shadow-md">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="font-heading text-xl text-[#01381d] flex items-center gap-2">
                  <span>ALL ARTICLES</span>
                  <span className="text-xs font-sans font-bold bg-[#01381d]/10 text-[#01381d] px-2.5 py-0.5 rounded-full">
                    {articles.length}
                  </span>
                </CardTitle>

                {/* Filter / Search Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterFeaturedOnly(!filterFeaturedOnly)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      filterFeaturedOnly
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${filterFeaturedOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
                    Featured Only
                  </button>
                </div>
              </div>

              {/* Search & Tag Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by title, keyword, summary..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 text-xs h-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div>
                  <select
                    value={selectedTagFilter}
                    onChange={e => setSelectedTagFilter(e.target.value)}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#01381d]"
                  >
                    <option value="ALL">All Tags</option>
                    {TAG_OPTIONS.map(tag => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    📰
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">No articles found</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    {searchQuery || selectedTagFilter !== 'ALL' || filterFeaturedOnly
                      ? 'Try clearing your search query or adjusting your filters.'
                      : 'Create your first news article using the form on the left.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredArticles.map(article => {
                    const tagStyle = TAG_BADGES[article.tag] || {
                      bg: 'bg-gray-100',
                      text: 'text-gray-700',
                      border: 'border-gray-200'
                    }
                    const isFeatured = !!article.featured
                    const isUpdatingThis = updatingFeaturedId === article.id

                    return (
                      <div
                        key={article.id}
                        className={`p-4 transition-all duration-200 hover:bg-gray-50/80 flex flex-col sm:flex-row gap-4 items-start justify-between ${
                          isFeatured ? 'bg-amber-50/30 border-l-4 border-l-[#f97316]' : ''
                        }`}
                      >
                        {/* Image Thumbnail & Article Info */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80">
                            {article.image_url ? (
                              <Image
                                src={article.image_url}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-200">
                                <span className="text-2xl">📰</span>
                              </div>
                            )}
                            {isFeatured && (
                              <div className="absolute top-1 left-1 bg-[#f97316] text-white p-0.5 rounded shadow">
                                <Star className="w-3 h-3 fill-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}
                              >
                                {article.tag}
                              </span>

                              {isFeatured ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#f97316] text-white px-2 py-0.5 rounded-full shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-white" />
                                  FEATURED STORY
                                </span>
                              ) : null}

                              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(article.date).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>

                            <h3 className="font-bold text-sm text-gray-900 line-clamp-1 leading-snug">
                              {article.title}
                            </h3>

                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                              {article.excerpt || article.content}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Quick Feature Toggle Button */}
                          <button
                            onClick={() => handleToggleFeatured(article)}
                            disabled={isUpdatingThis}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 w-full sm:w-32 justify-center ${
                              isFeatured
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 border border-gray-200'
                            }`}
                            title={isFeatured ? 'Currently active as Featured Story' : 'Set as the single Featured Story'}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                isFeatured ? 'fill-[#f97316] text-[#f97316]' : 'text-gray-400'
                              } ${isUpdatingThis ? 'animate-spin' : ''}`}
                            />
                            <span>{isFeatured ? 'Featured ⭐' : 'Make Featured'}</span>
                          </button>

                          {/* Edit & Delete row */}
                          <div className="flex items-center gap-1.5 w-full sm:w-32">
                            <button
                              onClick={() => handleOpenEdit(article)}
                              className="flex-1 px-2.5 py-1.5 bg-[#01381d]/10 hover:bg-[#01381d] text-[#01381d] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                              title="Edit post content and settings"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDelete(article.id, article.title)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs transition-colors"
                              title="Delete post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EDIT ARTICLE MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#01381d] to-[#015b2d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-white/10 rounded-lg text-[#f97316]">
                  <Edit3 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-heading text-lg tracking-wide">EDIT ARTICLE</h3>
                  <p className="text-[11px] text-emerald-100">Update article content, category, cover, and featured status.</p>
                </div>
              </div>
              <button
                onClick={handleCloseEdit}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="field font-medium text-gray-900"
                  placeholder="Article title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <select
                    value={editForm.tag}
                    onChange={e => setEditForm({ ...editForm, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#01381d]"
                  >
                    {TAG_OPTIONS.map(tag => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <Input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    className="field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Excerpt / Summary
                </label>
                <textarea
                  required
                  value={editForm.excerpt}
                  onChange={e => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01381d] text-gray-800"
                  rows={2}
                  placeholder="Short summary..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Article Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={editForm.content}
                  onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#01381d] text-gray-800 font-normal leading-relaxed"
                  rows={7}
                  placeholder="Full article content..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center bg-gray-50/60">
                  <input
                    type="file"
                    id="edit-image-upload"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    disabled={editUploadingImage}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#01381d] shadow-sm hover:bg-gray-100"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {editUploadingImage ? 'Uploading Image...' : 'Replace Cover Image'}
                  </label>
                  {editForm.image_url ? (
                    <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <Image
                        src={editForm.image_url}
                        alt="Preview"
                        width={400}
                        height={160}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, image_url: '' })}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs shadow hover:bg-red-700"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Featured Option Box */}
              <div
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  editForm.featured
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200/50'
                    : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setEditForm({ ...editForm, featured: !editForm.featured })}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={e => setEditForm({ ...editForm, featured: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-[#f97316] accent-[#f97316] cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">Set as Primary Featured Story</span>
                      {editForm.featured && (
                        <span className="bg-[#f97316] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                          ⭐ Active Featured
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      Only 1 post can be featured at a time. Activating this will replace the current featured post on the
                      news hub.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={editSubmitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting || editUploadingImage}
                  className="px-6 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {editSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}