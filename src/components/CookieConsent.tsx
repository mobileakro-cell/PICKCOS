'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const KEY = 'pickcos_cookie_consent'

// 쿠키/개인정보 고지 배너. CCPA 옵트아웃 안내 포함.
// 현재는 비필수 쿠키(분석 등) 미사용 → 고지 + 동의 기록 위주. 분석 도입 시 이 게이트로 로딩을 제어.
export default function CookieConsent() {
  const { lang } = useLanguage()
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true)
    } catch { /* ignore */ }
  }, [])

  const decide = (choice: 'all' | 'essential') => {
    try { localStorage.setItem(KEY, JSON.stringify({ choice, ts: new Date().toISOString() })) } catch { /* ignore */ }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-[13px] leading-relaxed text-neutral-400">
          {lang === 'ko'
            ? '이 사이트는 서비스 제공을 위해 필수 쿠키를 사용하며, 개선을 위해 비필수 쿠키를 사용할 수 있습니다. '
            : 'We use essential cookies to run the service and may use non-essential cookies to improve it. '}
          <Link href="/privacy" className="underline hover:text-[var(--foreground)]">
            {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
          </Link>
          {lang === 'ko'
            ? ' · 캘리포니아 이용자는 개인정보 판매·공유 거부(Do Not Sell/Share)를 요청할 수 있습니다(당사는 판매하지 않음).'
            : ' · California users may opt out of sale/sharing (Do Not Sell/Share). We do not sell personal information.'}
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => decide('essential')}
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-[13px] font-medium text-neutral-400 hover:text-[var(--foreground)]"
          >
            {lang === 'ko' ? '필수만' : 'Essential only'}
          </button>
          <button
            onClick={() => decide('all')}
            className="rounded-md px-4 py-2 text-[13px] font-semibold"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            {lang === 'ko' ? '동의' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  )
}
