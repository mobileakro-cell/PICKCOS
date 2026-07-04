'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => { setIsOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Transparent, white-on-image header only at the top of the home hero
  const overHero = isHome && !scrolled

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/')

  const navItems = [
    { href: '/sourcing', label: t('nav.suppliers') },
    { href: '/news', label: t('nav.news') },
    { href: '/exhibitions', label: t('nav.exhibitions') },
    { href: '/about', label: t('nav.about') },
    { href: '/register', label: t('nav.register') },
  ]

  const inkText = overHero ? 'text-white' : 'text-[var(--foreground)]'

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-[9999] transition-all duration-300 ${
          overHero
            ? 'bg-transparent'
            : 'bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--color-border)]'
        }`}
      >
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
          <div className="relative flex h-[64px] md:h-[88px] items-center justify-between">
            {/* Logo — left */}
            <Link
              href="/"
              className={`text-[24px] md:text-[27px] font-extrabold tracking-[0.06em] ${inkText}`}
            >
              <span className="logo-pic">PIC</span>
              <span className={overHero ? '' : 'logo-k'}>K</span>
              <span className="logo-cos">COS</span>
            </Link>

            {/* Desktop Nav — centered */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navItems.map(({ href, label }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative py-2 text-[13.5px] uppercase tracking-[0.05em] transition-colors duration-300 ${
                      overHero
                        ? active ? 'text-white font-semibold' : 'text-white/75 hover:text-white font-medium'
                        : active ? 'text-[var(--foreground)] font-semibold' : 'text-[var(--foreground)]/65 hover:text-[var(--foreground)] font-medium'
                    }`}
                  >
                    <span className="relative inline-block">
                      {label}
                      <span
                        className={`pointer-events-none absolute left-0 -bottom-0.5 h-[2px] w-full ${
                          active ? (overHero ? 'bg-white' : 'bg-[var(--color-theme-500)]') : 'bg-transparent'
                        }`}
                      />
                    </span>
                  </Link>
                )
              })}
            </nav>

            {/* Right — language */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setLang('en')}
                className={`text-[13px] tracking-wide transition-colors duration-300 ${
                  lang === 'en' ? `${inkText} font-bold` : overHero ? 'text-white/60 font-light' : 'text-[var(--foreground)]/50 font-light'
                }`}
              >
                EN
              </button>
              <span className={`mx-3 w-[1px] h-3 ${overHero ? 'bg-white/40' : 'bg-[var(--foreground)]/25'}`} />
              <button
                onClick={() => setLang('ko')}
                className={`text-[13px] tracking-wide transition-colors duration-300 ${
                  lang === 'ko' ? `${inkText} font-bold` : overHero ? 'text-white/60 font-light' : 'text-[var(--foreground)]/50 font-light'
                }`}
              >
                KR
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden flex items-center justify-center w-10 h-10 -mr-2 rounded-md relative z-[60] ${inkText}`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 z-[55] md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[82%] max-w-[320px] bg-[var(--background)] z-[56] md:hidden transform transition-transform duration-300 ease-out shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[var(--color-gray-text)]">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-md text-[var(--foreground)]" aria-label="Close menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col mt-6">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`px-6 py-4 text-[20px] tracking-[-0.01em] transition-all ${
                isActive(href) ? 'text-[var(--foreground)] font-medium' : 'text-[var(--color-sub-text)]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[var(--color-border)]">
          <Link
            href="/request-matching"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3.5 bg-[var(--color-theme-500)] text-white text-center text-[14px] font-semibold rounded-md hover:bg-[var(--color-theme-600)] transition-all"
          >
            {t('home.hero_matching')}
          </Link>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 text-[13px] rounded-md transition-all ${
                lang === 'en' ? 'text-[var(--foreground)] font-bold' : 'text-[var(--color-gray-text)]'
              }`}
            >
              English
            </button>
            <span className="w-[1px] h-3 bg-[var(--color-border)]" />
            <button
              onClick={() => setLang('ko')}
              className={`px-4 py-2 text-[13px] rounded-md transition-all ${
                lang === 'ko' ? 'text-[var(--foreground)] font-bold' : 'text-[var(--color-gray-text)]'
              }`}
            >
              한국어
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
