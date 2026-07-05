'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

/* Character stagger: characters rise sequentially on initial appearance */
function CharStagger({
  text,
  baseDelay,
  stagger = 0.025,
  duration = 0.8,
  disabled = false,
}: {
  text: string
  baseDelay: number
  stagger?: number
  duration?: number
  disabled?: boolean
  charOffset?: number
}) {
  if (disabled) return <>{text}</>
  return (
    <>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '120%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            duration,
            delay: baseDelay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={char === ' ' ? { width: '0.27em' } : undefined}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </>
  )
}

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
  const noMotion = useReducedMotion()
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ambassadors')
      .then((r) => r.json())
      .then((data) => {
        setAmbassadors(data.ambassadors || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const dis = !!noMotion

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'var(--background)' }}>
        <div className="relative mx-auto max-w-[1080px] pt-[120px] pb-[28px] px-6 md:px-12">
          <div className="relative flex flex-col items-center text-center leading-[1.3] tracking-[-0.015em]">
            {/* Line 1 */}
            <span className="text-[clamp(22px,3.2vw,42px)] block font-semibold text-[var(--foreground)] overflow-hidden pb-[4px] whitespace-nowrap">
              <CharStagger text="We Connect Global Buyers" baseDelay={0.2} disabled={dis} charOffset={0} />
            </span>
            {/* Line 2 */}
            <span className="text-[clamp(22px,3.2vw,42px)] block font-semibold text-[#6b6560] overflow-hidden pb-[4px] whitespace-nowrap">
              <CharStagger text="with Verified" baseDelay={0.5} disabled={dis} charOffset={25} />
            </span>
            {/* Line 3 */}
            <span className="text-[clamp(22px,3.2vw,42px)] inline-flex items-center font-semibold text-[var(--foreground)] overflow-hidden pb-[4px] whitespace-nowrap">
              <span className="inline-block overflow-hidden">
                <CharStagger text="K-Beauty Suppliers" baseDelay={0.75} stagger={0.03} disabled={dis} charOffset={38} />
              </span>
              <motion.span
                className="inline-block ml-[0.3em] text-[var(--color-theme-500)]"
                initial={dis ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <svg
                  viewBox="0 0 50 50"
                  fill="none"
                  className="w-[0.65em] h-[0.65em]"
                  style={{ verticalAlign: 'middle' }}
                >
                  <line x1="25" y1="5" x2="25" y2="45" stroke="currentColor" strokeWidth="8" strokeLinecap="butt" />
                  <line x1="7.7" y1="15" x2="42.3" y2="35" stroke="currentColor" strokeWidth="8" strokeLinecap="butt" />
                  <line x1="42.3" y1="15" x2="7.7" y2="35" stroke="currentColor" strokeWidth="8" strokeLinecap="butt" />
                </svg>
              </motion.span>
            </span>
          </div>
          <motion.div
            initial={dis ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="text-[15px] text-[#6b6560] tracking-wide">with</span>
              <span className="text-[28px] italic text-[var(--color-theme-600)]" style={{ fontFamily: 'var(--font-dancing-script), cursive' }}>Pickcos</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Mid Section */}
      <section className="relative w-full" style={{ background: 'var(--background)' }}>
        <div className="relative h-[400px] w-full max-w-[1080px] mx-auto overflow-hidden">
          <motion.div
            initial={dis ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="absolute inset-0"
            style={{ backgroundImage: 'url(/images/about-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) contrast(1.1)' }}
          />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full items-center justify-center">
            <p className="text-center text-[40px] font-semibold leading-[1.15] text-white italic drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">Bridging K-Beauty to the World</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pt-12 pb-20" style={{ background: 'var(--color-surface, #1E1E1E)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-gray-text)] mb-4">{t('about.our_mission')}</p>
              <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">{t('about.mission_title')}</h2>
              <p className="text-neutral-400 leading-relaxed mb-4 font-light">{t('about.mission_p1')}</p>
              <p className="text-neutral-400 leading-relaxed font-light">{t('about.mission_p2')}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-gray-text)] mb-4">{t('about.our_vision')}</p>
              <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">{t('about.vision_title')}</h2>
              <p className="text-neutral-400 leading-relaxed mb-4 font-light">{t('about.vision_p1')}</p>
              <p className="text-neutral-400 leading-relaxed font-light">{t('about.vision_p2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-gray-text)] text-center mb-4">{t('about.why_pickcos')}</p>
          <h2 className="text-3xl font-light text-center mb-16 text-[var(--foreground)]">{t('about.what_sets_apart')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['verified', 'matching', 'experience'] as const).map((key) => (
              <div key={key} className="border border-[var(--color-border)] rounded-[12px] p-8 text-center" style={{ background: 'var(--color-surface, #1E1E1E)' }}>
                <div className="text-theme-400 text-4xl font-bold mb-4">{t(`about.${key === 'verified' ? 'verified_100' : key === 'matching' ? 'matching_ratio' : 'experience_years'}`)}</div>
                <h3 className="text-base font-semibold mb-2 text-[var(--foreground)]">{t(`about.${key}_title`)}</h3>
                <p className="text-sm text-neutral-400 font-light">{t(`about.${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curation Process */}
      <section className="py-20" style={{ background: 'var(--color-surface, #1E1E1E)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-gray-text)] text-center mb-4">{t('about.our_process')}</p>
          <h2 className="text-3xl font-light text-center mb-16 text-[var(--foreground)]">{t('about.supplier_curation')}</h2>
          <div className="flow-wrap">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flow-step">
                <div className="flow-num-col">
                  <div className="bg-theme-400 text-white rounded-[8px] w-10 h-10 flex items-center justify-center font-bold">{String.fromCharCode(0x2460 + n - 1)}</div>
                  <div className="flow-line" style={n === 3 ? { background: 'transparent' } : undefined} />
                </div>
                <div className="flow-content">
                  <div className="flow-title">{t(`about.step${n}_title`)}</div>
                  <div className="flow-desc">{t(`about.step${n}_desc`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ambassadors */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-gray-text)] text-center mb-4">{t('about.our_team')}</p>
          <h2 className="text-3xl font-bold text-center mb-6 text-[var(--foreground)]">{t('about.meet_ambassadors')}</h2>
          <p className="text-center text-neutral-400 font-light mb-16 max-w-2xl mx-auto">{t('about.ambassadors_desc')}</p>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-28 h-28 rounded-full bg-neutral-50 mx-auto mb-5" />
                  <div className="h-5 bg-neutral-50 mb-2 w-2/3 mx-auto rounded" />
                  <div className="h-4 bg-neutral-50 w-1/2 mx-auto rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {ambassadors.map((a) => (
                <div key={a.id} className="text-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-5">
                    <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-[var(--foreground)]">{a.name}</h3>
                  <p className="text-sm text-neutral-400 mb-2 font-light">{a.title[lang]}</p>
                  <p className="text-[10px] text-neutral-400 mb-3 uppercase tracking-wider font-medium">{a.region}</p>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4 font-light line-clamp-3">{a.bio[lang]}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {a.expertise[lang].slice(0, 2).map((exp, i) => (
                      <span key={i} className="px-2.5 py-1 bg-neutral-50 text-neutral-400 text-[10px] font-medium uppercase tracking-wider rounded-full">{exp}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: 'var(--color-surface, #1E1E1E)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-gray-text)] text-center mb-4">{t('about.our_values')}</p>
          <h2 className="text-3xl font-bold text-center mb-16 text-[var(--foreground)]">{t('about.core_principles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {['transparency', 'trust', 'quality', 'partnership'].map((v) => (
              <div key={v}>
                <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">{t(`about.${v}`)}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t(`about.${v}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 협업 · 제휴 · 문의 (Contact을 별도 메뉴 대신 About에 통합) */}
      <section id="contact" className="py-20 scroll-mt-24" style={{ background: 'var(--background)' }}>
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-gray-text)] mb-4">
            {lang === 'ko' ? '협업 · 제휴 · 문의' : 'Partnership & Inquiries'}
          </p>
          <h2 className="text-3xl font-light mb-6 text-[var(--foreground)]">
            {lang === 'ko' ? '함께 하고 싶으신가요?' : "Let's work together"}
          </h2>
          <p className="text-neutral-400 font-light leading-relaxed mb-8">
            {lang === 'ko'
              ? '파트너십·제휴·미디어·일반 문의를 환영합니다. (제품 소싱 요청은 매칭 신청을 이용해 주세요.)'
              : 'We welcome partnership, collaboration, media, and general inquiries. (For product sourcing, please use Request Matching.)'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="px-8 py-3 text-xs font-medium uppercase tracking-wider rounded-md hover:opacity-90 transition-opacity"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              {lang === 'ko' ? '문의하기' : 'Get in Touch'}
            </Link>
            <a href="mailto:hello@pickcos.com" className="text-[14px] text-neutral-400 hover:text-[var(--foreground)] transition-colors">
              hello@pickcos.com
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--foreground)' }}>
        <div className="max-w-[1248px] mx-auto px-6 md:px-24 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-200 mb-2">{t('about.get_started')}</p>
              <h2 className="text-xl font-bold" style={{ color: 'var(--background)' }}>{t('about.ready_start')}</h2>
            </div>
            <div className="flex gap-3">
              <Link href="/request-matching" className="px-6 py-3 text-xs font-medium uppercase tracking-wider rounded-md hover:bg-neutral-50 transition-colors" style={{ background: 'var(--color-surface, #1E1E1E)', color: 'var(--foreground)' }}>
                {t('about.request_matching')}
              </Link>
              <Link href="/sourcing" className="px-6 py-3 border border-[#C8C8C8]/40 text-[#C8C8C8]/80 text-xs font-medium uppercase tracking-wider rounded-md hover:bg-neutral-700 transition-colors">
                {t('about.browse_suppliers')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
