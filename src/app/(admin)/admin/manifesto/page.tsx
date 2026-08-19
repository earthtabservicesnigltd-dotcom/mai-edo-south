'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { toast } from 'sonner'

export default function AdminManifestoPage() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    async function fetchUrl() {
      const res = await fetch('/api/admin/manifesto')
      const data = await res.json()
      setCurrentUrl(data.url)
      setLoading(false)
    }
    fetchUrl()
  }, [])

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete the current manifesto?')) return
    
    try {
      const res = await fetch('/api/admin/manifesto', { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      
      setCurrentUrl(null)
      toast.success('Manifesto deleted.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/manifesto', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setCurrentUrl(data.url)
      toast.success('Manifesto uploaded successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[#01381d]">MANIFESTO</h1>
          <p className="text-ink-muted text-sm mt-1">Upload the PDF version of the manifesto.</p>
        </div>
        <button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading text-xl text-[#01381d]">UPLOAD PDF</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-muted uppercase mb-2">Select PDF File</label>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleUpload} 
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#015b2d] file:text-white hover:file:bg-[#01381d] disabled:opacity-50"
            />
          </div>

          {uploading && <p className="text-sm text-[#f97316] animate-pulse">Uploading...</p>}

          {loading ? (
            <p className="text-sm text-gray-400">Loading current manifesto...</p>
          ) : currentUrl ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-green-800">Manifesto is live!</p>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#015b2d] hover:underline truncate block max-w-xs">
                  {currentUrl}
                </a>
              </div>
              <button 
                onClick={handleDelete} 
                className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex-shrink-0"
              >
                Delete
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No manifesto uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}