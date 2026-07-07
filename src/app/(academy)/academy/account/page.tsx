'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Profile {
  first_name: string
  last_name: string
  email: string
  phone: string
  lga: string
}

interface VolunteerStatus {
  volunteer_id: string
  status: string
  lga: string
  area_of_interest: string
  volunteer_areas: string[]
  created_at: string
}

interface DiasporaStatus {
  diaspora_id: string
  status: string
  country: string
  lga_origin: string
  created_at: string
}

interface Donation {
  id: string
  amount: number
  payment_method: string
  status: string
  created_at: string
}

const StatusBadge = ({ status }: { status: string }) => (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
      status === 'approved' ? 'bg-green-100 text-green-700' :
      status === 'rejected' ? 'bg-red-100 text-red-700' :
      status === 'successful' ? 'bg-green-100 text-green-700' :
      status === 'failed' ? 'bg-red-100 text-red-700' :
      'bg-orange-100 text-orange-700'
    }`}>
      {status}
    </span>
  )

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile>({
    first_name: '', last_name: '', email: '', phone: '', lga: '',
  })
  const [volunteer, setVolunteer] = useState<VolunteerStatus | null>(null)
  const [diaspora, setDiaspora] = useState<DiasporaStatus | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile')

  useEffect(() => {
    async function fetchData() {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/academic-auth')
        return
      }

      setUser(user)
      setProfile({
        first_name: user.user_metadata?.first_name ?? '',
        last_name: user.user_metadata?.last_name ?? '',
        email: user.email ?? '',
        phone: user.user_metadata?.phone ?? '',
        lga: user.user_metadata?.lga ?? '',
      })

      // Fetch activity data
      const res = await fetch('/api/account')
      const data = await res.json()
      setVolunteer(data.volunteer ?? null)
      setDiaspora(data.diaspora ?? null)
      setDonations(data.donations ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

    async function handleSave() {
      setSaving(true)
      const supabase = supabaseBrowser()
      
      // 1. Update auth metadata (existing)
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          lga: profile.lga,
        }
      })

      if (error) {
        toast.error('Failed to update profile', { description: error.message })
        setSaving(false)
        return
      }

      // 2. ALSO update the profiles table (new — fixes certificate names)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          lga: profile.lga,
        })
        .eq('id', user.id)

      if (profileError) {
        toast.error('Failed to save profile data')
      } else {
        toast.success('Profile updated successfully')
      }

      setSaving(false)
    }

  async function handleSignOut() {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    router.push('/academic-auth')
  }

  const initials = `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase() || '?'

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#01381d] flex items-center justify-center text-white font-heading text-2xl shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="font-heading text-3xl text-[#01381d]">
                {profile.first_name} <span className="text-[#f97316]">{profile.last_name}</span>
              </h1>
              <p className="text-ink-muted text-sm">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(['profile', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 -mb-0.5 ${
                activeTab === tab
                  ? 'text-[#01381d] border-[#f97316]'
                  : 'text-ink-muted border-transparent hover:text-ink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl text-[#01381d]">PERSONAL INFORMATION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input
                    value={profile.first_name}
                    onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))}
                    className="field"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input
                    value={profile.last_name}
                    onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))}
                    className="field"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input value={profile.email} disabled className="field bg-gray-50 text-ink-muted cursor-not-allowed" />
                <p className="text-xs text-ink-faint">Email cannot be changed</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input
                    value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+234 000 0000 000"
                    className="field"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>LGA of Residence</Label>
                  <Input
                    value={profile.lga}
                    onChange={e => setProfile(p => ({ ...p, lga: e.target.value }))}
                    placeholder="e.g. Oredo, Egor"
                    className="field"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#01381d] hover:bg-[#015b2d]"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">

            {/* Volunteer Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl text-[#01381d]">VOLUNTEER STATUS</CardTitle>
              </CardHeader>
              <CardContent>
                {!volunteer ? (
                  <div className="text-center py-6">
                    <p className="text-ink-muted text-sm mb-4">You have not submitted a volunteer application yet.</p>
                    <a href="/volunteer" className="inline-block bg-[#f97316] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#015b2d] transition-colors text-sm uppercase tracking-wider">
                      Become a Volunteer
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Status</span>
                      <StatusBadge status={volunteer.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Volunteer ID</span>
                      <span className="font-mono font-bold text-[#f97316] text-sm">{volunteer.volunteer_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">LGA</span>
                      <span className="text-sm font-semibold">{volunteer.lga}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Areas of Service</span>
                      <span className="text-sm font-semibold text-right max-w-[60%]">{volunteer.volunteer_areas?.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Date Applied</span>
                      <span className="text-sm text-ink-muted">
                        {new Date(volunteer.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    {volunteer.status === 'approved' && (
                      <div className="pt-3 border-t border-border">
                        <a
                          href={`/volunteer/card/${volunteer.volunteer_id.replace(/\//g, '-')}`}
                          className="inline-block bg-[#01381d] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#f97316] transition-colors text-sm uppercase tracking-wider"
                        >
                          View ID Card
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Diaspora Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl text-[#01381d]">DIASPORA NETWORK</CardTitle>
              </CardHeader>
              <CardContent>
                {!diaspora ? (
                  <div className="text-center py-6">
                    <p className="text-ink-muted text-sm mb-4">You have not registered with the MAI Diaspora Network yet.</p>
                    <a href="/diaspora" className="inline-block bg-[#f97316] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#015b2d] transition-colors text-sm uppercase tracking-wider">
                      Join the Network
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Status</span>
                      <StatusBadge status={diaspora.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Member ID</span>
                      <span className="font-mono font-bold text-[#f97316] text-sm">{diaspora.diaspora_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Country</span>
                      <span className="text-sm font-semibold">{diaspora.country}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">LGA of Origin</span>
                      <span className="text-sm font-semibold">{diaspora.lga_origin}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Date Registered</span>
                      <span className="text-sm text-ink-muted">
                        {new Date(diaspora.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Donations */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl text-[#01381d]">DONATION HISTORY</CardTitle>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-ink-muted text-sm mb-4">You have not made any donations yet.</p>
                    <a href="/donate" className="inline-block bg-[#f97316] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#015b2d] transition-colors text-sm uppercase tracking-wider">
                      Make a Donation
                    </a>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {['Amount', 'Method', 'Status', 'Date'].map(h => (
                            <th key={h} className="text-left py-3 px-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {donations.map(d => (
                          <tr key={d.id} className="border-b border-border last:border-0">
                            <td className="py-3 px-2 font-bold text-[#01381d]">₦{Number(d.amount).toLocaleString()}</td>
                            <td className="py-3 px-2 text-ink-muted capitalize">{d.payment_method}</td>
                            <td className="py-3 px-2"><StatusBadge status={d.status} /></td>
                            <td className="py-3 px-2 text-ink-muted">
                              {new Date(d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        )}

      </div>
    </div>
  )
}