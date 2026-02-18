'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

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

  // Headline article (isHeadline: true, most recent)
  const headline = articles.find(a => a.isHeadline) || articles[0]
  const headlineIds = articles.filter(a => a.isHeadline).map(a => a.id)

  // Related suppliers for the headline article (sub-headline area)
  const relatedSupplierIds = headline?.relatedSuppliers || []
  const relatedSuppliers = relatedSupplierIds
    .map(id => allSuppliers.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 2) as Supplier[]

  // Latest News: exclude headline articles
  const latestNews = articles
    .filter(a => !headlineIds.includes(a.id))
    .slice(0, 5)

  // Featured suppliers for the bottom section (first 4)
  const featuredSuppliers = allSuppliers.slice(0, 4)

  return (
    <div className="w-full bg-white">

      {/* ============ HEADLINES + LATEST NEWS (2-Column) ============ */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">

            {/* Left - Headlines */}
            <div className="lg:border-r lg:border-gray-200 lg:pr-10">
              {/* Section Title */}
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">{t('home.headlines')}</h2>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Main Headline */}
              {headline && (
                <Link href={`/news/${headline.slug}`} className="block group mb-8">
                  <div className="h-64 md:h-80 bg-gray-100 overflow-hidden mb-5">
                    <img src={headline.image} alt={headline.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-[#3d3d3d] text-white text-[10px] uppercase tracking-wider font-medium">{headline.category}</span>
                    <span className="text-xs text-gray-400">{formatDate(headline.publishedAt)}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-black leading-tight mb-3 group-hover:text-gray-600 transition-colors">
                    {headline.title[lang]}
                  </h3>
                  <p className="text-gray-500 leading-relaxed line-clamp-2">{headline.summary[lang]}</p>
                </Link>
              )}

              {/* Related Suppliers - 2 column (matched to headline) */}
              {relatedSuppliers.length > 0 && (
                <div className="pt-8 border-t border-gray-100">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-4">{t('home.related_suppliers')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedSuppliers.map((s) => (
                      <Link key={s.id} href={`/suppliers/${s.id}`} className="group">
                        <div className="h-40 bg-gray-100 overflow-hidden mb-3">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{s.category}</span>
                        <h4 className="text-sm font-bold text-black mt-1 leading-snug group-hover:text-gray-600 transition-colors">
                          {s.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description[lang]}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Latest News Sidebar */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">{t('home.latest_news')}</h2>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-0">
                {latestNews.map((article, i) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className={`flex gap-4 pb-4 group hover:bg-gray-50 hover:pl-2 transition-all ${i > 0 ? 'pt-4' : ''} ${i < latestNews.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 overflow-hidden">
                      <img src={article.image} alt={article.title[lang]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-[#3d3d3d] text-white text-[10px] uppercase tracking-wider font-medium">{article.category}</span>
                        <span className="text-xs text-gray-400">{formatDate(article.publishedAt)}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-black leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
                        {article.title[lang]}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>

              <Link href="/news" className="block mt-6 text-center py-3 border border-[#3d3d3d] text-[#3d3d3d] text-xs uppercase tracking-wider font-medium hover:bg-[#3d3d3d] hover:text-white transition-colors">
                {t('home.view_all_news')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SUPPLIERS ============ */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">{t('home.verified_suppliers')}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <Link href="/sourcing" className="text-xs text-gray-500 hover:text-black transition-colors uppercase tracking-wider">
              {t('home.view_all')} →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredSuppliers.map((s) => (
              <Link key={s.id} href={`/suppliers/${s.id}`} className="group">
                <div className="h-40 bg-gray-100 overflow-hidden mb-3">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{s.category}</p>
                <h3 className="text-sm font-bold text-black mt-1 group-hover:text-gray-600 transition-colors">{s.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GET STARTED ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/bg-getstarted.svg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3d3d3d]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">{t('home.get_started')}</p>
              <h2 className="text-xl font-bold text-white">{t('home.ready_find_supplier')}</h2>
            </div>
            <div className="flex gap-3">
              <Link
                href="/request-matching"
                className="px-6 py-3 bg-white text-gray-900 text-xs font-medium uppercase tracking-wider hover:bg-gray-100 transition-colors"
              >
                {t('home.request_matching')}
              </Link>
              <Link
                href="/sourcing"
                className="px-6 py-3 border border-gray-400 text-gray-200 text-xs font-medium uppercase tracking-wider hover:bg-white/10 hover:text-white transition-colors"
              >
                {t('home.browse_suppliers')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/bg-newsletter.svg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">{t('home.stay_updated')}</p>
              <p className="text-sm text-gray-600">{t('home.newsletter_desc')}</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder={t('home.enter_email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 md:w-64 px-4 py-2.5 bg-white border border-gray-200 focus:outline-none focus:border-gray-400 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#3d3d3d] text-white font-medium hover:bg-[#2d2d2d] transition-colors text-xs uppercase tracking-wider"
              >
                {t('home.subscribe')}
              </button>
            </form>
          </div>
          {subscribed && (
            <p className="text-gray-600 font-medium mt-3 text-sm">{t('home.thanks_subscribing')}</p>
          )}
        </div>
      </section>
    </div>
  )
}
