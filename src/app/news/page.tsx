'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface BilingualText {
  ko: string
  en: string
}

interface BilingualTags {
  ko: string[]
  en: string[]
}

interface Article {
  id: string
  slug: string
  title: BilingualText
  summary: BilingualText
  category: string
  region: string
  publishedAt: string
  image: string
  author: string
  tags: BilingualTags
}

export default function NewsPage() {
  const { lang, t } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [loading, setLoading] = useState(true)

  const categories = ['MARKET', 'COMPANY', 'PEOPLE', 'INSIGHT', 'PROMO']

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') params.append('category', selectedCategory)
        if (selectedRegion !== 'all') params.append('region', selectedRegion)

        const response = await fetch(`/api/articles?${params}`)
        const data = await response.json()
        setArticles(data.items || [])
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [selectedCategory, selectedRegion])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="pt-20 pb-12" style={{ background: 'var(--background)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 text-center">
          <div className="page-title-reveal">
            <h1 className="text-[38px] font-bold tracking-[-0.02em] mb-3 text-[var(--foreground)]">{t('news.title')}</h1>
          </div>
          <p className="page-title-subtitle text-base text-neutral-400 font-light">
            {t('news.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-[1248px] mx-auto px-6 md:px-24 py-16">
        {/* Filters */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-[18px] font-semibold text-[var(--foreground)] mb-4 block">{t('news.category')}</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-md ${
                    selectedCategory === 'all'
                      ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                      : 'border border-[var(--color-border)] text-neutral-400 hover:border-[var(--color-hover-border)]'
                  }`}
                >
                  {t('news.all')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-md ${
                      selectedCategory === cat
                        ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                        : 'border border-[var(--color-border)] text-neutral-400 hover:border-[var(--color-hover-border)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[18px] font-semibold text-[var(--foreground)] mb-4 block">{t('news.region')}</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'Global', 'US', 'EU', 'Asia'].map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region === 'all' ? 'all' : region)}
                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all rounded-md ${
                      selectedRegion === region
                        ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                        : 'border border-[var(--color-border)] text-neutral-400 hover:border-[var(--color-hover-border)]'
                    }`}
                  >
                    {region === 'all' ? t('news.all') : region}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-neutral-50 mb-4"></div>
                <div className="h-4 bg-neutral-50 mb-2 w-1/3"></div>
                <div className="h-6 bg-neutral-50 mb-2"></div>
                <div className="h-4 bg-neutral-50"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{t('news.no_articles')}</h3>
            <p className="text-neutral-400 font-light">{t('news.adjust_filters')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="bg-surface border border-[var(--color-border)] hover:border-[var(--color-hover-border)] transition-all duration-300 overflow-hidden group rounded-[12px]"
              >
                <div className="h-48 bg-neutral-50 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-[var(--foreground)] text-[var(--background)] text-[10px] font-medium uppercase tracking-wider rounded-md">
                      {article.category}
                    </span>
                    <span className="px-2.5 py-1 bg-neutral-50 text-neutral-400 text-[10px] font-medium uppercase tracking-wider rounded-md">
                      {article.region}
                    </span>
                    <span className="text-xs text-neutral-400 ml-auto">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-[var(--foreground)] group-hover:text-[var(--color-theme-600)] transition-colors line-clamp-2">
                    {article.title[lang]}
                  </h3>
                  <p className="text-[var(--foreground)]/85 text-[15px] mb-4 line-clamp-2 leading-relaxed">
                    {article.summary[lang]}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                    <span className="text-xs text-neutral-400">{article.author}</span>
                    <span className="text-neutral-400 group-hover:text-neutral-400 transition-colors">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
