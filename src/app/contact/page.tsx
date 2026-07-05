'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  inquiryType: z.enum(['partnership', 'general', 'support']),
  category: z.string().min(1, 'Select a category'),
  targetMarkets: z.array(z.string()).min(1, 'Select at least one market'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  companyName: z.string().min(2, 'Enter company name'),
  personName: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter valid email'),
  country: z.string().min(1, 'Select country'),
})

type ContactFormData = z.infer<typeof contactSchema>

const COUNTRIES = [
  'United States',
  'Canada',
  'Mexico',
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Japan',
  'South Korea',
  'China',
  'India',
  'Australia',
  'Other',
]

// 소싱 문의는 "매칭 신청(요청서)"으로 일원화 → Contact은 일반/제휴/지원 문의 전용.
const INQUIRY_TYPES = [
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'support', label: 'Support & Assistance' },
  { value: 'general', label: 'General Inquiry' },
]

const PRODUCT_CATEGORIES = [
  'Serums & Ampoules',
  'Creams & Moisturizers',
  'Sheet Masks',
  'Cleansers & Toners',
  'Eye Care',
  'Specialty Treatments',
  'Ingredients/Raw Materials',
  'Packaging Materials',
  'Other',
]

const TARGET_MARKETS = [
  'United States',
  'Canada',
  'Mexico',
  'EU Countries',
  'UK',
  'Middle East',
  'Japan',
  'South Korea',
  'China',
  'Southeast Asia',
  'Australia',
  'New Zealand',
]

interface SuccessData {
  ticketId: string
}

export default function ContactPage() {
  // useSearchParams must sit inside a Suspense boundary (avoids CSR deopt at build).
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  )
}

function ContactPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    const type = searchParams.get('type')
    const supplierId = searchParams.get('supplierId')
    const topic = searchParams.get('topic')

    // Only accept valid (non-sourcing) types; sourcing now routes to /request-matching.
    if (type && INQUIRY_TYPES.some(o => o.value === type)) {
      setValue('inquiryType', type as any)
    }
  }, [searchParams, setValue])

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const supplierId = searchParams.get('supplierId')
      const topic = searchParams.get('topic')

      const payload = {
        ...data,
        supplierId: supplierId || undefined,
        topic: topic || undefined,
      }

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit inquiry')
      }

      const result = await response.json()
      setSuccessData({ ticketId: result.ticketId })
      setStep(999)
    } catch (error) {
      setSubmitError('Failed to submit inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (successData) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-[#3d3d3d] rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('contact.thank_you')}</h1>
            <p className="text-gray-500 font-light mb-8">
              {t('contact.received_msg')}
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 mb-8">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{t('contact.ticket_id')}</p>
              <p className="text-2xl font-bold text-gray-900">{successData.ticketId}</p>
              <p className="text-xs text-gray-400 mt-3">{t('contact.save_reference')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sourcing"
                className="px-8 py-4 bg-[#3d3d3d] text-white font-medium rounded-full hover:bg-[#2d2d2d] transition-all"
              >
                {t('contact.back_sourcing')}
              </Link>
              <Link
                href="/"
                className="px-8 py-4 border border-gray-200 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-all"
              >
                {t('contact.go_home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">{t('contact.title')}</h1>
          <p className="text-base text-gray-500 font-light">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">{t('contact.your_info')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.company_name')} *</label>
                <input
                  type="text"
                  {...register('companyName')}
                  className="w-full border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-gray-400 transition-colors"
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.your_name')} *</label>
                <input
                  type="text"
                  {...register('personName')}
                  className="w-full border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-gray-400 transition-colors"
                />
                {errors.personName && <p className="text-red-500 text-sm mt-1">{errors.personName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.email')} *</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-gray-400 transition-colors"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.country')} *</label>
                <select
                  {...register('country')}
                  className="w-full border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-gray-400 transition-colors bg-white"
                >
                  <option value="">{t('contact.select_country')}</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">{t('contact.inquiry_details')}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">{t('contact.inquiry_type')} *</label>
              <div className="space-y-2">
                {INQUIRY_TYPES.map(type => (
                  <label key={type.value} className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      value={type.value}
                      {...register('inquiryType')}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
              {errors.inquiryType && <p className="text-red-500 text-sm mt-2">{errors.inquiryType.message}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.product_category')} *</label>
              <select
                {...register('category')}
                className="w-full border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              >
                <option value="">Select category</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">{t('contact.target_markets')} *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TARGET_MARKETS.map(market => (
                  <label key={market} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      value={market}
                      {...register('targetMarkets')}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-600">{market}</span>
                  </label>
                ))}
              </div>
              {errors.targetMarkets && <p className="text-red-500 text-sm mt-2">{errors.targetMarkets.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.tell_us_more')} *</label>
              <textarea
                {...register('description')}
                rows={6}
                placeholder={t('contact.description_placeholder')}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-gray-400 transition-colors resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm">
              {submitError}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-[#3d3d3d] text-white font-medium rounded-full hover:bg-[#2d2d2d] disabled:opacity-50 transition-all"
          >
            {isSubmitting ? t('contact.submitting') : t('contact.submit_inquiry')}
          </button>
        </form>
      </div>
    </div>
  )
}
