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
            <span className="text-4xl">🙏</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            {lang === 'ko' ? '신청이 마감되었습니다' : 'Registration Closed'}
          </h1>
          <p className="text-neutral-400 font-light mb-4 leading-relaxed">
            {lang === 'ko'
              ? '많은 분들의 관심에 진심으로 감사드립니다. 행사장 수용 인원이 한정되어 있어 더 이상 신규 신청을 받기 어려운 상황입니다.'
              : 'Thank you for your overwhelming interest. Due to limited venue capacity, we are unable to accept any further registrations at this time.'}
          </p>
          <p className="text-neutral-400 font-light mb-8 leading-relaxed">
            {lang === 'ko'
              ? '다음 행사에서 꼭 뵐 수 있기를 바랍니다. 궁금한 점이 있으시면 언제든지 이메일로 문의해 주세요.'
              : 'We hope to see you at our next event. If you have any questions, please feel free to reach out via email.'}
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
