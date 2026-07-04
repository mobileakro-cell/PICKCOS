'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isHome = pathname === '/'

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {/* Home hero sits full-bleed under the floating header; inner pages keep header offset */}
      <main className={`min-h-screen ${isHome ? '' : 'pt-[64px] md:pt-[88px]'}`}>{children}</main>
      <Footer />
    </>
  )
}
