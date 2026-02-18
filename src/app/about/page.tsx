'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Ambassador {
  id: string
  name: string
  title: { ko: string; en: string }
  region: string
  bio: { ko: string; en: string }
  expertise: { ko: string[]; en: string[] }
  image: string
}

export default function AboutPage() {
  const { lang, t } = useLanguage()
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ambassadors')
      .then(r => r.json())
      .then(data => {
        setAmbassadors(data.ambassadors || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero Section */}
      <section className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">{t('about.title')}</h1>
          <p className="text-lg text-gray-500 font-light leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">{t('about.our_mission')}</p>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('about.mission_title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-4 font-light">
                {t('about.mission_p1')}
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                {t('about.mission_p2')}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">{t('about.our_vision')}</p>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('about.vision_title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-4 font-light">
                {t('about.vision_p1')}
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                {t('about.vision_p2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us - Numbers */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">{t('about.why_pickcos')}</p>
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">{t('about.what_sets_apart')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 border border-gray-100 text-center">
              <div className="text-5xl font-bold text-gray-900 mb-4">{t('about.verified_100')}</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">{t('about.verified_title')}</h3>
              <p className="text-gray-500 font-light">
                {t('about.verified_desc')}
              </p>
            </div>
            <div className="bg-white p-10 border border-gray-100 text-center">
              <div className="text-5xl font-bold text-gray-900 mb-4">{t('about.matching_ratio')}</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">{t('about.matching_title')}</h3>
              <p className="text-gray-500 font-light">
                {t('about.matching_desc')}
              </p>
            </div>
            <div className="bg-white p-10 border border-gray-100 text-center">
              <div className="text-5xl font-bold text-gray-900 mb-4">{t('about.experience_years')}</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">{t('about.experience_title')}</h3>
              <p className="text-gray-500 font-light">
                {t('about.experience_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curation Process */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">{t('about.our_process')}</p>
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">{t('about.supplier_curation')}</h2>
          <div className="space-y-12">
            <div className="flex gap-8 items-start">
              <div className="w-12 h-12 bg-[#3d3d3d] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
                01
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{t('about.step1_title')}</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  {t('about.step1_desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-8 items-start">
              <div className="w-12 h-12 bg-[#3d3d3d] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
                02
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{t('about.step2_title')}</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  {t('about.step2_desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-8 items-start">
              <div className="w-12 h-12 bg-[#3d3d3d] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
                03
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{t('about.step3_title')}</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  {t('about.step3_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ambassadors */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">{t('about.our_team')}</p>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">{t('about.meet_ambassadors')}</h2>
          <p className="text-center text-gray-500 font-light mb-16 max-w-2xl mx-auto">
            {t('about.ambassadors_desc')}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 animate-pulse border border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-100 mb-2"></div>
                  <div className="h-4 bg-gray-100"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ambassadors.map(ambassador => (
                <div key={ambassador.id} className="bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={ambassador.image}
                      alt={ambassador.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-1 text-gray-900">{ambassador.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 font-light">{ambassador.title[lang]}</p>
                    <p className="text-[10px] text-gray-500 mb-3 bg-gray-100 px-2.5 py-1 inline-block uppercase tracking-wider font-medium">
                      {ambassador.region}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 font-light line-clamp-3">
                      {ambassador.bio[lang]}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {ambassador.expertise[lang].slice(0, 2).map((exp, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-medium uppercase tracking-wider">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">{t('about.our_values')}</p>
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">{t('about.core_principles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('about.transparency')}</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                {t('about.transparency_desc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('about.trust')}</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                {t('about.trust_desc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('about.quality')}</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                {t('about.quality_desc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('about.partnership')}</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                {t('about.partnership_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#3d3d3d]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mb-2">{t('about.get_started')}</p>
              <h2 className="text-xl font-bold text-white">{t('about.ready_start')}</h2>
            </div>
            <div className="flex gap-3">
              <Link
                href="/request-matching"
                className="px-6 py-3 bg-white text-gray-900 text-xs font-medium uppercase tracking-wider hover:bg-gray-100 transition-colors"
              >
                {t('about.request_matching')}
              </Link>
              <Link
                href="/sourcing"
                className="px-6 py-3 border border-gray-600 text-gray-300 text-xs font-medium uppercase tracking-wider hover:bg-[#2d2d2d] hover:text-white transition-colors"
              >
                {t('about.browse_suppliers')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
