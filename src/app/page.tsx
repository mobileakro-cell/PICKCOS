'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import HeroGraphic from '@/components/HeroGraphic'
import { supplierTypeLabel, productCategoryLabel } from '@/lib/types'

// One odometer digit — a reversed 9→0 reel that slides vertically (top→bottom)
// to the target digit via an eased CSS transition.
function RollDigit({ d }: { d: number }) {
  return (
    <span style={{ display: 'inline-block', height: '1em', lineHeight: 1, overflow: 'hidden', verticalAlign: 'top' }}>
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(-${9 - d}em)`,
          transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((n) => (
          <span key={n} style={{ height: '1em', lineHeight: 1 }}>{n}</span>
        ))}
      </span>
    </span>
  )
}

// Rolling counter — counts 1 → value (screen entry), each digit rolling
// vertically. Uses setInterval + CSS transitions (no rAF), so it animates
// smoothly everywhere including headless preview.
function RollingNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [n, setN] = useState(1)
  const started = useRef(false)
  useEffect(() => {
    if (!value || started.current) return
    started.current = true
    if (value <= 1) { setN(value); return }
    const startMs = Date.now()
    const id = setInterval(() => {
      const p = Math.min((Date.now() - startMs) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4) // easeOutQuart — soft, gliding settle
      setN(1 + Math.round(eased * (value - 1)))
      if (p >= 1) { setN(value); clearInterval(id) }
    }, 55)
    return () => clearInterval(id)
  }, [value, duration])

  const digits = String(n).split('').map(Number)
  return (
    <span style={{ display: 'inline-flex' }}>
      {digits.map((d, i) => <RollDigit key={digits.length + '-' + i} d={d} />)}
    </span>
  )
}

interface Article {
  id: string
  slug: string
  title: { ko: string; en: string }
  summary: { ko: string; en: string }
  category: string
  region: string
  publishedAt: string
  image: string
  author: string
  isHeadline: boolean
  relatedSuppliers: string[]
}

interface Supplier {
  id: string
  name: string
  category: string
  productCategories: string[]
  exportMarkets?: string[]
  image: string
  description: { ko: string; en: string }
  location: { ko: string; en: string }
}

export default function HomePage() {
  const { lang, t } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    fetch('/api/articles?pageSize=100')
      .then(r => r.json())
      .then(data => setArticles(data.items || []))
      .catch(() => {})
    fetch('/api/suppliers?pageSize=100')
      .then(r => r.json())
      .then(data => setAllSuppliers(data.items || []))
      .catch(() => {})
  }, [])

  // Ensure the hero banner video autoplays (React doesn't always reflect the muted attr)
  useEffect(() => {
    document.querySelectorAll('video').forEach((v) => {
      const el = v as HTMLVideoElement
      el.muted = true
      el.playbackRate = 0.45 // slow the motion ~2.2x so the rise feels calm
      el.play().catch(() => {})
    })
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  // Category color mapping function - returns bg and text colors
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      'MARKET': { bg: 'bg-neutral-50', text: 'text-neutral-400' },
      'INSIGHT': { bg: 'bg-theme-50', text: 'text-theme-800' },
      'Materials': { bg: 'bg-[#EEEDFE]', text: 'text-[#534AB7]' },
      'COMPANY': { bg: 'bg-neutral-100', text: 'text-neutral-400' },
      'PEOPLE': { bg: 'bg-theme-100', text: 'text-theme-700' },
      'OEM': { bg: 'bg-[#E6F1FB]', text: 'text-[#185FA5]' },
      'Packaging': { bg: 'bg-[#E1F5EE]', text: 'text-[#0F6E56]' },
      'PACKAGING': { bg: 'bg-[#E1F5EE]', text: 'text-[#0F6E56]' },
      'Ingredients': { bg: 'bg-[#FAEEDA]', text: 'text-[#854F0B]' },
      'INGREDIENTS': { bg: 'bg-[#FAEEDA]', text: 'text-[#854F0B]' },
      'Equipment': { bg: 'bg-[#EEEDFE]', text: 'text-[#534AB7]' },
      'EQUIPMENT': { bg: 'bg-[#EEEDFE]', text: 'text-[#534AB7]' },
      'Contract Manufacturing': { bg: 'bg-[#E6F1FB]', text: 'text-[#185FA5]' },
    }
    return styles[category] || { bg: 'bg-neutral-100', text: 'text-neutral-400' }
  }

  const headline = articles.find(a => a.isHeadline) || articles[0]
  const headlineIds = articles.filter(a => a.isHeadline).map(a => a.id)

  const relatedSupplierIds = headline?.relatedSuppliers || []
  const relatedSuppliers = relatedSupplierIds
    .map(id => allSuppliers.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 2) as Supplier[]

  const latestNews = articles
    .filter(a => !headlineIds.includes(a.id))
    .slice(0, 5)

  const featuredSuppliers = allSuppliers.slice(0, 4)

  // Hero stats auto-derived from live supplier data (updates as data changes)
  const supplierCount = allSuppliers.length
  const categoryCount = new Set(allSuppliers.flatMap((s) => s.productCategories || [])).size
  const marketCount = new Set(allSuppliers.flatMap((s) => s.exportMarkets || [])).size
  const heroStats: { value: number; key: string }[] = [
    { value: supplierCount, key: 'home.hero_stat_suppliers' },
    { value: categoryCount, key: 'home.hero_stat_categories' },
    { value: marketCount, key: 'home.hero_stat_markets' },
  ]

  return (
    <div className="w-full">

      {/* ============ HERO — PC (full-bleed, header floats over it) ============ */}
      <section
        className="hidden md:block relative w-full h-[620px] overflow-hidden"
        style={{ background: 'linear-gradient(100deg,#0A3325 0%,#0C4433 52%,#115C45 100%)' }}
      >
        <HeroGraphic className="absolute inset-0 h-full w-full" />
        {/* Lab banner motion video (poster = still frame, illustration behind as fallback) */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'contrast(1.12) brightness(1.06) saturate(1.14)' }}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-lab.jpg"
        >
          <source src="/images/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,#0A3325 0%,rgba(10,51,37,0.88) 24%,rgba(10,51,37,0.5) 52%,rgba(10,51,37,0.2) 100%)' }} />
        <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 170px rgba(0,0,0,0.55)' }} />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-center px-10">
          <div className="max-w-[600px]">
            <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--color-theme-300)]">{t('home.hero_eyebrow')}</p>
            <h1 className="mb-6 whitespace-pre-line text-[52px] font-semibold leading-[1.12] tracking-[-0.02em] text-white">{t('home.hero_title')}</h1>
            <p className="mb-9 max-w-[540px] text-[18px] leading-[1.6] text-white/80">{t('home.hero_subtitle')}</p>
            <div className="flex items-center gap-3">
              <Link href="/sourcing" className="rounded-md bg-[var(--color-theme-500)] px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-[var(--color-theme-600)]">{t('home.hero_browse')}</Link>
              <Link href="/request-matching" className="rounded-md border border-white/40 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-white/10">{t('home.hero_matching')}</Link>
            </div>
            <div className="mt-12 flex items-center gap-12">
              {heroStats.map((st) => (
                <div key={st.key}>
                  <div className="text-[52px] font-semibold leading-none text-white tabular-nums" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}><RollingNumber value={st.value} /></div>
                  <div className="mt-2.5 text-[12px] uppercase tracking-[0.08em] text-white/55">{t(st.key)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ HERO — Mobile (full-bleed) ============ */}
      <section
        className="relative flex min-h-[90vh] w-full flex-col justify-end overflow-hidden md:hidden"
        style={{ background: 'linear-gradient(160deg,#0A3325 0%,#0C4433 58%,#115C45 100%)' }}
      >
        <div className="absolute inset-x-0 top-0 h-[52%] overflow-hidden">
          <HeroGraphic className="absolute inset-0 h-full w-full" />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'contrast(1.12) brightness(1.06) saturate(1.14)' }}
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-lab.jpg"
          >
            <source src="/images/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(10,51,37,0.15) 0%,rgba(10,51,37,0.4) 62%,#0A3325 100%)' }} />
        </div>
        <div className="relative z-10 px-6 pb-14 pt-10">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-theme-300)]">{t('home.hero_eyebrow')}</p>
          <h1 className="mb-4 whitespace-pre-line text-[30px] font-semibold leading-[1.2] tracking-[-0.01em] text-white">{t('home.hero_title')}</h1>
          <p className="mb-7 text-[15px] leading-[1.6] text-white/80">{t('home.hero_subtitle')}</p>
          <div className="flex flex-col gap-3">
            <Link href="/sourcing" className="w-full rounded-md bg-[var(--color-theme-500)] px-6 py-4 text-center text-[15px] font-semibold text-white">{t('home.hero_browse')}</Link>
            <Link href="/request-matching" className="w-full rounded-md border border-white/40 px-6 py-4 text-center text-[15px] font-semibold text-white">{t('home.hero_matching')}</Link>
          </div>
        </div>
      </section>

      {/* ============ LATEST NEWS ============ */}
      <section className="border-b border-[var(--color-border)]">
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 pt-14 pb-14">
          <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[var(--foreground)]">{t('home.latest_news')}</h2>
            <Link href="/news" className="text-[14px] font-medium text-[var(--color-theme-600)] underline-offset-4 hover:text-[var(--color-theme-700)] hover:underline transition-colors">{t('home.view_all')} →</Link>
          </div>

          {/* Sub Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group"
              >
                <div className="h-[200px] bg-neutral-50 overflow-hidden mb-4 rounded-[12px]">
                  <img src={article.image} alt={article.title[lang]} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 ${getCategoryStyle(article.category).bg} ${getCategoryStyle(article.category).text} text-[11px] uppercase tracking-wider font-semibold rounded-md`}>{article.category}</span>
                  <span className="text-xs text-[var(--color-gray-text)]">{formatDate(article.publishedAt)}</span>
                </div>
                <h4 className="text-[17px] font-semibold text-[var(--foreground)] leading-snug group-hover:text-[var(--color-theme-600)] transition-colors line-clamp-2">
                  {article.title[lang]}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SUPPLIERS ============ */}
      <section className="border-b border-[var(--color-border)]">
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 py-14">
          <div className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[var(--foreground)]">{t('home.verified_suppliers')}</h2>
            <Link href="/sourcing" className="text-[14px] font-medium text-[var(--color-theme-600)] underline-offset-4 hover:text-[var(--color-theme-700)] hover:underline transition-colors">
              {t('home.view_all')} →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredSuppliers.map((s) => (
              <Link key={s.id} href={`/suppliers/${s.id}`} className="group">
                <div className="aspect-[4/3] bg-neutral-50 overflow-hidden mb-3 rounded-[12px]">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <span className={`inline-block px-2 py-0.5 ${getCategoryStyle(s.category).bg} ${getCategoryStyle(s.category).text} text-[11px] uppercase tracking-[0.06em] font-semibold rounded`}>{supplierTypeLabel(s.category, lang)}</span>
                  {(s.productCategories || []).slice(0, 2).map((pc) => (
                    <span key={pc} className="inline-block px-2 py-0.5 bg-[var(--color-theme-50)] text-[var(--color-theme-800)] text-[11px] font-semibold rounded">{productCategoryLabel(pc, lang)}</span>
                  ))}
                </div>
                <h3 className="text-[15px] font-semibold text-[var(--foreground)] mt-1 leading-snug group-hover:text-[var(--color-theme-600)] transition-colors">{s.name}</h3>
                <p className="text-[12px] text-[var(--color-sub-text)] mt-1 leading-relaxed line-clamp-2">{s.description[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-[var(--foreground)]">
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-[18px] font-medium text-center md:text-left" style={{ color: 'var(--background)' }}>{t('home.ready_find_supplier')}</h2>
            <div className="flex gap-3">
              <Link
                href="/request-matching"
                className="px-8 py-3 bg-theme-400 text-white text-[13px] font-semibold uppercase tracking-[0.06em] rounded-md hover:bg-theme-600 transition-all"
              >
                {t('home.request_matching')}
              </Link>
              <Link
                href="/sourcing"
                className="px-8 py-3 border border-neutral-200/30 text-neutral-200/80 text-[13px] font-medium uppercase tracking-[0.06em] rounded-md hover:border-neutral-200/60 hover:text-neutral-200 transition-all"
              >
                {t('home.browse_suppliers')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="border-t border-[var(--color-border)]">
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[16px] text-[var(--foreground)] font-normal text-center md:text-left">{t('home.newsletter_desc')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto flex-shrink-0">
              <input
                type="email"
                placeholder={t('home.enter_email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 md:w-56 px-4 py-2.5 bg-surface border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--foreground)] text-[13px] text-[var(--foreground)] placeholder:text-[var(--color-gray-text)]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] text-[13px] font-semibold uppercase tracking-[0.06em] rounded-md hover:opacity-85 transition-all"
              >
                {t('home.subscribe')}
              </button>
            </form>
          </div>
          {subscribed && (
            <p className="text-theme-600 font-medium mt-3 text-[13px]">{t('home.thanks_subscribing')}</p>
          )}
        </div>
      </section>
    </div>
  )
}
