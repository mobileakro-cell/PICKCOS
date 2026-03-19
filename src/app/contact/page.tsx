'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export const dynamic = 'force-dynamic'

export default function ContactPage() {
  const { lang } = useLanguage()

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-6 md:px-24">
        <div className="bg-surface rounded-[12px] border border-[var(--color-border)] p-12 text-center">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">✕</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            {lang === 'ko' ? '신청이 마감되었습니다' : 'Registration Closed'}
          </h1>
          <p className="text-neutral-400 font-light mb-4 leading-relaxed">
            {lang === 'ko'
              ? 'K-Beauty Global Conference 2026의 신청 접수가 마감되었습니다.'
              : 'Registration for K-Beauty Global Conference 2026 has been closed.'}
          </p>
          <p className="text-neutral-400 font-light mb-8 leading-relaxed">
            {lang === 'ko'
              ? '관심을 가져주셔서 감사합니다. 문의사항이 있으시면 이메일로 연락해 주세요.'
              : 'Thank you for your interest. If you have any questions, please contact us via email.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-md hover:bg-neutral-700 transition-all"
            >
              {lang === 'ko' ? '홈으로 돌아가기' : 'Back to Home'}
            </Link>
            <Link
              href="/news"
              className="px-8 py-4 border border-[var(--color-border)] text-[var(--foreground)] font-medium rounded-md hover:bg-neutral-50 transition-all"
            >
              {lang === 'ko' ? '뉴스 보기' : 'View News'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
