'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

// NOTE: 표준 템플릿입니다. 실제 시행 전 회사 법무/변호사 검토가 필요합니다.
const EFFECTIVE = '2026-07-05'

const sections: { title: { ko: string; en: string }; body: { ko: string; en: string }[] }[] = [
  {
    title: { ko: '1. 약관의 동의', en: '1. Acceptance' },
    body: [{
      ko: '본 서비스를 이용함으로써 이용자는 본 약관에 동의하는 것으로 간주됩니다. 동의하지 않는 경우 서비스 이용을 중단해 주세요.',
      en: 'By using the service, you agree to these Terms. If you do not agree, please discontinue use.',
    }],
  },
  {
    title: { ko: '2. 서비스의 성격', en: '2. Nature of the Service' },
    body: [{
      ko: 'PICKCOS는 바이어와 검증된 공급사를 연결하는 큐레이션·매칭(중개) 플랫폼입니다. 회사는 바이어–공급사 간 거래의 당사자가 아니며, 계약 체결·품질·이행에 대한 책임을 지지 않습니다.',
      en: 'PICKCOS is a curation/matching (intermediation) platform connecting buyers with vetted suppliers. We are not a party to any buyer–supplier transaction and are not responsible for the conclusion, quality, or performance of such deals.',
    }],
  },
  {
    title: { ko: '3. 이용 자격', en: '3. Eligibility' },
    body: [{
      ko: '본 서비스는 사업 목적의 이용자(B2B)를 위한 것입니다. 이용자는 제공하는 정보가 정확함을 보증합니다.',
      en: 'The service is intended for business (B2B) users. You represent that the information you provide is accurate.',
    }],
  },
  {
    title: { ko: '4. 이용자의 의무', en: '4. User Obligations' },
    body: [{
      ko: '이용자는 법령과 본 약관을 준수하며, 허위 정보 제공, 스팸, 시스템 악용, 타인 권리 침해 등을 하지 않아야 합니다.',
      en: 'You must comply with laws and these Terms, and must not provide false information, spam, abuse the system, or infringe others’ rights.',
    }],
  },
  {
    title: { ko: '5. 지식재산권', en: '5. Intellectual Property' },
    body: [{
      ko: '사이트의 콘텐츠·상표·디자인은 회사 또는 정당한 권리자의 자산입니다. 무단 복제·이용을 금합니다. 이용자가 업로드한 콘텐츠는 해당 권리를 보유·보증해야 합니다.',
      en: 'Site content, trademarks, and design belong to us or rightful owners. Unauthorized use is prohibited. You must own or have rights to any content you upload.',
    }],
  },
  {
    title: { ko: '6. 공급사 정보 및 보증의 부인', en: '6. Supplier Listings & Disclaimer' },
    body: [{
      ko: '공급사 정보는 참고용으로 제공되며, 회사는 그 완전성·정확성을 보증하지 않습니다. 이용자는 최종 계약 전 자체 실사를 수행해야 합니다.',
      en: 'Supplier information is provided for reference; we do not warrant its completeness or accuracy. You should perform your own due diligence before entering any agreement.',
    }],
  },
  {
    title: { ko: '7. 책임의 제한', en: '7. Limitation of Liability' },
    body: [{
      ko: '관련 법령이 허용하는 범위에서, 회사는 서비스 이용으로 발생한 간접·부수·결과적 손해에 대해 책임을 지지 않습니다.',
      en: 'To the extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the service.',
    }],
  },
  {
    title: { ko: '8. 준거법 및 관할', en: '8. Governing Law' },
    body: [{
      ko: '본 약관은 회사 소재지 법률에 따라 해석되며, 관할 법원은 시행 전 확정하여 표기합니다.',
      en: 'These Terms are governed by the laws of our place of business; the competent court will be finalized before launch.',
    }],
  },
  {
    title: { ko: '9. 약관의 변경 및 문의', en: '9. Changes & Contact' },
    body: [{
      ko: '회사는 약관을 변경할 수 있으며, 중요한 변경은 사전 고지합니다. 문의: hello@pickcos.com',
      en: 'We may update these Terms and will notify of material changes. Contact: hello@pickcos.com',
    }],
  },
]

export default function TermsPage() {
  const { lang } = useLanguage()
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--foreground)]">
        {lang === 'ko' ? '이용약관' : 'Terms of Service'}
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
