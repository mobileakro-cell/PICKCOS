'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface BilingualText {
  ko: string
  en: string
}

interface Exhibition {
  id: string
  title: BilingualText
  dateRange: string
  location: BilingualText
  region: string
  image: string
  status: 'upcoming' | 'past'
  description: BilingualText
  supplierIds: string[]
  articleIds: string[]
}

interface Supplier {
  id: string
  name: string
  category: string
  image: string
  location: BilingualText
  description: BilingualText
  supplierType: BilingualText
  verified: boolean
}

interface Article {
  id: string
  slug: string
  title: BilingualText
  summary: BilingualText
  category: string
  publishedAt: string
  image: string
}

function formatDateShort(d: string) {
  const date = new Date(d)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

export default function ExhibitionDetailPage({ params }: { params: { id: string } }) {
  const { lang, t } = useLanguage()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/exhibitions/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(async (data) => {
        setExhibition(data)

        // Fetch participating suppliers
        if (data.supplierIds?.length > 0) {
          const suppRes = await fetch('/api/suppliers?pageSize=100')
          const suppData = await suppRes.json()
          const matched = (suppData.items || []).filter((s: any) => data.supplierIds.includes(s.id))
          setSuppliers(matched)
        }

        // Fetch related articles
        if (data.articleIds?.length > 0) {
          const artRes = await fetch('/api/articles?pageSize=100')
          const artData = await artRes.json()
          const matched = (artData.items || []).filter((a: any) => data.articleIds.includes(a.id))
          setArticles(matched)
        }

        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-72 bg-soft-gray mb-8"></div>
          <div className="h-8 bg-soft-gray mb-4 w-1/2"></div>
          <div className="h-4 bg-soft-gray w-1/3"></div>
        </div>
      </div>
    )
  }

  if (error || !exhibition) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <h1 className="text-4xl font-bold text-charcoal mb-4">{t('exhibition.not_found')}</h1>
          <p className="text-mocha-gray mb-8 font-light">The exhibition you're looking for doesn't exist.</p>
          <Link href="/exhibitions" className="px-8 py-3 bg-charcoal text-ivory text-xs font-medium uppercase tracking-wider hover:bg-graphite transition-colors rounded-pill">
            {t('exhibition.back_to_exhibitions')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="h-64 md:h-80 bg-soft-gray overflow-hidden">
        <img
          src={exhibition.image}
          alt={exhibition.title[lang]}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Exhibition Header */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="py-10 border-b border-border">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-mocha-gray mb-6">
            <Link href="/exhibitions" className="hover:text-mocha-gray transition-colors uppercase tracking-wider">{t('exhibition.back_to_exhibitions')}</Link>
            <span>/</span>
            <span className="uppercase tracking-wider">{exhibition.region}</span>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-pill ${
              exhibition.status === 'upcoming' ? 'bg-charcoal text-ivory' : 'bg-soft-gray text-mocha-gray'
            }`}>
              {exhibition.status === 'upcoming' ? t('exhibitions.upcoming') : t('exhibitions.past')}
            </span>
            <span className="px-2.5 py-1 bg-soft-gray text-mocha-gray text-[10px] font-medium uppercase tracking-wider rounded-pill">
              {exhibition.region}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">{exhibition.title[lang]}</h1>

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-mocha-gray font-medium mb-2">{t('exhibition.date')}</p>
              <p className="text-base font-medium text-charcoal">{exhibition.dateRange}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-mocha-gray font-medium mb-2">{t('exhibition.location')}</p>
              <p className="text-base font-medium text-charcoal">{exhibition.location[lang]}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-mocha-gray font-medium mb-2">{t('exhibition.participating')}</p>
              <p className="text-base font-medium text-charcoal">{suppliers.length} {t('exhibition.suppliers_count')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-3xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-mocha-gray mb-4">{t('exhibition.about_this')}</h2>
          <div
            className="text-mocha-gray leading-relaxed text-lg font-light [&_b]:font-bold [&_p]:mb-4 [&_font[size='6']]:text-2xl [&_font[size='5']]:text-xl [&_font[size='4']]:text-base [&_font[size='2']]:text-sm"
            dangerouslySetInnerHTML={{ __html: exhibition.description[lang] || '' }}
          />
        </div>
      </div>

      {/* Participating Suppliers */}
      {suppliers.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">{t('exhibition.participating')}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map(supplier => (
                <Link
                  key={supplier.id}
                  href={`/suppliers/${supplier.id}`}
                  className="border border-border overflow-hidden hover:shadow-card transition-all group rounded-card"
                >
                  <div className="h-40 bg-soft-gray overflow-hidden">
                    <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-soft-gray text-mocha-gray text-[10px] font-medium uppercase tracking-wider rounded-pill">
                        {supplier.category}
                      </span>
                      {supplier.verified && (
                        <span className="px-2 py-0.5 bg-charcoal text-ivory text-[10px] font-medium uppercase tracking-wider rounded-pill">Verified</span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-charcoal mb-1 group-hover:text-[var(--color-theme-600)] transition-colors">
                      {supplier.name}
                    </h3>
                    <p className="text-xs text-mocha-gray">{supplier.location[lang]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related News */}
      {articles.length > 0 && (
        <section className="border-t border-border bg-ivory">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">{t('exhibition.related_news')}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map(article => (
                <Link key={article.id} href={`/news/${article.slug}`} className="bg-white border border-border overflow-hidden hover:shadow-card transition-all group rounded-card">
                  <div className="h-40 bg-soft-gray overflow-hidden">
                    <img src={article.image} alt={article.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-charcoal text-ivory text-[10px] font-medium uppercase tracking-wider rounded-pill">{article.category}</span>
                      <span className="text-xs text-mocha-gray">{formatDateShort(article.publishedAt)}</span>
                    </div>
                    <h3 className="font-bold text-sm text-charcoal group-hover:text-[var(--color-theme-600)] transition-colors line-clamp-2">{article.title[lang]}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h3 className="text-xl font-bold text-charcoal mb-3">{t('exhibition.interested')}</h3>
          <p className="text-mocha-gray text-sm mb-8 font-light max-w-lg mx-auto">
            {t('exhibition.connect_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact?type=exhibition"
              className="px-8 py-3 bg-charcoal text-ivory text-xs font-medium uppercase tracking-wider hover:bg-graphite transition-colors rounded-pill"
            >
              {t('exhibition.get_details')}
            </Link>
            <Link
              href="/sourcing"
              className="px-8 py-3 border border-border text-mocha-gray text-xs font-medium uppercase tracking-wider hover:bg-soft-gray transition-colors rounded-pill"
            >
              {t('exhibition.browse_suppliers')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
