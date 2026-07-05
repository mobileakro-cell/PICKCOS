'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { formatMoq, formatLeadTime } from '@/lib/options'

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
        <div className="border-l-2 border-border pl-6 my-10">
          <p className="text-[10px] uppercase tracking-widest text-mocha-gray font-medium mb-3">Why This Matters</p>
          <h3 className="text-lg font-bold text-charcoal mb-3">{block.title[lang]}</h3>
          <p className="text-mocha-gray leading-relaxed">{block.content?.[lang]}</p>
        </div>
      )
    case 'sourcing_checklist':
      return (
        <div className="bg-soft-gray border border-border p-8 my-10 rounded-card">
          <p className="text-[10px] uppercase tracking-widest text-mocha-gray font-medium mb-3">Checklist</p>
          <h3 className="text-lg font-bold text-charcoal mb-5">{block.title[lang]}</h3>
          <ul className="space-y-3">
            {block.items?.[lang]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 border border-border flex-shrink-0 mt-0.5 flex items-center justify-center text-xs text-mocha-gray">{i + 1}</span>
                <span className="text-charcoal">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'key_insight':
      return (
        <div className="bg-charcoal text-ivory p-8 my-10 rounded-card">
          <p className="text-[10px] uppercase tracking-widest text-mocha-gray font-medium mb-3">Key Insight</p>
          <h3 className="text-lg font-bold mb-3">{block.title[lang]}</h3>
          <p className="text-sand-beige/80 leading-relaxed">{block.content?.[lang]}</p>
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
          <div className="h-6 bg-soft-gray mb-4 w-1/4"></div>
          <div className="h-10 bg-soft-gray mb-4 w-3/4"></div>
          <div className="h-80 bg-soft-gray mb-8"></div>
          <div className="h-4 bg-soft-gray mb-2"></div>
          <div className="h-4 bg-soft-gray w-5/6"></div>
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
        <div className="flex items-center gap-2 text-xs text-mocha-gray mb-8">
          <Link href="/news" className="hover:text-mocha-gray transition-colors uppercase tracking-wider">{t('nav.news')}</Link>
          <span>/</span>
          <span className="uppercase tracking-wider">{article.category}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5">
          <span className="px-2.5 py-1 bg-charcoal text-ivory text-[10px] font-medium uppercase tracking-wider rounded-pill">
            {article.category}
          </span>
          <span className="px-2.5 py-1 bg-soft-gray text-mocha-gray text-[10px] font-medium uppercase tracking-wider rounded-pill">
            {article.region}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-charcoal leading-tight mb-5">
          {article.title[lang]}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-4 text-sm text-mocha-gray mb-8 pb-8 border-b border-border">
          <span className="font-medium text-mocha-gray">{article.author}</span>
          <span className="w-1 h-1 bg-border rounded-full"></span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </article>

      {/* Featured Image - Full width within content area */}
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <div className="h-72 md:h-96 bg-soft-gray overflow-hidden rounded-card">
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
        <p className="text-lg text-charcoal/85 leading-[1.9] mb-10">
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
          <div className="flex flex-wrap gap-2 mb-16 pt-8 border-t border-border">
            {article.tags[lang].map((tag, i) => (
              <span key={i} className="px-3 py-1.5 bg-soft-gray text-mocha-gray text-xs font-medium rounded-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related Suppliers */}
      {suppliers.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">{t('article.related_suppliers')}</h2>
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
                    <span className="inline-block px-2.5 py-1 bg-soft-gray text-mocha-gray text-[10px] font-medium uppercase tracking-wider mb-2 rounded-pill">
                      {supplier.category}
                    </span>
                    <h3 className="font-bold text-base text-charcoal mb-1 group-hover:text-[var(--color-theme-600)] transition-colors">
                      {supplier.name}
                    </h3>
                    <p className="text-xs text-mocha-gray mb-2">{supplier.location[lang]}</p>
                    <div className="flex gap-4 text-xs text-mocha-gray pt-3 border-t border-border">
                      <span>MOQ: {formatMoq(supplier.moqRange, lang)}</span>
                      <span>Lead: {formatLeadTime(supplier.leadTimeRange, lang)}</span>
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
        <section className="border-t border-border bg-ivory">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">{t('article.more_in_category')} {article.category}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(a => (
                <Link key={a.id} href={`/news/${a.slug}`} className="bg-white border border-border overflow-hidden hover:shadow-card transition-all group rounded-card">
                  <div className="h-40 bg-soft-gray overflow-hidden">
                    <img src={a.image} alt={a.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-charcoal text-ivory text-[10px] font-medium uppercase tracking-wider rounded-pill">{a.category}</span>
                      <span className="text-xs text-mocha-gray">{formatDateShort(a.publishedAt)}</span>
                    </div>
                    <h3 className="font-bold text-sm text-charcoal group-hover:text-[var(--color-theme-600)] transition-colors line-clamp-2">{a.title[lang]}</h3>
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
          <h3 className="text-xl font-bold text-charcoal mb-3">{t('article.looking_for_supplier')}</h3>
          <p className="text-mocha-gray text-sm mb-8 font-light max-w-lg mx-auto">
            {t('article.get_matched_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/request-matching?topic=${article.slug}`}
              className="px-8 py-3 bg-charcoal text-ivory text-xs font-medium uppercase tracking-wider hover:bg-graphite transition-colors rounded-pill"
            >
              {t('home.request_matching')}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-border text-mocha-gray text-xs font-medium uppercase tracking-wider hover:bg-soft-gray transition-colors rounded-pill"
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
