'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

// NOTE: 표준 템플릿입니다. 실제 시행 전 회사 법무/변호사 검토가 필요합니다.
const EFFECTIVE = '2026-07-05'

const sections: { title: { ko: string; en: string }; body: { ko: string; en: string }[] }[] = [
  {
    title: { ko: '1. 개요', en: '1. Overview' },
    body: [
      {
        ko: 'PICKCOS(이하 "회사")는 이용자의 개인정보를 중요하게 생각하며, 관련 법령을 준수합니다. 본 방침은 회사가 수집하는 개인정보의 항목, 이용 목적, 보관, 제3자 제공, 이용자의 권리를 설명합니다.',
        en: 'PICKCOS ("we", "us") values your privacy and complies with applicable laws. This policy explains what personal information we collect, how we use it, how long we keep it, when we share it, and your rights.',
      },
    ],
  },
  {
    title: { ko: '2. 수집하는 정보', en: '2. Information We Collect' },
    body: [
      {
        ko: '회원가입·문의·매칭 신청 시: 이름, 이메일, 회사명, 국가, 연락 선호수단, 요청 내용 등. 서비스 이용 과정에서 접속 로그·기기·쿠키 등 기술 정보가 수집될 수 있습니다.',
        en: 'When you register, contact us, or submit a matching request: name, email, company, country, preferred contact channel, and your request details. We may also collect technical data such as access logs, device, and cookies.',
      },
    ],
  },
  {
    title: { ko: '3. 이용 목적', en: '3. How We Use It' },
    body: [
      {
        ko: '문의·매칭 요청 처리 및 응대, 적합한 공급사 연결(중개), 서비스 운영·개선, 법적 의무 이행을 위해 이용합니다.',
        en: 'To handle and respond to your inquiries and matching requests, connect you with suitable suppliers (intermediation), operate and improve the service, and comply with legal obligations.',
      },
    ],
  },
  {
    title: { ko: '4. 제3자 제공 및 처리위탁', en: '4. Sharing & Processors' },
    body: [
      {
        ko: '이용자가 매칭·연결을 요청한 경우에 한해 필요한 범위에서 공급사에 관련 정보를 제공할 수 있습니다. 또한 호스팅·데이터베이스·이메일 등 서비스 제공을 위한 처리위탁 업체(예: 클라우드 인프라)를 이용할 수 있습니다. 회사는 개인정보를 판매하지 않습니다.',
        en: 'We may share necessary information with a supplier only when you request matching/introduction. We also use processors (e.g., cloud hosting, database, email) to operate the service. We do not sell your personal information.',
      },
    ],
  },
  {
    title: { ko: '5. 쿠키', en: '5. Cookies' },
    body: [
      {
        ko: '서비스는 필수 기능(세션·언어 설정 등)을 위한 쿠키를 사용할 수 있습니다. 비필수 쿠키(분석 등)를 사용하는 경우 별도 동의 또는 옵트아웃 수단을 제공합니다.',
        en: 'We may use cookies for essential functions (session, language). If we use non-essential cookies (e.g., analytics), we provide consent or opt-out mechanisms.',
      },
    ],
  },
  {
    title: { ko: '6. 보관 및 파기', en: '6. Retention & Deletion' },
    body: [
      {
        ko: '개인정보는 수집 목적 달성에 필요한 기간 동안 보관하며, 목적 달성 후 관련 법령에 따른 보존 필요가 없으면 지체 없이 파기합니다.',
        en: 'We keep personal information only as long as necessary for the stated purposes, and delete it without undue delay when no longer needed, unless retention is required by law.',
      },
    ],
  },
  {
    title: { ko: '7. 이용자의 권리 (열람·삭제 및 CCPA)', en: '7. Your Rights (Access/Delete & CCPA)' },
    body: [
      {
        ko: '이용자는 본인 정보의 열람·정정·삭제·처리정지를 요청할 수 있습니다. 캘리포니아(CCPA/CPRA) 등 거주자는 "개인정보 판매·공유 거부(Do Not Sell or Share)"를 요청할 수 있습니다. 회사는 개인정보를 판매하지 않습니다. 요청은 아래 연락처로 접수됩니다.',
        en: 'You may request access, correction, deletion, or restriction of your data. California residents (CCPA/CPRA) may request to opt out of the "sale or sharing" of personal information — we do not sell personal information. Submit requests via the contact below.',
      },
    ],
  },
  {
    title: { ko: '8. 보안', en: '8. Security' },
    body: [
      {
        ko: '회사는 개인정보 보호를 위해 합리적인 기술적·관리적 보호조치를 취합니다. 다만 인터넷을 통한 전송의 완전한 보안은 보장되지 않습니다.',
        en: 'We apply reasonable technical and organizational safeguards. However, no method of internet transmission is completely secure.',
      },
    ],
  },
  {
    title: { ko: '9. 문의처', en: '9. Contact' },
    body: [
      {
        ko: '개인정보 관련 문의: hello@pickcos.com (개인정보 담당). 회사 상호·주소 등 사업자 정보는 시행 전 확정하여 표기합니다.',
        en: 'Privacy inquiries: hello@pickcos.com. Legal entity name and address to be finalized before launch.',
      },
    ],
  },
]

export default function PrivacyPage() {
  const { lang } = useLanguage()
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--foreground)]">
        {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-sub-text)]">
        {lang === 'ko' ? `시행일 ${EFFECTIVE}` : `Effective ${EFFECTIVE}`}
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold text-[var(--foreground)]">{s.title[lang]}</h2>
            {s.body.map((p, j) => (
              <p key={j} className="mt-2 leading-relaxed text-neutral-400 font-light">{p[lang]}</p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-12 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-sub-text)]">
        {lang === 'ko'
          ? '※ 본 문서는 표준 템플릿이며, 실제 시행 전 법무 검토가 필요합니다.'
          : '※ This is a standard template and requires legal review before use.'}
      </p>
      <div className="mt-6">
        <Link href="/about#contact" className="text-sm text-neutral-400 hover:text-[var(--foreground)]">
          {lang === 'ko' ? '← 문의하기' : '← Contact us'}
        </Link>
      </div>
    </div>
  )
}
