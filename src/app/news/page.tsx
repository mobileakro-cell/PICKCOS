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
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">{t('news.title')}</h1>
          <p className="text-base text-gray-500 font-light">
            {t('news.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Filters */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 block">{t('news.category')}</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-[#3d3d3d] text-white'
                      : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {t('news.all')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#3d3d3d] text-white'
                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 block">{t('news.region')}</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'Global', 'US', 'EU', 'Asia'].map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region === 'all' ? 'all' : region)}
                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                      selectedRegion === region
                        ? 'bg-[#3d3d3d] text-white'
                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
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
                <div className="h-48 bg-gray-100 mb-4"></div>
                <div className="h-4 bg-gray-100 mb-2 w-1/3"></div>
                <div className="h-6 bg-gray-100 mb-2"></div>
                <div className="h-4 bg-gray-100"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('news.no_articles')}</h3>
            <p className="text-gray-500 font-light">{t('news.adjust_filters')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-[#3d3d3d] text-white text-[10px] font-medium uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-medium uppercase tracking-wider">
                      {article.region}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {article.title[lang]}
                  </h3>
                  <p className="text-gray-500 text-sm font-light mb-4 line-clamp-2">
                    {article.summary[lang]}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{article.author}</span>
                    <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
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
