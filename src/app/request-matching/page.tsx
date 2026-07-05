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
  businessStage: z.enum(['new_brand', 'brand_expansion', 'distributor', 'other']),
  category: z.string().min(1, 'Select a category'),
  requestBrief: z.string().min(10, 'Please describe your request (at least 10 characters)'),
  serviceScope: z.enum(['formula_dev', 'existing_odm', 'formula_fill', 'full_package']),
  referenceProduct: z.string().optional(),
  expectedMoq: z.string().min(1, 'Select an expected order quantity'),
  packagingFormat: z.string().optional(),
  targetMarkets: z.array(z.string()).optional(),
  certificationsNeeded: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  ndaNeeded: z.boolean().default(false),
  companyName: z.string().min(2, 'Enter company name'),
  personName: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter valid email'),
  country: z.string().min(1, 'Select country'),
  website: z.string().optional(),
  preferredChannel: z.enum(['Email', 'WhatsApp', 'WeChat']),
  privacyConsent: z.boolean().refine((v) => v === true, { message: 'Please agree to the privacy policy' }),
})

type MatchingFormData = z.infer<typeof matchingSchema>

const REQUEST_TYPES = [
  { value: 'brand_sourcing', label: { en: 'Brand Sourcing (Looking for OEM)', ko: '브랜드 소싱 (OEM 찾기)' } },
  { value: 'oem_odm', label: { en: 'OEM/ODM Inquiry', ko: 'OEM/ODM 문의' } },
  { value: 'ingredient', label: { en: 'Ingredient Sourcing', ko: '원료 소싱' } },
  { value: 'packaging', label: { en: 'Packaging Solution', ko: '패키징 솔루션' } },
  { value: 'distribution', label: { en: 'Distribution/Export', ko: '유통/수출' } },
]

const BUSINESS_STAGES = [
  { value: 'new_brand', label: { en: 'Launching a new brand', ko: '신규 브랜드 런칭' } },
  { value: 'brand_expansion', label: { en: 'Expanding an existing brand', ko: '기존 브랜드 라인 확장' } },
  { value: 'distributor', label: { en: 'Distributor / Reseller', ko: '유통사 / 리셀러' } },
  { value: 'other', label: { en: 'Other', ko: '기타' } },
]

const SERVICE_SCOPES = [
  { value: 'formula_dev', label: { en: 'Formula development (full OEM)', ko: '처방 개발부터 (풀 OEM)' } },
  { value: 'existing_odm', label: { en: 'Use existing formula (ODM)', ko: '기존 처방 활용 (ODM)' } },
  { value: 'formula_fill', label: { en: 'Formula + filling', ko: '처방 + 충전' } },
  { value: 'full_package', label: { en: 'Formula + packaging (full service)', ko: '처방 + 패키징 (풀서비스)' } },
]

const PACKAGING_FORMATS = [
  { value: 'jar', label: { en: 'Jar', ko: '자(단지)' } },
  { value: 'tube', label: { en: 'Tube', ko: '튜브' } },
  { value: 'airless', label: { en: 'Airless pump', ko: '에어리스 펌프' } },
  { value: 'pump', label: { en: 'Pump bottle', ko: '펌프 보틀' } },
  { value: 'bottle', label: { en: 'Bottle / Dropper', ko: '보틀 / 드로퍼' } },
  { value: 'sachet', label: { en: 'Sachet / Pouch', ko: '사쉐 / 파우치' } },
  { value: 'stick', label: { en: 'Stick', ko: '스틱' } },
  { value: 'undecided', label: { en: 'Not decided / Ask supplier', ko: '미정 / 공급사에 문의' } },
]

const MOQ_RANGES = [
  { value: 'under_1000', label: { en: 'Under 1,000 units', ko: '1,000개 미만' } },
  { value: '1000_5000', label: { en: '1,000 – 5,000 units', ko: '1,000 – 5,000개' } },
  { value: '5000_10000', label: { en: '5,000 – 10,000 units', ko: '5,000 – 10,000개' } },
  { value: '10000_50000', label: { en: '10,000 – 50,000 units', ko: '10,000 – 50,000개' } },
  { value: 'over_50000', label: { en: '50,000+ units', ko: '50,000개 이상' } },
  { value: 'undecided', label: { en: 'Not sure yet (approx.)', ko: '미정 (대략)' } },
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

  // 제출 시 검증 실패 → 첫 오류 필드가 있는 단계로 이동하고 안내 표시
  const fieldStep: Record<string, number> = {
    requestType: 1,
    businessStage: 2, category: 2, requestBrief: 2, serviceScope: 2,
    expectedMoq: 3,
    companyName: 4, personName: 4, email: 4, country: 4, preferredChannel: 4, privacyConsent: 4,
  }
  const onError = (errs: Record<string, unknown>) => {
    const first = Object.keys(errs)[0]
    if (first && fieldStep[first]) setStep(fieldStep[first])
    setSubmitError(lang === 'ko' ? '필수 항목을 확인해 주세요.' : 'Please complete the required fields.')
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

      <form onSubmit={handleSubmit(onSubmit, onError)}>
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
            <h2 className="text-2xl font-bold">{lang === 'ko' ? '요청 개요' : 'About Your Request'}</h2>

            {/* 사업 단계 · 바이어 유형 */}
            <div>
              <label className="block text-sm font-medium mb-2">{lang === 'ko' ? '사업 단계 · 바이어 유형' : 'Business Stage / Buyer Type'} *</label>
              <select
                {...register('businessStage')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              >
                <option value="">{lang === 'ko' ? '선택하세요' : 'Select...'}</option>
                {BUSINESS_STAGES.map(o => (
                  <option key={o.value} value={o.value}>{o.label[lang]}</option>
                ))}
              </select>
              {errors.businessStage && <p className="text-red-600 text-sm mt-1">{errors.businessStage.message}</p>}
            </div>

            {/* 제품 카테고리 */}
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

            {/* 요청 브리프 (자유서술) */}
            <div>
              <label className="block text-sm font-medium mb-1">{lang === 'ko' ? '요청 브리프' : 'Request Brief'} *</label>
              <p className="text-xs text-gray-500 mb-2">
                {lang === 'ko'
                  ? '어떤 제품·원료를 찾으시나요? 용도와 원하는 방향을 편하게 적어주세요.'
                  : 'What are you looking for? Describe the purpose and direction in your own words.'}
              </p>
              <textarea
                rows={4}
                placeholder={lang === 'ko'
                  ? '예: 미국 시장용 비건 안티에이징 세럼을 OEM으로 개발하고 싶어요. 중저가 라인, 자연유래 성분 위주.'
                  : 'e.g., We want to develop a vegan anti-aging serum via OEM for the US market — mid-tier price, naturally-derived ingredients.'}
                {...register('requestBrief')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              />
              {errors.requestBrief && <p className="text-red-600 text-sm mt-1">{errors.requestBrief.message}</p>}
            </div>

            {/* 서비스 범위 */}
            <div>
              <label className="block text-sm font-medium mb-2">{lang === 'ko' ? '서비스 범위' : 'Service Scope'} *</label>
              <select
                {...register('serviceScope')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              >
                <option value="">{lang === 'ko' ? '어디까지 맡기실까요?' : 'How much should the supplier handle?'}</option>
                {SERVICE_SCOPES.map(o => (
                  <option key={o.value} value={o.value}>{o.label[lang]}</option>
                ))}
              </select>
              {errors.serviceScope && <p className="text-red-600 text-sm mt-1">{errors.serviceScope.message}</p>}
            </div>

            {/* 참고 제품 / 벤치마크 (자유서술, 선택) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {lang === 'ko' ? '참고 제품 · 벤치마크' : 'Reference / Benchmark'} <span className="font-normal text-gray-400">({lang === 'ko' ? '선택' : 'optional'})</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                {lang === 'ko'
                  ? '비슷한 제품이나 원하는 방향의 예시가 있으면 자유롭게 적어주세요.'
                  : 'If there is a similar product or direction you have in mind, describe it freely.'}
              </p>
              <textarea
                rows={2}
                placeholder={lang === 'ko' ? '예: OO 브랜드의 XX 세럼 같은 사용감, 더 가벼운 제형' : "e.g., a texture like Brand X's serum, but lighter"}
                {...register('referenceProduct')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">{lang === 'ko' ? '규모 · 요건' : 'Scale & Requirements'}</h2>

            {/* 예상 주문 수량 (MOQ) — 필수 */}
            <div>
              <label className="block text-sm font-medium mb-2">{lang === 'ko' ? '예상 주문 수량 (MOQ)' : 'Expected Order Quantity (MOQ)'} *</label>
              <select
                {...register('expectedMoq')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              >
                <option value="">{lang === 'ko' ? '대략적인 규모를 선택하세요' : 'Select an approximate volume'}</option>
                {MOQ_RANGES.map(o => (
                  <option key={o.value} value={o.value}>{o.label[lang]}</option>
                ))}
              </select>
              {errors.expectedMoq && <p className="text-red-600 text-sm mt-1">{errors.expectedMoq.message}</p>}
            </div>

            {/* 선호 용기 · 패키징 형태 (선택) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === 'ko' ? '선호 용기 · 패키징 형태' : 'Preferred Packaging Format'} <span className="font-normal text-gray-400">({lang === 'ko' ? '선택' : 'optional'})</span>
              </label>
              <select
                {...register('packagingFormat')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              >
                <option value="">{lang === 'ko' ? '선택하세요' : 'Select...'}</option>
                {PACKAGING_FORMATS.map(o => (
                  <option key={o.value} value={o.value}>{o.label[lang]}</option>
                ))}
              </select>
            </div>

            {/* 희망 일정 (선택) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('matching.timeline')} <span className="font-normal text-gray-400">({lang === 'ko' ? '선택' : 'optional'})</span>
              </label>
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

            {/* 타겟 시장 (선택) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('matching.target_markets')} <span className="font-normal text-gray-400">({lang === 'ko' ? '선택' : 'optional'})</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TARGET_MARKETS.map(market => (
                  <label key={market} className="flex items-center p-2 border rounded hover:bg-gray-50">
                    <input type="checkbox" value={market} {...register('targetMarkets')} className="w-4 h-4" />
                    <span className="ml-2 text-sm">{market}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 필요 인증 (선택) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('matching.certifications_needed')} <span className="font-normal text-gray-400">({lang === 'ko' ? '선택' : 'optional'})</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {CERTIFICATIONS.map(cert => (
                  <label key={cert} className="flex items-center p-2 border rounded hover:bg-gray-50">
                    <input type="checkbox" value={cert} {...register('certificationsNeeded')} className="w-4 h-4" />
                    <span className="ml-2 text-sm">{cert}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* NDA */}
            <div>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" {...register('ndaNeeded')} className="w-5 h-5" />
                <span className="ml-3 font-medium">{t('matching.nda_needed')}</span>
              </label>
              <p className="text-sm text-gray-600 mt-2">{t('matching.nda_desc')}</p>
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
              <label className="block text-sm font-medium mb-2">
                {lang === 'ko' ? '회사 웹사이트 · 브랜드 링크' : 'Company Website / Brand Link'} <span className="font-normal text-gray-400">({lang === 'ko' ? '선택' : 'optional'})</span>
              </label>
              <input
                type="text"
                placeholder="https://"
                {...register('website')}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              />
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

            {/* 개인정보 수집·이용 동의 (필수) */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" {...register('privacyConsent')} className="mt-0.5 w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'ko' ? '개인정보 수집·이용에 동의합니다. ' : 'I agree to the collection and use of my personal information. '}
                  <Link href="/privacy" className="underline hover:text-[#3d3d3d]">
                    {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
                  </Link>
                </span>
              </label>
              {errors.privacyConsent && <p className="text-red-600 text-sm mt-1">{errors.privacyConsent.message}</p>}
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
