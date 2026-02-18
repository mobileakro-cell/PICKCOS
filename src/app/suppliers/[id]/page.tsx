'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface BilingualText {
  ko: string
  en: string
}

interface BilingualArray {
  ko: string[]
  en: string[]
}

interface SupplierFile {
  id: string
  name: string
  size: string
  type: 'public' | 'members'
}

interface Exhibition {
  id: string
  title: BilingualText
  location: BilingualText
  description: BilingualText
  dateRange: string
  status: string
}

interface Supplier {
  id: string
  name: string
  image: string
  category: string
  supplierType: BilingualText
  location: BilingualText
  country: string
  description: BilingualText
  descriptionFull: BilingualText
  coreStrengths: BilingualArray
  capabilities: BilingualArray
  regulatoryNotes: BilingualText
  certifications: string[]
  exportMarkets: string[]
  moqRange: string
  leadTimeRange: string
  verified: boolean
  ambassadorPick: boolean
  contact: string
  website: string
  files: SupplierFile[]
}

export default function SupplierDetailPage({ params }: { params: { id: string } }) {
  const { lang, t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const TABS = [
    { id: 'overview', label: t('supplier.overview') },
    { id: 'capabilities', label: t('supplier.capabilities') },
    { id: 'certifications', label: t('supplier.certifications') },
    { id: 'export', label: t('supplier.export_markets') },
    { id: 'exhibitions', label: t('supplier.exhibitions') },
    { id: 'files', label: t('supplier.documents') },
  ]

  useEffect(() => {
    Promise.all([
      fetch(`/api/suppliers/${params.id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/suppliers/${params.id}/exhibitions`).then(r => r.ok ? r.json() : [])
    ])
      .then(([sup, exh]) => {
        if (!sup) {
          setError(true)
        } else {
          setSupplier(sup)
          setExhibitions(exh)
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
        <div className="max-w-6xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-72 bg-gray-100 mb-8"></div>
          <div className="h-8 bg-gray-100 mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-100 w-1/3"></div>
        </div>
      </div>
    )
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('supplier.not_found')}</h1>
          <p className="text-gray-500 mb-8 font-light">{t('supplier.not_found_desc')}</p>
          <Link href="/sourcing" className="px-8 py-3 bg-[#3d3d3d] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#2d2d2d] transition-colors">
            {t('supplier.back_to_suppliers')}
          </Link>
        </div>
      </div>
    )
  }

  const coreStrengths = supplier.coreStrengths?.[lang] || []
  const capabilities = supplier.capabilities?.[lang] || []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="h-72 md:h-96 bg-gray-100 overflow-hidden">
        <img
          src={supplier.image}
          alt={supplier.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Supplier Header */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="py-10 border-b border-gray-100">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link href="/sourcing" className="hover:text-gray-600 transition-colors uppercase tracking-wider">{t('nav.suppliers')}</Link>
            <span>/</span>
            <span className="uppercase tracking-wider">{supplier.category}</span>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-medium uppercase tracking-wider">
              {supplier.category}
            </span>
            {supplier.verified && (
              <span className="px-2.5 py-1 bg-[#3d3d3d] text-white text-[10px] font-medium uppercase tracking-wider">{t('sourcing.verified')}</span>
            )}
            {supplier.ambassadorPick && (
              <span className="px-2.5 py-1 bg-[#3d3d3d] text-white text-[10px] font-medium uppercase tracking-wider">{t('supplier.ambassador_pick')}</span>
            )}
          </div>

          {/* Name & Type */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{supplier.name}</h1>
          <p className="text-gray-500 font-light mb-1">{supplier.supplierType[lang]}</p>
          <p className="text-sm text-gray-400">{supplier.location[lang]}, {supplier.country}</p>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">{t('supplier.moq')}</p>
              <p className="text-lg font-bold text-gray-900">{supplier.moqRange || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">{t('supplier.lead_time')}</p>
              <p className="text-lg font-bold text-gray-900">{supplier.leadTimeRange || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">{t('supplier.export_markets')}</p>
              <p className="text-lg font-bold text-gray-900">{supplier.exportMarkets?.length || 0} markets</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">{t('supplier.certifications')}</p>
              <p className="text-lg font-bold text-gray-900">{supplier.certifications?.length || 0} certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#3d3d3d] text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">{t('supplier.about')}</h3>
              <p className="text-gray-600 leading-relaxed mb-10">
                {supplier.descriptionFull?.[lang] || supplier.description[lang]}
              </p>

              {coreStrengths.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">{t('supplier.core_strengths')}</h3>
                  <div className="space-y-3">
                    {coreStrengths.map((s: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="w-5 h-5 bg-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-500 font-medium mt-0.5">{i + 1}</span>
                        <span className="text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Quick Contact */}
            <div className="lg:border-l lg:border-gray-100 lg:pl-12">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">{t('supplier.contact_section')}</h3>
              <div className="space-y-4 mb-8">
                {supplier.contact && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Email</p>
                    <a href={`mailto:${supplier.contact}`} className="text-sm text-gray-700 hover:text-gray-900 transition-colors break-all">{supplier.contact}</a>
                  </div>
                )}
                {supplier.website && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Website</p>
                    <a href={supplier.website} target="_blank" rel="noopener" className="text-sm text-gray-700 hover:text-gray-900 transition-colors break-all">{supplier.website}</a>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <Link
                  href={`/contact?type=sourcing&supplierId=${supplier.id}`}
                  className="block w-full py-3 bg-[#3d3d3d] text-white text-center text-xs uppercase tracking-wider font-medium hover:bg-[#2d2d2d] transition-colors"
                >
                  {t('supplier.send_inquiry')}
                </Link>
                <Link
                  href={`/request-matching?supplierId=${supplier.id}`}
                  className="block w-full py-3 border border-gray-300 text-gray-600 text-center text-xs uppercase tracking-wider font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('supplier.request_matching')}
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">{t('supplier.capabilities')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.map((c: string, i: number) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-5">
                  <p className="font-medium text-gray-900 text-sm">{c}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">{t('supplier.certifications')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supplier.certifications?.map((c: string, i: number) => (
                  <div key={i} className="border border-gray-100 p-5 flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium flex-shrink-0">&#10003;</span>
                    <span className="font-medium text-gray-900 text-sm">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            {supplier.regulatoryNotes?.[lang] && (
              <div className="border-l-2 border-gray-300 pl-6">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">{t('supplier.regulatory_notes')}</p>
                <p className="text-gray-600 leading-relaxed">{supplier.regulatoryNotes[lang]}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'export' && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">{t('supplier.export_markets')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {supplier.exportMarkets?.map((m: string, i: number) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-4 text-center">
                  <p className="font-medium text-gray-900 text-sm">{m}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exhibitions' && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">{t('supplier.exhibition_history')}</h3>
            {exhibitions?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exhibitions.map((ex: Exhibition) => (
                  <Link
                    key={ex.id}
                    href={`/exhibitions/${ex.id}`}
                    className="border border-gray-100 p-5 hover:shadow-lg transition-all group"
                  >
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider mb-3 ${
                      ex.status === 'upcoming' ? 'bg-[#3d3d3d] text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {ex.status}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">{ex.title[lang]}</h4>
                    <p className="text-xs text-gray-400 mb-1">{ex.dateRange}</p>
                    <p className="text-xs text-gray-400">{ex.location[lang]}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm font-light">{t('supplier.no_exhibitions')}</p>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">{t('supplier.docs_resources')}</h3>
            <div className="space-y-3">
              {supplier.files?.length > 0 ? supplier.files.map((f: SupplierFile) => (
                <div key={f.id} className="flex items-center justify-between border border-gray-100 p-5 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{f.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{f.size}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                    f.type === 'public' ? 'bg-gray-100 text-gray-500' : 'bg-[#3d3d3d] text-white'
                  }`}>
                    {f.type === 'public' ? 'Public' : 'Members'}
                  </span>
                </div>
              )) : (
                <p className="text-gray-400 text-sm font-light">{t('supplier.no_documents')}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Interested in {supplier.name}?</h3>
          <p className="text-gray-500 text-sm mb-8 font-light">
            {t('supplier.send_direct')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/contact?type=sourcing&supplierId=${supplier.id}`}
              className="px-8 py-3 bg-[#3d3d3d] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#2d2d2d] transition-colors"
            >
              {t('supplier.send_inquiry')}
            </Link>
            <Link
              href={`/request-matching?supplierId=${supplier.id}`}
              className="px-8 py-3 border border-gray-300 text-gray-600 text-xs font-medium uppercase tracking-wider hover:bg-white transition-colors"
            >
              {t('supplier.request_matching')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
