'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company */}
          <div>
            <img src="/logo.svg" alt="PICKCOS" className="h-6 w-auto mb-6" />
            <p className="text-sm leading-relaxed text-gray-500">
              {t('footer.description')}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-gray-900 font-medium mb-6 text-xs uppercase tracking-[0.15em]">{t('footer.explore')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/sourcing" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.browse_suppliers')}</Link></li>
              <li><Link href="/exhibitions" className="text-gray-500 hover:text-gray-900 transition-colors">Exhibitions</Link></li>
              <li><Link href="/news" className="text-gray-500 hover:text-gray-900 transition-colors">News</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-gray-900 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h4 className="text-gray-900 font-medium mb-6 text-xs uppercase tracking-[0.15em]">{t('footer.for_buyers')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/request-matching" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.get_matched')}</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.contact_us')}</Link></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.faq')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 font-medium mb-6 text-xs uppercase tracking-[0.15em]">{t('footer.get_in_touch')}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:hello@pickcos.com" className="text-gray-500 hover:text-gray-900 transition-colors">hello@pickcos.com</a></li>
              <li><a href="tel:+82-2-1234-5678" className="text-gray-500 hover:text-gray-900 transition-colors">+82-2-1234-5678</a></li>
              <li className="pt-2">
                <p className="text-gray-400 text-xs">Mon-Fri: 9AM-6PM KST</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-6">
            <p>&copy; 2026 PICKCOS. All rights reserved.</p>
            <div className="flex gap-6 flex-wrap justify-center md:justify-end">
              <a href="#" className="hover:text-gray-900 transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-gray-900 transition-colors">{t('footer.terms')}</a>
              <Link href="/admin" className="hover:text-gray-900 transition-colors">{t('footer.admin')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
