import type { Metadata } from 'next'
import { Inter_Tight, Instrument_Sans, Noto_Sans_KR, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import LayoutShell from '@/components/LayoutShell'
import CookieConsent from '@/components/CookieConsent'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import '@/styles/globals.css'

const SITE = 'https://pickcos.vercel.app'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  style: ['normal', 'italic'],
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['400', '500', '600', '700'],
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-kr',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'PICKCOS — K-Beauty Sourcing Platform',
    template: '%s | PICKCOS',
  },
  description: 'Connect with verified Korean beauty manufacturers and suppliers. OEM, ODM, packaging, ingredients, and more.',
  keywords: 'K-Beauty, sourcing, supplier, OEM, ODM, Korean cosmetics, manufacturer',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'PICKCOS',
    title: 'PICKCOS — K-Beauty Sourcing Platform',
    description: 'Connect with verified Korean beauty manufacturers and suppliers.',
    url: SITE,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PICKCOS — K-Beauty Sourcing Platform',
    description: 'Connect with verified Korean beauty manufacturers and suppliers.',
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PICKCOS',
  url: SITE,
  description: 'B2B K-Beauty sourcing and matching platform connecting global buyers with verified Korean suppliers.',
  email: 'hello@pickcos.com',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${instrumentSans.variable} ${dancingScript.variable} ${notoSansKR.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <LanguageProvider>
          <LayoutShell>{children}</LayoutShell>
          <CookieConsent />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
