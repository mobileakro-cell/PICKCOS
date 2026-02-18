'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['All', 'OEM', 'Packaging', 'Ingredients', 'Contract Manufacturing']
const REGIONS = [
  { id: 'all', label: 'All Regions' },
  { id: 'KR', label: 'Korea' },
  { id: 'ASIA', label: 'Asia' },
  { id: 'EU', label: 'Europe' },
  { id: 'ME', label: 'Middle East' },
]

interface BilingualText {
  ko: string
  en: string
}

interface BilingualList {
  ko: string[]
  en: string[]
}

interface Supplier {
  id: string
  name: string
  supplierType: BilingualText
  category: string
  image: string
  location: BilingualText
  country: string
  verified: boolean
  ambassadorPick: boolean
  description: BilingualText
  moqRange: string
  leadTimeRange: string
  capabilities: BilingualList
}

export default function SourcingPage() {
  return (
    <Suspense fallback={<SourcingLoading />}>
      <SourcingContent />
    </Suspense>
  )
}

function SourcingLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">SUPPLIERS</h1>
          <p className="text-base text-gray-500 font-light">
            Find your perfect K-Beauty supplier partner
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-8 border border-gray-100">
              <div className="space-y-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i}>
                    <div className="h-5 bg-gray-100 mb-3 w-24 animate-pulse"></div>
                    <div className="space-y-2">
                      {Array(3).fill(0).map((_, j) => (
                        <div key={j} className="h-4 bg-gray-100 animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-white h-96 border border-gray-100"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SourcingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang, t } = useLanguage()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const category = searchParams.get('category') || 'All'
  const region = searchParams.get('region') || 'all'
  const search = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'All') params.set('category', category)
    if (region !== 'all') params.set('region', region)
    if (search) params.set('q', search)
    params.set('page', String(page))

    fetch(`/api/suppliers?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setSuppliers(data.items || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category, region, search, page])

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set(key, value)
    params.delete('page')
    router.push(`/sourcing?${params.toString()}`, { scroll: false })
  }

  function handleSearch(q: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (q) {
      params.set('q', q)
    } else {
      params.delete('q')
    }
    params.delete('page')
    router.push(`/sourcing?${params.toString()}`, { scroll: false })
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('page', String(p))
    router.push(`/sourcing?${params.toString()}`, { scroll: false })
  }

  const pageSize = 12
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">{t('sourcing.title')}</h1>
          <p className="text-base text-gray-500 font-light">
            {t('sourcing.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Search & Filters Grid */}
        <div className="lg:grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="bg-white p-8 border border-gray-100 lg:sticky lg:top-24 h-fit space-y-8">
              {/* Search */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 block">{t('sourcing.search')}</label>
                <input
                  type="text"
                  placeholder={t('sourcing.search_placeholder')}
                  defaultValue={search}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch((e.target as HTMLInputElement).value)
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="pb-8 border-b border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 block">{t('sourcing.category')}</label>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={`w-full text-left px-3 py-2 text-sm font-medium transition-all ${
                        category === cat
                          ? 'bg-[#3d3d3d] text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Filter */}
              <div className="pb-8 border-b border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 block">{t('sourcing.region')}</label>
                <div className="space-y-1">
                  {REGIONS.map(reg => (
                    <button
                      key={reg.id}
                      onClick={() => updateFilter('region', reg.id)}
                      className={`w-full text-left px-3 py-2 text-sm font-medium transition-all ${
                        region === reg.id
                          ? 'bg-[#3d3d3d] text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(category !== 'All' || region !== 'all' || search) && (
                <button
                  onClick={() => router.push('/sourcing')}
                  className="w-full py-2.5 text-gray-500 border border-gray-200 font-medium text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  {t('sourcing.clear_all')}
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white h-80 border border-gray-100"></div>
                ))}
              </div>
            ) : suppliers.length > 0 ? (
              <>
                <div className="mb-6 text-sm text-gray-500 font-light">
                  {t('sourcing.showing')} {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} {t('sourcing.of')} {total} {t('sourcing.suppliers')}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {suppliers.map((supplier) => (
                    <Link
                      key={supplier.id}
                      href={`/suppliers/${supplier.id}`}
                      className="bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative h-44 bg-gray-100 overflow-hidden">
                        <img
                          src={supplier.image}
                          alt={supplier.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          {supplier.verified && (
                            <span className="px-2 py-0.5 bg-white text-[#3d3d3d] text-[10px] font-medium uppercase tracking-wider">{t('sourcing.verified')}</span>
                          )}
                          {supplier.ambassadorPick && (
                            <span className="px-2 py-0.5 bg-[#3d3d3d] text-white text-[10px] font-medium uppercase tracking-wider">{t('sourcing.pick')}</span>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-2">
                          <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-medium uppercase tracking-wider">
                            {supplier.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-gray-900 mb-1 group-hover:text-gray-600 transition-colors line-clamp-1">
                          {supplier.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3 font-light">{supplier.supplierType[lang]}</p>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2 font-light">
                          {supplier.description[lang]}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                          <span>{supplier.location[lang]}</span>
                          <span className="group-hover:text-gray-600 transition-colors">&rarr;</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 flex-wrap">
                    <button
                      disabled={page === 1}
                      onClick={() => goToPage(page - 1)}
                      className="px-4 py-2 border border-gray-200 font-medium text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      &larr; {t('sourcing.previous')}
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = page <= 3 ? i + 1 : page + i - 2
                      return p <= totalPages ? (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`px-4 py-2 border font-medium text-sm transition-all ${
                            page === p
                              ? 'bg-[#3d3d3d] text-white border-[#3d3d3d]'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      ) : null
                    })}
                    <button
                      disabled={page === totalPages}
                      onClick={() => goToPage(page + 1)}
                      className="px-4 py-2 border border-gray-200 font-medium text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      {t('sourcing.next')} &rarr;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('sourcing.no_suppliers')}</h3>
                <p className="text-gray-500 font-light mb-6">{t('sourcing.try_adjusting')}</p>
                <button
                  onClick={() => router.push('/sourcing')}
                  className="inline-block px-6 py-3 bg-[#3d3d3d] text-white font-medium hover:bg-[#2d2d2d] transition-all text-sm uppercase tracking-wider"
                >
                  {t('sourcing.clear_filters')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white border border-gray-100 p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('sourcing.cant_find')}</h3>
          <p className="text-gray-500 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('sourcing.get_matched')}
          </p>
          <Link
            href="/request-matching"
            className="inline-block px-8 py-4 bg-[#3d3d3d] text-white font-medium hover:bg-[#2d2d2d] transition-all text-sm uppercase tracking-wider"
          >
            {t('sourcing.request_custom')}
          </Link>
        </div>
      </div>
    </div>
  )
}
