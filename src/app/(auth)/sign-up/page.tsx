'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface School {
  slug: string
  title: string
  description: string
  icon: string
  courses: Course[]
}

interface Course {
  id: string
  slug: string
  title: string
  short_label: string
}

export default function AcademyRegisterPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    schoolSlug: '',
    courseSlug: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const selectedSchool = schools.find(s => s.slug === form.schoolSlug)

  useEffect(() => {
    fetch('/api/academy/schools')
      .then(r => r.json())
      .then(d => {
        setSchools(d.schools ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.schoolSlug) e.schoolSlug = 'Select a school'
    if (!form.courseSlug) e.courseSlug = 'Select a course'
    if (form.password.length < 6) e.password = 'Min 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setSubmitting(true)
    const res = await fetch('/api/academy/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        courseSlug: form.courseSlug,
      }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (res.ok) {
      toast.success('Account created! You can now log in.')
      router.push('/sign-in')
    } else {
      toast.error(data.error || 'Something went wrong')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#01381d]">
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#01381d] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="font-[Syne] text-2xl font-extrabold text-[#111827]">
            Join <span className="text-[#f97316]">MAI Academy</span>
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Pick a school, choose your first course, and start learning.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">First Name</label>
              <input type="text" value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full mt-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#f97316] outline-none" />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Last Name</label>
              <input type="text" value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full mt-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#f97316] outline-none" />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full mt-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#f97316] outline-none" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* School */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">School</label>
            <select value={form.schoolSlug}
              onChange={e => setForm(f => ({ ...f, schoolSlug: e.target.value, courseSlug: '' }))}
              className="w-full mt-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#f97316] outline-none bg-white">
              <option value="">Choose a school...</option>
              {schools.map(s => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
            </select>
            {errors.schoolSlug && <p className="text-xs text-red-500 mt-1">{errors.schoolSlug}</p>}
          </div>

          {/* Course — filtered by school */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Course</label>
            <select value={form.courseSlug}
              onChange={e => setForm(f => ({ ...f, courseSlug: e.target.value }))}
              disabled={!form.schoolSlug}
              className="w-full mt-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#f97316] outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400">
              <option value="">{form.schoolSlug ? 'Choose a course...' : 'Select a school first'}</option>
              {(selectedSchool?.courses ?? []).map(c => (
                <option key={c.slug} value={c.slug}>{c.short_label} — {c.title}</option>
              ))}
            </select>
            {errors.courseSlug && <p className="text-xs text-red-500 mt-1">{errors.courseSlug}</p>}
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Password</label>
              <input type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full mt-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#f97316] outline-none" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Confirm</label>
              <input type="password" value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full mt-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:border-[#f97316] outline-none" />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-[#f97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors text-sm disabled:opacity-60 mt-2">
            {submitting ? 'Creating account...' : 'Create Account & Enroll →'}
          </button>

          <p className="text-center text-xs text-[#6B7280]">
            Already have an account?{' '}
            <a href="/sign-in" className="text-[#f97316] font-semibold">Log in</a>
          </p>
        </form>
      </div>
    </div>
  )
}
