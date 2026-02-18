'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/')
      ? 'text-[#3d3d3d] font-semibold border-b-2 border-[#3d3d3d] pb-1'
      : 'text-gray-500 hover:text-black transition-colors pb-1'

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top Bar - Language */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-end items-center gap-2">
          <button
            onClick={() => setLang('ko')}
            className={`px-2.5 py-1 text-xs tracking-wider transition-colors ${
              lang === 'ko'
                ? 'text-black font-semibold'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            KR
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 text-xs tracking-wider transition-colors ${
              lang === 'en'
                ? 'text-black font-semibold'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main Header - Logo Left / Nav Center / Button Right */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/logo.svg" alt="PICKCOS" className="h-6 md:h-7 w-auto" />
          </Link>

          {/* Desktop Nav - Center */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/news" className={`${isActive('/news')} text-xs uppercase tracking-[0.15em]`}>
              {t('nav.news')}
            </Link>
            <Link href="/exhibitions" className={`${isActive('/exhibitions')} text-xs uppercase tracking-[0.15em]`}>
              {t('nav.exhibitions')}
            </Link>
            <Link href="/sourcing" className={`${isActive('/sourcing')} text-xs uppercase tracking-[0.15em]`}>
              {t('nav.suppliers')}
            </Link>
            <Link href="/about" className={`${isActive('/about')} text-xs uppercase tracking-[0.15em]`}>
              {t('nav.about')}
            </Link>
          </nav>

          {/* CTA Button - Right (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-[#3d3d3d] text-white text-xs uppercase tracking-[0.12em] font-medium hover:bg-[#2d2d2d] transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className={`w-6 h-0.5 bg-gray-800 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-gray-800 transition-all ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-gray-800 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
              <Link href="/news" className="py-2 text-gray-600 hover:text-black text-xs uppercase tracking-[0.15em]">
                {t('nav.news')}
              </Link>
              <Link href="/exhibitions" className="py-2 text-gray-600 hover:text-black text-xs uppercase tracking-[0.15em]">
                {t('nav.exhibitions')}
              </Link>
              <Link href="/sourcing" className="py-2 text-gray-600 hover:text-black text-xs uppercase tracking-[0.15em]">
                {t('nav.suppliers')}
              </Link>
              <Link href="/about" className="py-2 text-gray-600 hover:text-black text-xs uppercase tracking-[0.15em]">
                {t('nav.about')}
              </Link>
              <div className="pt-3 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="block px-4 py-3 bg-[#3d3d3d] text-white text-center text-xs uppercase tracking-[0.12em] font-medium hover:bg-[#2d2d2d] transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
