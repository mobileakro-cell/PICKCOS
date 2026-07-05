'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export const dynamic = 'force-dynamic'

const matchingSchema = z.object({
  requestType: z.enum(['brand_sourcing', 'oem_odm', 'ingredient', 'packaging', 'distribution']),
  category: z.string().min(1, 'Select a category'),
  conceptKeywords: z.string().min(3, 'Enter at least 3 characters'),
  targetMarkets: z.array(z.string()).min(1, 'Select at least one market'),
  certificationsNeeded: z.array(z.string()),
  moqTarget: z.string().optional(),
  timeline: z.string().optional(),
  ndaNeeded: z.boolean().default(false),
  companyName: z.string().min(2, 'Enter company name'),
  personName: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter valid email'),
  country: z.string().min(1, 'Select country'),
  preferredChannel: z.enum(['Email', 'WhatsApp', 'WeChat']),
})

type MatchingFormData = z.infer<typeof matchingSchema>

const REQUEST_TYPES = [
  { value: 'brand_sourcing', label: { en: 'Brand Sourcing (Looking for OEM)', ko: '브랜드 소싱 (OEM 찾기)' } },
  { value: 'oem_odm', label: { en: 'OEM/ODM Inquiry', ko: 'OEM/ODM 문의' } },
  { value: 'ingredient', label: { en: 'Ingredient Sourcing', ko: '원료 소싱' } },
  { value: 'packaging', label: { en: 'Packaging Solution', ko: '패키징 솔루션' } },
  { value: 'distribution', label: { en: 'Distribution/Export', ko: '유통/수출' } },
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

const CERTIFICATIONS = [
  'ISO 22716',
  'GMPC',
  'FDA Compliant',
  'CPNP Certified',
  'Vegan Certified',
  'Organic Certified',
  'Halal Certified',
  'Non-GMO',
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

const COUNTRIES = [
  'United States',
  'Canada',
  'Mexico',
  'United Kingdom',
  'France',
  'Germany',
  'Japan',
  'South Korea',
  'China',
  'Australia',
  'Other',
]

interface BilingualText {
  ko: string
  en: string
}

interface Supplier {
  id: string
  name: string
  category: string
  image: string
  location: BilingualText
  description: BilingualText
}

interface SuccessData {
  requestId: string
  preferredSupplier?: Supplier
}

export default function RequestMatchingPage() {
  // useSearchParams must sit inside a Suspense boundary (avoids CSR deopt at build).
  return (
    <Suspense fallback={null}>
      <RequestMatchingPageContent />
    </Suspense>
  )
}

function RequestMatchingPageContent() {
  const { lang, t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [preferredSupplier, setPreferredSupplier] = useState<Supplier | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MatchingFormData>({
    resolver: zodResolver(matchingSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    const supplierId = searchParams.get('supplierId')
    const requestType = searchParams.get('requestType')

    if (supplierId) {
      fetch(`/api/suppliers/${supplierId}`)
        .then(r => r.json())
        .then(data => {
          if (!data.error) {
            setPreferredSupplier(data)
          }
        })
        .catch(() => {})
    }

    if (requestType) {
      setValue('requestType', requestType as any)
    }
  }, [searchParams, setValue])

  const onSubmit = async (data: MatchingFormData) => {
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

      const response = await fetch('/api/matching-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit request')
      }

      const result = await response.json()
      setSuccessData({
        requestId: result.requestId,
        preferredSupplier: preferredSupplier || undefined,
      })
      setStep(999)
    } catch (error) {
      setSubmitError('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (successData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{t('matching.success_title')}</h1>
          <p className="text-xl text-gray-600 mb-4">
            {t('matching.success_desc')}
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <p className="text-gray-600 mb-2">{t('matching.request_id')}</p>
            <p className="text-3xl font-mono font-bold text-[#3d3d3d]">{successData.requestId}</p>
            <p className="text-sm text-gray-600 mt-2">{t('matching.save_reference')}</p>
          </div>

          {successData.preferredSupplier && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold mb-4 text-lg">{t('matching.preferred_supplier')}</h3>
              <div className="flex items-start gap-4">
                <img
                  src={successData.preferredSupplier.image}
                  alt={successData.preferredSupplier.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="text-left flex-1">
                  <h4 className="font-bold text-lg mb-1">{successData.preferredSupplier.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{successData.preferredSupplier.location[lang]}</p>
                  <p className="text-gray-700 text-sm">{successData.preferredSupplier.description[lang]}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">{t('matching.what_next')}</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold mb-1">{t('matching.step_review')}</h4>
                <p className="text-gray-600">{t('matching.step_review_desc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold mb-1">{t('matching.step_shortlist')}</h4>
                <p className="text-gray-600">{t('matching.step_shortlist_desc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold mb-1">{t('matching.step_intro')}</h4>
                <p className="text-gray-600">{t('matching.step_intro_desc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sourcing"
            className="px-8 py-3 bg-[#3d3d3d] text-white font-semibold hover:bg-[#2d2d2d] text-center"
          >
            {t('matching.browse_more')}
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border-2 border-[#3d3d3d] text-[#3d3d3d] font-semibold hover:bg-[#3d3d3d] hover:text-white transition-colors text-center"
          >
            {t('matching.back_home')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">{t('matching.title')}</h1>
      <p className="text-gray-600 mb-8">
        {t('matching.subtitle')}
      </p>

      {preferredSupplier && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-8">
          <p className="text-sm font-medium text-blue-700 mb-2">{t('matching.preferred_supplier')}</p>
          <div className="flex items-center gap-4">
            <img
              src={preferredSupplier.image}
              alt={preferredSupplier.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-bold text-lg">{preferredSupplier.name}</h3>
              <p className="text-sm text-gray-600">{preferredSupplier.location[lang]}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors ${
                s <= step
                  ? 'bg-[#3d3d3d] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3d3d3d] transition-all"
            style={{ width: `${(step - 1) / 3 * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold mb-6">{t('matching.step1_title')}</h2>
            {REQUEST_TYPES.map(type => (
              <label
                key={type.value}
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register('requestType')}
                  className="w-5 h-5"
                />
                <span className="ml-4 font-medium">{type.label[lang]}</span>
              </label>
            ))}
            {errors.requestType && (
              <p className="text-red-600 text-sm mt-2">{errors.requestType.message}</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">{t('matching.step2_title')}</h2>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.product_category')} *</label>
              <select
                {...register('category')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              >
                <option value="">{t('matching.select_category')}</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.concept_keywords')} *</label>
              <input
                type="text"
                placeholder={t('matching.concept_placeholder')}
                {...register('conceptKeywords')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              />
              {errors.conceptKeywords && (
                <p className="text-red-600 text-sm mt-1">{errors.conceptKeywords.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.target_markets')} *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TARGET_MARKETS.map(market => (
                  <label key={market} className="flex items-center p-2 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      value={market}
                      {...register('targetMarkets')}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm">{market}</span>
                  </label>
                ))}
              </div>
              {errors.targetMarkets && (
                <p className="text-red-600 text-sm mt-1">{errors.targetMarkets.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.certifications_needed')}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {CERTIFICATIONS.map(cert => (
                  <label key={cert} className="flex items-center p-2 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      value={cert}
                      {...register('certificationsNeeded')}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm">{cert}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('matching.moq_target')}</label>
                <input
                  type="text"
                  placeholder={t('matching.moq_placeholder')}
                  {...register('moqTarget')}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('matching.timeline')}</label>
                <select
                  {...register('timeline')}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
                >
                  <option value="">{t('matching.select_timeline')}</option>
                  <option value="urgent">{t('matching.timeline_urgent')}</option>
                  <option value="soon">{t('matching.timeline_soon')}</option>
                  <option value="flexible">{t('matching.timeline_flexible')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">{t('matching.step3_title')}</h2>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.upload_files')}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">{t('matching.drag_drop')}</p>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded cursor-pointer transition-colors"
                >
                  {t('matching.choose_files')}
                </label>
                <p className="text-xs text-gray-500 mt-4">{t('matching.file_types')}</p>
              </div>
            </div>

            <div>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  {...register('ndaNeeded')}
                  className="w-5 h-5"
                />
                <span className="ml-3 font-medium">
                  {t('matching.nda_needed')}
                </span>
              </label>
              <p className="text-sm text-gray-600 mt-2">
                {t('matching.nda_desc')}
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">{t('matching.step4_title')}</h2>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.company_name')} *</label>
              <input
                type="text"
                {...register('companyName')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              />
              {errors.companyName && (
                <p className="text-red-600 text-sm mt-1">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.your_name')} *</label>
              <input
                type="text"
                {...register('personName')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              />
              {errors.personName && (
                <p className="text-red-600 text-sm mt-1">{errors.personName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.email')} *</label>
              <input
                type="email"
                {...register('email')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('matching.country')} *</label>
              <select
                {...register('country')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              >
                <option value="">{t('matching.select_country')}</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">{t('matching.preferred_channel')} *</label>
              <div className="space-y-2">
                {['Email', 'WhatsApp', 'WeChat'].map(channel => (
                  <label key={channel} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value={channel}
                      {...register('preferredChannel')}
                      className="w-4 h-4"
                    />
                    <span className="ml-3">{channel}</span>
                  </label>
                ))}
              </div>
              {errors.preferredChannel && (
                <p className="text-red-600 text-sm mt-1">{errors.preferredChannel.message}</p>
              )}
            </div>
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {submitError}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || isSubmitting}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {t('matching.back')}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#3d3d3d] text-white font-semibold rounded hover:bg-[#2d2d2d] disabled:opacity-50 transition-colors"
            >
              {t('matching.next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? t('matching.submitting') : t('matching.submit')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
