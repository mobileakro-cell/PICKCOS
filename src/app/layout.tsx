import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import LayoutShell from '@/components/LayoutShell'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import '@/styles/globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300', '400', '500', '600', '700'] })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], variable: '--font-dm-serif', weight: ['400'] })

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
      <body className={`${dmSans.className} ${dmSans.variable} ${dmSerif.variable} bg-white text-gray-900`}>
        <LanguageProvider>
          <LayoutShell>{children}</LayoutShell>
        </LanguageProvider>
      </body>
    </html>
  )
}
