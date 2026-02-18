'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface BL {
  ko: string
  en: string
}

interface BLArray {
  ko: string[]
  en: string[]
}

interface ContentBlock {
  type: string
  title: BL
  content?: BL
  items?: BLArray
}

interface Article {
  id: string
  slug: string
  title: BL
  summary: BL
  content: BL
  category: string
  region: string
  tags: BLArray
  publishedAt: string
  image: string
  author: string
  contentBlocks?: ContentBlock[]
  relatedSuppliers?: string[]
}

interface Supplier {
  id: string
  name: string
  category: string
  image: string
  location: BL
  description: BL
  supplierType: BL
  verified: boolean
  moqRange: string
  leadTimeRange: string
}

interface RelatedArticle {
  id: string
  slug: string
  title: BL
  category: string
  publishedAt: string
  image: string
}

function ContentBlockRenderer({ block, lang }: { block: ContentBlock; lang: 'ko' | 'en' }) {
  switch (block.type) {
    case 'why_matters':
      return (
        <div className="border-l-2 border-gray-300 pl-6 my-10">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Why This Matters</p>
          <h3 className="text-lg font-bold text-gray-900 mb-3">{block.title[lang]}</h3>
          <p className="text-gray-600 leading-relaxed">{block.content?.[lang]}</p>
        </div>
      )
    case 'sourcing_checklist':
      return (
        <div className="bg-gray-50 border border-gray-100 p-8 my-10">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Checklist</p>
          <h3 className="text-lg font-bold text-gray-900 mb-5">{block.title[lang]}</h3>
          <ul className="space-y-3">
            {block.items?.[lang]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 border border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs text-gray-400">{i + 1}</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'key_insight':
      return (
        <div className="bg-[#3d3d3d] text-white p-8 my-10">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Key Insight</p>
          <h3 className="text-lg font-bold mb-3">{block.title[lang]}</h3>
          <p className="text-gray-300 leading-relaxed">{block.content?.[lang]}</p>
        </div>
      )
    default:
      return null
  }
}

function formatDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateShort(d: string) {
  const date = new Date(d)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const { lang, t } = useLanguage()
  const [article, setArticle] = useState<Article | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${params.slug}`).then(r => r.json()),
      fetch(`/api/articles/${params.slug}/related-suppliers`).then(r => r.json()),
    ])
      .then(([articleData, suppliersData]) => {
        if (articleData.error) {
          notFound()
        }
        setArticle(articleData)
        setSuppliers(suppliersData.suppliers || [])

        // Fetch related articles by same category
        fetch(`/api/articles?category=${articleData.category}&pageSize=4`)
          .then(r => r.json())
          .then(data => {
            const related = (data.items || []).filter((a: any) => a.slug !== params.slug).slice(0, 3)
            setRelatedArticles(related)
          })

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-6 bg-gray-100 mb-4 w-1/4"></div>
          <div className="h-10 bg-gray-100 mb-4 w-3/4"></div>
          <div className="h-80 bg-gray-100 mb-8"></div>
          <div className="h-4 bg-gray-100 mb-2"></div>
          <div className="h-4 bg-gray-100 w-5/6"></div>
        </div>
      </div>
    )
  }

  if (!article) return notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <article className="max-w-3xl mx-auto px-6 pt-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/news" className="hover:text-gray-600 transition-colors uppercase tracking-wider">{t('nav.news')}</Link>
          <span>/</span>
          <span className="uppercase tracking-wider">{article.category}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5">
          <span className="px-2.5 py-1 bg-[#3d3d3d] text-white text-[10px] font-medium uppercase tracking-wider">
            {article.category}
          </span>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-medium uppercase tracking-wider">
            {article.region}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
          {article.title[lang]}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span className="font-medium text-gray-600">{article.author}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </article>

      {/* Featured Image - Full width within content area */}
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <div className="h-72 md:h-96 bg-gray-100 overflow-hidden">
          <img
            src={article.image}
            alt={article.title[lang]}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-6">
        {/* Summary */}
        <p className="text-lg text-gray-600 leading-relaxed mb-10 font-light">
          {article.summary[lang]}
        </p>

        {/* Content Blocks */}
        <div className="mb-16">
          {article.contentBlocks?.map((block, i) => (
            <ContentBlockRenderer key={i} block={block} lang={lang} />
          ))}
        </div>

        {/* Tags */}
        {article.tags[lang].length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16 pt-8 border-t border-gray-100">
            {article.tags[lang].map((tag, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related Suppliers */}
      {suppliers.length > 0 && (
        <section className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">{t('article.related_suppliers')}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map(supplier => (
                <Link
                  key={supplier.id}
                  href={`/suppliers/${supplier.id}`}
                  className="border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-2">
                      {supplier.category}
                    </span>
                    <h3 className="font-bold text-base text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                      {supplier.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">{supplier.location[lang]}</p>
                    <div className="flex gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <span>MOQ: {supplier.moqRange}</span>
                      <span>Lead: {supplier.leadTimeRange}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-gray-100 bg-[#f8f9fa]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">{t('article.more_in_category')} {article.category}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(a => (
                <Link key={a.id} href={`/news/${a.slug}`} className="bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img src={a.image} alt={a.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-[#3d3d3d] text-white text-[10px] font-medium uppercase tracking-wider">{a.category}</span>
                      <span className="text-xs text-gray-400">{formatDateShort(a.publishedAt)}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{a.title[lang]}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{t('article.looking_for_supplier')}</h3>
          <p className="text-gray-500 text-sm mb-8 font-light max-w-lg mx-auto">
            {t('article.get_matched_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/request-matching?topic=${article.slug}`}
              className="px-8 py-3 bg-[#3d3d3d] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#2d2d2d] transition-colors"
            >
              {t('home.request_matching')}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-gray-300 text-gray-600 text-xs font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
