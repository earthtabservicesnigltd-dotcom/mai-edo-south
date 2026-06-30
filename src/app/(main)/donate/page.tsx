"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase';


const PAYMENT_METHODS = [
  { value: 'card',          label: 'Card',          icon: '💳' },
  { value: 'bank_transfer', label: 'Bank Transfer',  icon: '🏦' },
  { value: 'ussd',          label: 'USSD',           icon: '📱' },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    customAmount: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Auto-fill if logged in
  useEffect(() => {
    async function prefill() {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, phone')
        .eq('id', user.id)
        .single();

      if (profile) {
        setForm(f => ({
          ...f,
          firstName: profile.first_name ?? '',
          lastName:  profile.last_name  ?? '',
          email:     profile.email      ?? '',
          phone:     profile.phone      ?? '',
        }));
      }
    }
    prefill();
  }, []);

  function getFinalAmount(): number | null {
    if (selectedAmount === 'custom') {
      const val = parseInt(form.customAmount);
      return isNaN(val) || val <= 0 ? null : val;
    }
    return selectedAmount ? parseInt(selectedAmount) : null;
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim())  newErrors.lastName  = 'Last name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email required.';
    if (!getFinalAmount()) newErrors.amount = 'Please select or enter a valid amount.';
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    const supabase = supabaseBrowser();

    const { error } = await supabase.from('donations').insert({
      first_name:     form.firstName,
      last_name:      form.lastName,
      email:          form.email,
      phone:          form.phone || null,
      amount:         getFinalAmount(),
      payment_method: paymentMethod,
      payment_ref:    null,
      status:         'pending',
      user_id:        userId ?? null,
    });

    setLoading(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <>
        <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">Support The Campaign</p>
            <h1 className="font-heading text-6xl md:text-7xl mb-4">DONATE <span className="text-[#f97316]">NOW</span></h1>
          </div>
        </section>
        <section className="py-24 bg-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-4xl mb-3">THANK YOU!</h2>
            <p className="text-gray-500 mb-2">
              Your donation of <strong className="text-[#f97316]">₦{getFinalAmount()?.toLocaleString()}</strong> has been recorded.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Payment processing will be completed shortly. We&apos;ll send a confirmation to <strong>{form.email}</strong>.
            </p>
            <Link href="/" className="inline-block bg-[#01381d] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#f97316] transition-colors">
              Back to Home
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#01381d] to-[#015b2d] py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <p className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-3">Support The Campaign</p>
          <h1 className="font-heading text-6xl md:text-7xl mb-4">
            DONATE <span className="text-[#f97316]">NOW</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">
            Your contribution fuels the movement. Every naira counts towards building a better Edo South.
          </p>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-16 bg-white flex flex-col">
        
        <div className="max-w-6xl mx-auto px-4">
          <div className="hidden lg:block text-center mb-12">
            <p className="text-[#015b2d] font-bold text-sm uppercase tracking-widest mb-2">Why Your Support Matters</p>
            <h2 className="font-heading text-4xl md:text-5xl">FUEL THE <span className="text-[#f97316]">MOVEMENT</span></h2>
          </div>

          <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: '📢', title: 'Spread the Message',    desc: 'Fund campaign materials, events and media outreach to reach every voter in Edo South.' },
              { icon: '🚗', title: 'Mobilise Supporters',   desc: 'Cover logistics, transportation and coordination for grassroots mobilization across all LGAs.' },
              { icon: '🏘️', title: 'Reach Every Community', desc: 'Ensure no community in Edo South is left out of the campaign conversation.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Donation Form + Impact */}
          <div className="grid grid-cols-1 gap-12 items-center">
            <div className="mt-8 p-6 bg-[#015b2d]/5 border border-[#015b2d]/10 rounded-2xl text-center">
                <Image src="/image-3.jpg" alt="ADC" width={80} height={80} className="rounded-xl mx-auto mb-3 object-contain" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  This campaign is run under the platform of the Alliance for Democracy and Credibility (ADC).
                </p>
              </div>
            <div className="mx-auto">
              <h3 className="font-bold text-2xl mb-6">Contribution</h3>
              
                {/* Payment Method */}
                <div>
                 <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                   <label className="block text-sm font-semibold mb-2 text-gray-700 whitespace-nowrap">Account Name:</label>
                   <span className="w-sm text-gray-700 px-4 font-bold py-4 rounded-xl">MAI SENATORIAL CAMPAIGN ORGANIZATION</span>
                 </div>
                 <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                   <label className="block text-sm font-semibold mb-2 text-gray-700 whitespace-nowrap">Account Number:</label>
                   <span className="w-sm text-gray-700 px-4 font-bold py-4 rounded-xl">1140492000</span>
                 </div>
                 <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                   <label className="block text-sm font-semibold mb-2 text-gray-700 whitespace-nowrap">Bank Name:</label>
                   <span className="w-sm text-gray-700 px-4 font-bold py-4 rounded-xl">POLARIS BANK</span>
                 </div>
                </div>
            </div>

            {/* Impact */}
            <div>
              

              
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
            Your time and skills are just as valuable as financial support. Join our team of volunteers across Edo South.
          </p>
          <Link href="/volunteer" className="inline-block bg-[#01381d] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#f97316] transition-colors">
            BECOME A VOLUNTEER
          </Link>
        </div>
      </section>
    </>
  );
}
