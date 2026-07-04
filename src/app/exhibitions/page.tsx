'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export const dynamic = 'force-dynamic'

const REGIONS: { id: string; labelKey?: string; label?: string }[] = [
  { id: 'all', labelKey: 'exhibitions.all_regions' },
  { id: 'KR', label: 'Korea' },
  { id: 'ASIA', label: 'Asia' },
  { id: 'EU', label: 'Europe' },
  { id: 'ME', label: 'Middle East' },
  { id: 'JP', label: 'Japan' },
]

interface LocalizedString {
  ko: string
  en: string
}

interface Exhibition {
  id: string
  title: LocalizedString
  dateRange: string
  location: LocalizedString
  region: string
  image: string
  status: 'upcoming' | 'past'
  description: LocalizedString
}

export default function ExhibitionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang, t } = useLanguage()
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const status = searchParams.get('status') || 'upcoming'
  const region = searchParams.get('region') || 'all'
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('status', status)
    if (region !== 'all') params.set('region', region)
    params.set('page', String(page))

    fetch(`/api/exhibitions?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setExhibitions(data.items)
        setTotal(data.total)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [status, region, page])

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (value === 'all' && key === 'region') {
      params.delete('region')
    } else {
      params.set(key, value)
    }
    params.delete('page')
    router.push(`/exhibitions?${params.toString()}`, { scroll: false })
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('page', String(p))
    router.push(`/exhibitions?${params.toString()}`, { scroll: false })
  }

  const pageSize = 12
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="pt-20 pb-12" style={{ background: 'var(--background)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 text-center">
          <div className="page-title-reveal">
            <h1 className="text-[38px] font-bold tracking-[-0.02em] mb-3 text-[var(--foreground)]">{t('exhibitions.title')}</h1>
          </div>
          <p className="page-title-subtitle text-base text-neutral-400 font-light">
            {t('exhibitions.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-[1248px] mx-auto px-6 md:px-24 py-16">
        {/* Status Tabs */}
        <div className="mb-8 border-b border-[var(--color-border)]">
          <div className="flex gap-8">
            <button
              onClick={() => updateFilter('status', 'upcoming')}
              className={`pb-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                status === 'upcoming'
                  ? 'border-[var(--foreground)] text-[var(--foreground)]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-400'
              }`}
            >
              {t('exhibitions.upcoming')}
            </button>
            <button
              onClick={() => updateFilter('status', 'past')}
              className={`pb-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                status === 'past'
                  ? 'border-[var(--foreground)] text-[var(--foreground)]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-400'
              }`}
            >
              {t('exhibitions.past_events')}
            </button>
          </div>
        </div>

        {/* Region Filter */}
        <div className="mb-12">
          <label className="text-[18px] font-semibold text-[var(--foreground)] mb-4 block">{t('exhibitions.filter_region')}</label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(reg => (
              <button
                key={reg.id}
                onClick={() => updateFilter('region', reg.id)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-md ${
                  region === reg.id
                    ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                    : 'border border-[var(--color-border)] text-neutral-400 hover:border-[var(--color-hover-border)]'
                }`}
              >
                {reg.labelKey ? t(reg.labelKey) : reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exhibitions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-neutral-50 mb-4"></div>
                <div className="h-6 bg-neutral-50 mb-2"></div>
                <div className="h-4 bg-neutral-50"></div>
              </div>
            ))}
          </div>
        ) : exhibitions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {exhibitions.map((exhibition) => (
                <Link
                  key={exhibition.id}
                  href={`/exhibitions/${exhibition.id}`}
                  className="bg-surface border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-hover-border)] transition-all duration-300 group rounded-[12px]"
                >
                  <div className="relative h-48 bg-neutral-50 overflow-hidden">
                    <img
                      src={exhibition.image}
                      alt={exhibition.title[lang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md ${
                        exhibition.status === 'upcoming'
                          ? 'bg-[var(--foreground)] text-[var(--background)]'
                          : 'bg-neutral-50 text-neutral-400'
                      }`}>
                        {exhibition.status === 'upcoming' ? t('exhibitions.upcoming') : t('exhibitions.past_events')}
                      </span>
                      <span className="px-2.5 py-1 bg-neutral-50 text-neutral-400 text-[10px] font-medium uppercase tracking-wider rounded-md">
                        {exhibition.region}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-[var(--foreground)] group-hover:text-[var(--color-theme-600)] transition-colors line-clamp-2">
                      {exhibition.title[lang]}
                    </h3>
                    <div className="text-sm text-neutral-400 mb-2 font-light">
                      {exhibition.dateRange}
                    </div>
                    <div className="text-sm text-neutral-400 mb-4 font-light">
                      {exhibition.location[lang]}
                    </div>
                    <p className="text-sm text-neutral-400 line-clamp-2 font-light">
                      {exhibition.description[lang]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                  className="px-4 py-2 border border-[var(--color-border)] text-sm font-medium disabled:opacity-50 hover:border-[var(--color-hover-border)] transition-colors rounded-md"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`px-4 py-2 border text-sm font-medium transition-all rounded-md ${
                      page === p
                        ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-hover-border)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => goToPage(page + 1)}
                  className="px-4 py-2 border border-[var(--color-border)] text-sm font-medium disabled:opacity-50 hover:border-[var(--color-hover-border)] transition-colors rounded-md"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{t('exhibitions.no_exhibitions')}</h3>
            <p className="text-neutral-400 font-light mb-6">Try adjusting your filters</p>
            <button
              onClick={() => router.push('/exhibitions?status=upcoming')}
              className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-medium hover:bg-neutral-700 transition-colors text-sm uppercase tracking-wider"
            >
              View all upcoming exhibitions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
