'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { SUPPLIER_TYPES, PRODUCT_CATEGORIES, supplierTypeLabel, productCategoryLabel } from '@/lib/types'

export const dynamic = 'force-dynamic'

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
  productCategories: string[]
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
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="pt-20 pb-12" style={{ background: 'var(--background)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 text-center">
          <h1 className="text-[38px] font-bold mb-3 text-[var(--foreground)] tracking-[-0.02em]">SUPPLIERS</h1>
          <p className="text-base text-neutral-400 font-light">
            Find your perfect K-Beauty supplier partner
          </p>
        </div>
      </section>
      <div className="max-w-[1248px] mx-auto px-6 md:px-24 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-surface p-8 border border-[var(--color-border)] rounded-[12px]">
              <div className="space-y-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i}>
                    <div className="h-5 bg-neutral-50 mb-3 w-24 animate-pulse"></div>
                    <div className="space-y-2">
                      {Array(3).fill(0).map((_, j) => (
                        <div key={j} className="h-4 bg-neutral-50 animate-pulse"></div>
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
                <div key={i} className="animate-pulse bg-surface h-96 border border-[var(--color-border)] rounded-[12px]"></div>
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
  const [filtersOpen, setFiltersOpen] = useState(true)

  const category = searchParams.get('category') || 'All'
  const products = (searchParams.get('products') || '').split(',').filter(Boolean)
  const search = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'All') params.set('category', category)
    if (products.length) params.set('products', products.join(','))
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
  }, [category, products.join(','), search, page])

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set(key, value)
    params.delete('page')
    router.push(`/sourcing?${params.toString()}`, { scroll: false })
  }

  function toggleProduct(code: string) {
    const next = products.includes(code) ? products.filter((p) => p !== code) : [...products, code]
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (next.length) params.set('products', next.join(','))
    else params.delete('products')
    params.delete('page')
    router.push(`/sourcing?${params.toString()}`, { scroll: false })
  }

  function clearProducts() {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.delete('products')
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
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="pt-20 pb-12" style={{ background: 'var(--background)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 text-center">
          <div className="page-title-reveal">
            <h1 className="text-[38px] font-bold mb-3 text-[var(--foreground)] tracking-[-0.02em]">{t('sourcing.title')}</h1>
          </div>
          <p className="page-title-subtitle text-base text-[var(--color-sub-text)] font-light">
            {t('sourcing.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-[1248px] mx-auto px-6 md:px-24 pt-16">
        {/* ═══ Filter (styletech pattern) ═══ */}
        <div className="flex items-end justify-between">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground)] cursor-pointer hover:opacity-70 transition-opacity"
            aria-expanded={filtersOpen}
          >
            {lang === 'ko' ? '필터' : 'Filters'}
            {(category !== 'All' ? 1 : 0) + products.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-theme-500)] px-1.5 text-[11px] font-semibold tracking-normal text-white">
                {(category !== 'All' ? 1 : 0) + products.length}
              </span>
            )}
            <svg className={`h-4 w-4 transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="relative w-[320px]">
            <input
              type="text"
              placeholder={t('sourcing.search_placeholder')}
              defaultValue={search}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch((e.target as HTMLInputElement).value)
                }
              }}
              className="h-[46px] w-full rounded-none border border-[var(--color-gray-text)] bg-surface px-4 pr-10 text-[15px] font-normal text-[var(--foreground)] placeholder:text-[var(--color-sub-text)] outline-none focus:border-[var(--color-sub-text)] transition-colors duration-200"
            />
            {search ? (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-[var(--foreground)] transition-colors"
                title="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 h-0.5 w-full bg-[var(--color-gray-text)]" />

        {/* Filter Boxes — collapsible */}
        {filtersOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Axis 1 — Supplier type */}
          <div className="border-y border-[var(--color-gray-text)] px-5 py-5">
            <div className="flex items-start justify-between">
              <div className="text-[18px] font-semibold">{lang === 'ko' ? '공급자 유형' : 'Supplier type'}</div>
              <button type="button" onClick={() => updateFilter('category', 'All')} className="pr-2 text-[16px] text-[var(--color-sub-text)] font-normal cursor-pointer hover:text-[var(--foreground)] transition-colors">{t('sourcing.clear_all')}</button>
            </div>
            <div className="mt-4 pr-4">
              <div className="grid grid-cols-[1fr_auto] gap-y-3 text-[16px] font-medium">
                {['All', ...SUPPLIER_TYPES.map((s) => s.code)].map((cat) => (
                  <div key={cat} className="contents">
                    <button type="button" onClick={() => updateFilter('category', cat)} className="flex items-center gap-3 text-left cursor-pointer group/filter">
                      <span className={`grid h-5 w-5 place-items-center rounded-full border transition-colors duration-200 ${category === cat ? 'border-[var(--foreground)] bg-[var(--foreground)]' : 'border-[var(--color-gray-text)] group-hover/filter:border-[var(--color-sub-text)]'}`}>
                        {category === cat && <svg className="h-2.5 w-2.5 text-[var(--background)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </span>
                      <span className="transition-colors duration-200 group-hover/filter:text-[var(--foreground)]">{cat === 'All' ? (lang === 'ko' ? '전체' : 'All') : supplierTypeLabel(cat, lang)}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Axis 2 — Product category (multi-select) */}
          <div className="border-y border-[var(--color-gray-text)] px-5 py-5">
            <div className="flex items-start justify-between">
              <div className="text-[18px] font-semibold">{lang === 'ko' ? '제품군' : 'Product category'}</div>
              <button type="button" onClick={clearProducts} className="pr-2 text-[16px] text-[var(--color-sub-text)] font-normal cursor-pointer hover:text-[var(--foreground)] transition-colors">{t('sourcing.clear_all')}</button>
            </div>
            <div className="mt-4 pr-4">
              <div className="grid grid-cols-2 gap-y-3 text-[16px] font-medium">
                {PRODUCT_CATEGORIES.map((p) => {
                  const active = products.includes(p.code)
                  return (
                    <button key={p.code} type="button" onClick={() => toggleProduct(p.code)} className="flex items-center gap-3 text-left cursor-pointer group/filter">
                      <span className={`grid h-5 w-5 place-items-center rounded-[4px] border transition-colors duration-200 ${active ? 'border-[var(--color-theme-500)] bg-[var(--color-theme-500)]' : 'border-[var(--color-gray-text)] group-hover/filter:border-[var(--color-sub-text)]'}`}>
                        {active && <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </span>
                      <span className="transition-colors duration-200 group-hover/filter:text-[var(--foreground)]">{productCategoryLabel(p.code, lang)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Main Content - Full Width */}
        <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface h-80 border border-[var(--color-border)] rounded-[12px]"></div>
                ))}
              </div>
            ) : suppliers.length > 0 ? (
              <>
                <div className="mb-6 text-sm text-neutral-400 font-light">
                  {t('sourcing.showing')} {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} {t('sourcing.of')} {total} {t('sourcing.suppliers')}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {suppliers.map((supplier) => (
                    <Link
                      key={supplier.id}
                      href={`/suppliers/${supplier.id}`}
                      className="bg-surface border border-[var(--color-border)] rounded-[12px] overflow-hidden hover:border-[var(--color-hover-border)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group"
                    >
                      <div className="relative h-48 bg-neutral-50 overflow-hidden">
                        <img
                          src={supplier.image}
                          alt={supplier.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          {supplier.verified && (
                            <span className="px-2 py-0.5 bg-surface text-[var(--foreground)] text-[10px] font-medium uppercase tracking-wider">{t('sourcing.verified')}</span>
                          )}
                          {supplier.ambassadorPick && (
                            <span className="px-2 py-0.5 bg-[var(--foreground)] text-[var(--background)] text-[10px] font-medium uppercase tracking-wider">{t('sourcing.pick')}</span>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-2 flex flex-wrap gap-1">
                          <span className="inline-block px-2.5 py-1 bg-[var(--foreground)] text-[var(--background)] text-[10px] font-medium uppercase tracking-wider">
                            {supplierTypeLabel(supplier.category, lang)}
                          </span>
                          {(supplier.productCategories || []).slice(0, 3).map((pc) => (
                            <span key={pc} className="inline-block px-2 py-1 bg-[var(--color-theme-50)] text-[var(--color-theme-800)] text-[10px] font-medium tracking-wide">
                              {productCategoryLabel(pc, lang)}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-bold text-base text-[var(--foreground)] mb-1 group-hover:text-[var(--color-theme-600)] transition-colors line-clamp-1 tracking-wide">
                          {supplier.name}
                        </h3>
                        <p className="text-xs text-neutral-400 mb-3 font-light">{supplier.supplierType[lang]}</p>
                        <p className="text-sm text-neutral-400 mb-3 leading-relaxed line-clamp-2 font-light">
                          {supplier.description[lang]}
                        </p>
                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-[var(--color-border)]">
                          <span>{supplier.location[lang]}</span>
                          <span className="group-hover:text-neutral-400 transition-colors">&rarr;</span>
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
                      className="px-4 py-2 border border-[var(--color-border)] font-medium text-sm disabled:opacity-50 hover:bg-neutral-50 transition-colors rounded-lg"
                    >
                      &larr; {t('sourcing.previous')}
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = page <= 3 ? i + 1 : page + i - 2
                      return p <= totalPages ? (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`px-4 py-2 border font-medium text-sm transition-all rounded-lg ${
                            page === p
                              ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                              : 'border-[var(--color-border)] hover:bg-neutral-50'
                          }`}
                        >
                          {p}
                        </button>
                      ) : null
                    })}
                    <button
                      disabled={page === totalPages}
                      onClick={() => goToPage(page + 1)}
                      className="px-4 py-2 border border-[var(--color-border)] font-medium text-sm disabled:opacity-50 hover:bg-neutral-50 transition-colors rounded-lg"
                    >
                      {t('sourcing.next')} &rarr;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{t('sourcing.no_suppliers')}</h3>
                <p className="text-neutral-400 font-light mb-6">{t('sourcing.try_adjusting')}</p>
                <button
                  onClick={() => router.push('/sourcing')}
                  className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-medium hover:bg-neutral-700 transition-all text-sm uppercase tracking-wider rounded-md"
                >
                  {t('sourcing.clear_filters')}
                </button>
              </div>
            )}
          </div>

        {/* CTA Section */}
        <div className="mt-20 bg-surface border border-[var(--color-border)] rounded-[12px] p-12 text-center">
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">{t('sourcing.cant_find')}</h3>
          <p className="text-neutral-400 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('sourcing.get_matched')}
          </p>
          <Link
            href="/request-matching"
            className="inline-block px-8 py-4 bg-[var(--foreground)] text-[var(--background)] font-medium hover:bg-neutral-700 transition-all text-sm uppercase tracking-wider rounded-md"
          >
            {t('sourcing.request_custom')}
          </Link>
        </div>
      </div>
    </div>
  )
}
