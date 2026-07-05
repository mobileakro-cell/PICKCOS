'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const isAdmin = pathname.startsWith('/admin')
  const isHome = pathname === '/'

  // 접근성: 현재 언어를 <html lang>에 반영 (스크린리더 발음)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {/* Home hero sits full-bleed under the floating header; inner pages keep header offset */}
      <main id="main-content" className={`min-h-screen ${isHome ? '' : 'pt-[64px] md:pt-[88px]'}`}>{children}</main>
      <Footer />
    </>
  )
}
