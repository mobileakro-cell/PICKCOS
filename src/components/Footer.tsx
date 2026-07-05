'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="w-full bg-surface text-[var(--foreground)] border-t border-[var(--color-border)]">
      <div className="mx-auto w-full max-w-[1248px] px-6 pt-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-16 items-start">
          {/* Left: Logo + Nav */}
          <div>
            <div className="text-[18px] font-extrabold tracking-[0.12em] mb-6">PICKCOS</div>
            <div className="flex flex-wrap gap-5">
              <Link href="/sourcing" className="text-[15px] font-medium tracking-[-0.01em] text-neutral-400 hover:text-[var(--foreground)] transition-colors">{t('footer.browse_suppliers')}</Link>
              <Link href="/exhibitions" className="text-[15px] font-medium tracking-[-0.01em] text-neutral-400 hover:text-[var(--foreground)] transition-colors">Exhibitions</Link>
              <Link href="/news" className="text-[15px] font-medium tracking-[-0.01em] text-neutral-400 hover:text-[var(--foreground)] transition-colors">News</Link>
              <Link href="/about" className="text-[15px] font-medium tracking-[-0.01em] text-neutral-400 hover:text-[var(--foreground)] transition-colors">About</Link>
            </div>
          </div>

          {/* Center: Divider */}
          <div className="hidden md:block w-[1px] h-full bg-neutral-100" />

          {/* Right: Contact */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[var(--color-sub-text)] mb-4">{t('footer.get_in_touch')}</p>
            <div className="text-[14px] leading-[1.65] text-neutral-400 space-y-1.5">
              <p><a href="mailto:hello@pickcos.com" className="hover:text-[var(--foreground)] transition-colors">hello@pickcos.com</a></p>
              <p><a href="tel:+82-2-1234-5678" className="hover:text-[var(--foreground)] transition-colors">+82-2-1234-5678</a></p>
              <p className="text-[var(--color-sub-text)] mt-3">Mon–Fri: 9AM–6PM KST</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-100 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-[12px] text-[var(--color-sub-text)] gap-4">
          <p>&copy; 2026 PICKCOS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">{t('footer.terms')}</Link>
            <Link href="/admin" className="hover:text-[var(--foreground)] transition-colors">{t('footer.admin')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
