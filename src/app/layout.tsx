import type { Metadata } from 'next'
import { Inter_Tight, Instrument_Sans, Noto_Sans_KR, Dancing_Script } from 'next/font/google'
import LayoutShell from '@/components/LayoutShell'
import CookieConsent from '@/components/CookieConsent'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import '@/styles/globals.css'

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
  title: 'PICKCOS - K-Beauty Sourcing Platform',
  description: 'Connect with verified Korean beauty manufacturers and suppliers. OEM, ODM, packaging, ingredients, and more.',
  keywords: 'K-Beauty, sourcing, supplier, OEM, Korean cosmetics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${instrumentSans.variable} ${dancingScript.variable} ${notoSansKR.variable} antialiased`}>
        <LanguageProvider>
          <LayoutShell>{children}</LayoutShell>
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  )
}
