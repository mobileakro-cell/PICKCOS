'use client'

import Link from 'next/link'

// 서비스 정책 문서 (살아있는 문서).
// 베타 운영 중 이슈·결론을 쌓고, 상호 불일치/조정 필요 항목을 수시로 개선해 시스템에 반영한다.
// status: 필수 | 검토중 | 잠정결론 | 확정 | 보류
type Status = '필수' | '검토중' | '잠정결론' | '확정' | '보류'
interface Policy {
  no: string
  id: string
  title: string
  status: Status
  issue: string
  bestPractice: string[]
  current: string
  decision: string
  todo: string[]
}

const policies: Policy[] = [
  {
    no: '01', id: 'inquiry-routing', title: '문의·리드 라우팅', status: '잠정결론',
    issue: '특정 공급사를 본 뒤 문의하면, 그 공급사에게 직접 메일이 가야 하는가? 공급사로 보내면서 우리 관리자에서도 함께 모니터링하려면 무엇이 문제인가?',
    bestPractice: [
      'Alibaba·글로벌소싱: 플랫폼 내 메시징/RFQ로 중개하고 연락처는 마스킹, 신뢰 단계에서 단계적 공개.',
      'Thomasnet·Kompass: 리드를 공급사에 전달하되 플랫폼이 리드 품질을 관리(자격 확인 후 전달).',
      '큐레이션형(Faire 등): 주문·결제를 플랫폼이 중개해 자연스럽게 우회를 방지.',
    ],
    current: '문의는 공급사(supplierId)로 태깅되어 DB에 저장되고 관리자 [문의] 탭에서 확인됨. 다만 이메일 발송 기능은 전혀 없어 아무에게도 메일이 가지 않음. 공급사에는 전용 이메일 필드가 없고 범용 contact 문자열만 있음.',
    decision: '초기에는 관리자 경유 중개(A안) 권장 — 우회 방지 + 큐레이션 가치 유지. 첫 단계로 "문의 접수 시 관리자 알림 메일"을 도입해 실시간 모니터링부터 확보하고, 이후 공급사 알림/마스킹 회신으로 확장. 또한 채널을 분리: 소싱 요청은 구조화된 "매칭 신청(요청서)"으로 일원화하고, "문의(Contact)"는 일반·제휴·지원 문의 전용으로 역할을 나눔.',
    todo: [
      '문의 접수 시 관리자에게 알림 메일 발송 (발송 서비스 + 도메인 인증 필요)',
      '(후속) 공급사에는 "새 문의 도착" 알림만, 실제 소통은 플랫폼 경유(마스킹/스레드)',
      '공급사 전용 수신 이메일 필드 추가·정제',
    ],
  },
  {
    no: '02', id: 'disintermediation', title: '중개 우회 방지', status: '검토중',
    issue: '바이어–공급사가 직거래로 전환해 플랫폼을 건너뛰는 것(이탈)을 어떻게 막을 것인가?',
    bestPractice: [
      '연락처 마스킹 + 플랫폼 내 커뮤니케이션 의무화.',
      '결제·계약·샘플 요청을 플랫폼이 중개해 이탈 유인을 줄임.',
      '약관에 우회 금지 조항, 초기 노출 정보 최소화.',
    ],
    current: '공급사 상세에 website·contact 필드가 존재하여, 그대로 노출하면 우회 위험이 큼.',
    decision: '베타에서는 공개 범위를 최소화하고, 실제 연결은 매칭/관리자를 통해 이뤄지게 한다. 수익모델(09번) 확정과 함께 재검토.',
    todo: [
      '공급사 연락처·website 공개 여부 정책화 (비공개 또는 로그인/승인 게이팅)',
      '약관에 우회 관련 조항 반영 검토',
    ],
  },
  {
    no: '03', id: 'gating', title: '회원·접근 게이팅', status: '검토중',
    issue: '어디까지 비회원에게 공개하고, 어디부터 회원가입·승인(검증 바이어)이 필요하게 할 것인가?',
    bestPractice: [
      '목록·개요는 공개(SEO·유입), 상세 연락처·자료·MOQ 등 민감정보는 회원/검증 바이어에게만.',
      '바이어 자격 확인(사업자/이메일 도메인)으로 리드 품질 관리.',
    ],
    current: '대부분 페이지가 공개. 회원가입(register)은 열려 있으나 게이팅에 활용되지 않음.',
    decision: '민감정보(연락처·다운로드 파일·상세 스펙)의 게이팅 여부를 정한다. 게이팅은 우회 방지(02)·리드 품질과 연결.',
    todo: ['민감 정보 게이팅 로직', '바이어 자격 확인 절차'],
  },
  {
    no: '04', id: 'curation', title: '공급사 큐레이션·검증', status: '검토중',
    issue: '"검증(Verified)"·"앰배서더 픽" 배지는 어떤 기준으로 부여하는가?',
    bestPractice: [
      '사업자등록·인증서(ISO 22716/CGMP 등)·실사 기반 검증, 등급/뱃지 체계.',
      '검증 증빙 보관 및 갱신 주기 관리.',
    ],
    current: 'verified·ambassadorPick 불리언만 존재하고, 부여 기준·증빙이 안 보임.',
    decision: '리뷰(12) 대신 이 "검증 깊이"를 초기 신뢰의 핵심 메커니즘으로 삼는다(큐레이션 모델에 부합). 검증 배지 기준 공개, 인증서·서류 증빙 노출, 앰배서더 추천 사유, 동의 기반 큐레이션 성공사례를 갖춘다.',
    todo: ['검증 기준·증빙 체크리스트 공개', '인증서/서류 증빙 노출', '앰배서더 추천 사유', '큐레이션 성공사례(오픈 리뷰 대체)'],
  },
  {
    no: '05', id: 'privacy', title: '개인정보·데이터 보호', status: '필수',
    issue: '바이어·문의자의 개인정보(이름·이메일·회사)를 수집·보관하고, 제3자(공급사)에게 제공할 때의 기준은?',
    bestPractice: [
      '최소 수집·목적 명시·수집 동의, 보관기간·파기 정책, 제3자 제공 시 별도 동의.',
      '국내 개인정보보호법(PIPA)·해외 대상이면 GDPR 대응, 개인정보처리방침 상시 게시.',
    ],
    current: '개인정보처리방침 페이지(/privacy)·쿠키/CCPA 고지 배너·수집 동의 체크(회원가입·매칭 폼) 구현 완료. 보관/파기 세부, 제3자 제공 동의 문구 정교화, 법무 검토가 남음.',
    decision: '기본 컴플라이언스는 갖춤. 상용 런칭 전 법무 검토와 보관/파기·제3자제공 문구를 확정한다.',
    todo: ['✅ 개인정보처리방침 페이지', '✅ 수집 동의 체크(회원가입·매칭)', '✅ 쿠키/CCPA 배너', '보관기간·파기 정책 확정', '법무 검토'],
  },
  {
    no: '06', id: 'content', title: '콘텐츠·번역 품질', status: '검토중',
    issue: 'KR/EN 이중언어의 정확성·일관성, 공급사 자기소개의 검수 기준은?',
    bestPractice: [
      '용어집·스타일가이드 운영, 인증명·브랜드명은 원문 유지, 게시 전 검수 워크플로우.',
    ],
    current: 'KR/EN 병기 구조, EN 자동번역(Claude 프롬프트) 워크플로우 존재. 검수 기준은 미문서화.',
    decision: '용어집·검수 기준을 문서화해 품질을 표준화한다. (style-guide와 연동)',
    todo: ['용어집·스타일가이드 정리', '게시 전 검수 체크'],
  },
  {
    no: '07', id: 'media', title: '이미지·자산 권리', status: '검토중',
    issue: '공급사 이미지·로고의 사용권/저작권은 누가 보증하는가?',
    bestPractice: ['업로드 시 권리 보증 동의, 출처·권리 메타 관리, 분쟁 시 내리기(takedown) 절차.'],
    current: '이미지 URL·파일 업로드 기능은 있으나 권리 확인 절차가 없음.',
    decision: '업로드 시 권리 동의·출처 기록을 도입한다.',
    todo: ['업로드 권리 동의 체크', '출처/권리 메타 필드'],
  },
  {
    no: '08', id: 'anti-abuse', title: '커뮤니케이션·스팸/어뷰즈', status: '검토중',
    issue: '공개 폼 악용(스팸·봇)과 이메일 도달률 문제를 어떻게 막는가?',
    bestPractice: [
      '레이트리밋, 캡차/허니팟, 발송 도메인 인증(SPF·DKIM·DMARC), 전문 발송 서비스(Resend·SES 등).',
    ],
    current: '폼 남용 방어 없음, 이메일 발송 인프라 없음.',
    decision: '이메일 발송(01번)을 도입할 때 스팸 방어·도메인 인증을 함께 적용한다.',
    todo: ['레이트리밋·캡차/허니팟', '발송 서비스 + SPF/DKIM/DMARC'],
  },
  {
    no: '09', id: 'monetization', title: '수익화 모델', status: '검토중',
    issue: '수수료·구독·리드 요금 중 무엇으로 수익화하는가? (라우팅·게이팅·우회 정책의 전제)',
    bestPractice: [
      '리드 과금(공급사에 리드 판매), 구독(노출·상위 배치), 성사 수수료 등 — 대개 혼합.',
    ],
    current: '수익모델 미정.',
    decision: '수익모델 확정이 여러 정책(01·02·03)의 방향을 결정하므로 우선 논의가 필요.',
    todo: ['수익모델 결정', '모델에 따른 기능(결제·구독·리드관리)'],
  },
  {
    no: '10', id: 'legal', title: '약관·법적 고지', status: '필수',
    issue: '이용약관·개인정보처리방침·전자상거래 사업자정보 고지는 준비됐는가?',
    bestPractice: ['이용약관·개인정보처리방침·사업자정보를 푸터에 상시 고지, 동의 이력 보관.'],
    current: '이용약관(/terms)·개인정보처리방침(/privacy) 페이지 추가, 푸터 링크 연결 완료. 사업자정보 표기·동의 이력·법무 검토가 남음.',
    decision: '기본 문서는 갖춤. 사업자정보(상호·주소·사업자번호)와 법무 검토를 상용 전 확정한다.',
    todo: ['✅ 이용약관·개인정보처리방침 페이지', '✅ 푸터 링크 연결', '사업자정보 표기', '법무 검토'],
  },
  {
    no: '11', id: 'accessibility', title: '웹 접근성 (ADA/WCAG)', status: '검토중',
    issue: '북미 대상 사이트의 웹 접근성(ADA/WCAG)은 준수되는가?',
    bestPractice: ['WCAG 2.1 AA를 사실상 기준으로 시맨틱 마크업·대체텍스트·키보드 이동·색 대비·포커스 표시 준수. 미국은 ADA 접근성 소송이 연 수천 건(합의금 $5k~25k).'],
    current: '1차 접근성 반영: 스킵 링크, 언어별 동적 html lang, main 랜드마크, 아이콘 버튼 aria-label. 전면 WCAG 2.1 AA 자동/수동 감사와 대비·포커스 보정은 진행 중.',
    decision: '기본 접근성은 반영. WCAG 2.1 AA 자동 검사 도구로 전면 점검하고 잔여 위반을 수정한다.',
    todo: ['✅ 스킵 링크·동적 lang·랜드마크·aria-label', 'WCAG 2.1 AA 자동 검사', '색 대비·포커스·키보드 이동 보정'],
  },
  {
    no: '12', id: 'reviews', title: '공급사 리뷰·평점', status: '보류',
    issue: '바이어가 공급사를 평가·신뢰할 리뷰/평점 체계가 있는가? 지금 도입이 적합한가?',
    bestPractice: ['리뷰는 완료 거래가 충분히 쌓인 뒤, 거래 인증 기반(조작 방지)으로만 의미가 있음. 소비자 리뷰와 달리 B2B는 공개 평가를 꺼리고 명예훼손 리스크가 큼.'],
    current: '리뷰·평점 기능 없음. 공급사 소수·성사 거래 0 상태.',
    decision: '보류. 큐레이션형 초기 단계에는 부적합(규모 부재로 신뢰↓, B2B 공개평가 회피, 큐레이션 모델과 상충). 신뢰는 리뷰 대신 검증 깊이(04)로 확보한다. 거래량이 쌓이고 거래 인증이 가능해지면 재검토.',
    todo: ['(보류) 거래 인증 기반 리뷰는 규모 확보 후 재검토'],
  },
  {
    no: '13', id: 'buyer-account', title: '바이어 계정·대시보드', status: '검토중',
    issue: '바이어가 로그인해 자신의 요청·견적·북마크를 관리할 수 있는가?',
    bestPractice: ['소싱 플랫폼의 기본 — 바이어 계정과 "내 요청/견적/저장한 공급사" 대시보드.'],
    current: '회원가입은 정보 수집만, 실제 로그인·대시보드 없음.',
    decision: '리드가 쌓이고 재방문 수요가 확인되면 바이어 인증·대시보드를 도입. 게이팅(03)과 연계.',
    todo: ['바이어 인증(로그인)', '내 요청/견적/북마크 대시보드'],
  },
  {
    no: '14', id: 'rfq-quotes', title: 'RFQ · 견적 비교', status: '검토중',
    issue: '요청을 여러 공급사에 보내고 견적을 비교하는 흐름이 있는가?',
    bestPractice: ['표준: 요청(RFQ) → 여러 공급사 견적 수집 → 나란히 비교. 리버스옥션까지 확장하기도 함.'],
    current: '단일 매칭 요청만 있음(다대다 RFQ·견적 비교 없음). 우회방지(02) 정책과 균형 필요.',
    decision: '초기엔 관리자 중개로 견적을 취합·전달. 규모 확대 시 플랫폼 내 견적 비교 도입 검토.',
    todo: ['견적(quote) 데이터 모델', '견적 비교 UI', '중개-우회 균형 설계'],
  },
  {
    no: '15', id: 'analytics-seo', title: '분석 · SEO', status: '검토중',
    issue: '유입·전환을 측정하고 검색 노출을 확보하는가?',
    bestPractice: ['웹 분석(전환 추적)·SEO 기본(메타/OG/sitemap/robots/구조화데이터)은 성장의 계기판.'],
    current: 'SEO 기본 구축: robots.txt·sitemap.xml(동적)·OpenGraph/Twitter 메타·Organization 구조화데이터. 분석: Vercel Analytics(쿠키리스) 도입. 상세 페이지별 메타(클라이언트 컴포넌트 제약)·추가 구조화데이터 확장은 남음.',
    decision: 'SEO/분석 기본은 갖춤. 상세 페이지 메타(서버 컴포넌트화 또는 generateMetadata)와 제품/공급사 구조화데이터를 확장한다.',
    todo: ['✅ robots·sitemap', '✅ OG/Twitter 메타·구조화데이터', '✅ Vercel Analytics(쿠키리스)', '상세 페이지별 메타', 'Product/Organization 구조화데이터 확장'],
  },
]

// ── 변경 이력 (히스토리) — 단일 출처. 새 항목은 맨 위에 추가한다. ──
// 정책을 조정할 때마다 여기에 한 줄 추가하면, 각 정책의 "최종 수정일"이 자동 반영된다.
interface ChangeEntry { date: string; refs: string[]; summary: string }
const changelog: ChangeEntry[] = [
  {
    date: '2026-07-05', refs: ['reviews', 'curation'],
    summary: '리뷰·평점 보류 결정 — 큐레이션형 초기 단계엔 부적합(규모 부재·B2B 공개평가 회피·모델 상충). 신뢰는 리뷰 대신 "검증 깊이(04)"로 확보하기로: 검증 기준·증빙 노출, 앰배서더 추천 사유, 큐레이션 성공사례.',
  },
  {
    date: '2026-07-05', refs: ['analytics-seo', 'accessibility'],
    summary: 'SEO/분석·접근성 1차 구현 — robots·sitemap·OG/구조화데이터·Vercel Analytics(쿠키리스), 스킵 링크·동적 html lang·main 랜드마크·aria-label. 리뷰·바이어계정·RFQ는 순차 구축 예정.',
  },
  {
    date: '2026-07-05', refs: ['privacy', 'legal', 'accessibility', 'reviews', 'buyer-account', 'rfq-quotes', 'analytics-seo'],
    summary: '북미 소싱 플랫폼 완성도 점검 반영 — 개인정보처리방침/이용약관 페이지·쿠키(CCPA)배너·수집 동의 체크 구현. 접근성·리뷰·바이어계정·RFQ 견적비교·분석/SEO를 신규 정책 항목(11~15)으로 추가(로드맵).',
  },
  {
    date: '2026-07-05', refs: ['inquiry-routing'],
    summary: '채널 분리 반영 — 소싱 요청은 "매칭 신청(요청서)"으로 일원화, "문의(Contact)"는 일반·제휴·지원 전용. 공급사 상세 CTA도 매칭 신청 하나로 통합. (요청서 폼은 우수사례 기반으로 재구성: 요청 브리프 자유서술 + 정형 항목 선택형 + 패키징·참고제품 추가)',
  },
  {
    date: '2026-07-05', refs: ['inquiry-routing'],
    summary: "베타 논의 반영 — '관리자 경유 중개(A안)'을 잠정결론으로, 첫 단계로 '문의 접수 시 관리자 알림 메일' 우선 도입 방향 설정.",
  },
  {
    date: '2026-07-05',
    refs: ['inquiry-routing', 'disintermediation', 'gating', 'curation', 'privacy', 'content', 'media', 'anti-abuse', 'monetization', 'legal'],
    summary: '서비스 정책 문서 최초 작성 — 정책 10개 초안 및 목차 구성.',
  },
]

// 특정 정책의 최종 수정일 (변경 이력에서 도출)
function lastUpdated(id: string): string | null {
  const dates = changelog.filter((c) => c.refs.includes(id)).map((c) => c.date).sort()
  return dates.length ? dates[dates.length - 1] : null
}
const policyTitle = (id: string) => policies.find((p) => p.id === id)?.title || id

const statusStyle: Record<Status, string> = {
  '필수': 'bg-red-100 text-red-700',
  '검토중': 'bg-yellow-100 text-yellow-700',
  '잠정결론': 'bg-blue-100 text-blue-700',
  '확정': 'bg-green-100 text-green-700',
  '보류': 'bg-gray-100 text-gray-600',
}

export default function AdminPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <style>{`@media print { .no-print { display: none !important; } body { background: #fff; } .policy-page { padding: 0 !important; } }`}</style>

      {/* Toolbar */}
      <div className="no-print sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">← 관리자로 돌아가기</Link>
          <button onClick={() => window.print()} className="rounded-lg bg-[var(--color-theme-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-theme-600)]">
            PDF 다운로드
          </button>
        </div>
      </div>

      <div className="policy-page mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8 border-b pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-theme-600)] px-3 py-1 text-xs font-bold text-white">🧭 살아있는 문서 · 베타</div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">PICKCOS 서비스 정책</h1>
          <p className="mt-2 text-gray-500">
            베타 운영 중 정책 이슈와 결론을 쌓아가는 문서입니다. 상호 불일치하거나 조정이 필요한 항목을
            수시로 분석·개선해 시스템에 반영합니다. 각 정책은 <b>이슈 → 우수사례 → 현재 상태 → 결론 → 시스템 반영</b> 순으로 정리했습니다.
          </p>
        </header>

        {/* 목차 */}
        <nav className="mb-10 rounded-xl border bg-gray-50 p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-700">목차</h2>
          <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {policies.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[14px] text-gray-700 hover:bg-white hover:text-[var(--color-theme-700)]">
                  <span className="font-mono text-xs text-gray-400">{p.no}</span>
                  <span className="flex-1">{p.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyle[p.status]}`}>{p.status}</span>
                </a>
              </li>
            ))}
          </ol>
          <a href="#history" className="mt-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-[14px] font-medium text-gray-700 hover:bg-white hover:text-[var(--color-theme-700)]">
            <span className="font-mono text-xs text-gray-400">🕘</span>
            <span className="flex-1">변경 이력 (History)</span>
          </a>
        </nav>

        {/* 정책 본문 */}
        <div className="space-y-8">
          {policies.map((p) => (
            <section key={p.id} id={p.id} className="scroll-mt-20 rounded-xl border p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-theme-50)] text-sm font-bold text-[var(--color-theme-700)]">{p.no}</span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{p.title}</h2>
                  {lastUpdated(p.id) && <div className="text-xs text-gray-400">최종 수정 {lastUpdated(p.id)}</div>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[p.status]}`}>{p.status}</span>
              </div>

              <div className="space-y-3 text-[15px] leading-relaxed">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400">이슈</div>
                  <p className="mt-0.5 text-gray-800">{p.issue}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400">우수사례 (업계 벤치마크)</div>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-700 marker:text-gray-400">
                    {p.bestPractice.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400">현재 상태</div>
                  <p className="mt-0.5 text-gray-700">{p.current}</p>
                </div>
                <div className="rounded-lg bg-[var(--color-theme-50)] p-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-theme-700)]">결론 / 방침</div>
                  <p className="mt-0.5 text-gray-800">{p.decision}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400">시스템 반영 필요</div>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    {p.todo.map((t, i) => <li key={i} className="flex gap-2"><span className="mt-0.5 text-[var(--color-theme-400)]">☐</span><span>{t}</span></li>)}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* 변경 이력 */}
        <section id="history" className="mt-12 scroll-mt-20 rounded-xl border p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">🕘</span>
            <h2 className="text-xl font-bold text-gray-900">변경 이력 (History)</h2>
          </div>
          <p className="mb-4 text-[14px] text-gray-500">정책을 조정할 때마다 한 줄씩 기록합니다. 각 정책의 "최종 수정일"은 이 이력에서 자동 반영됩니다. (최신순)</p>
          <ol className="space-y-3">
            {changelog.map((c, i) => (
              <li key={i} className="flex gap-3 border-l-2 border-[var(--color-theme-200)] pl-4">
                <div className="w-24 flex-shrink-0 font-mono text-[13px] text-gray-400">{c.date}</div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap gap-1">
                    {c.refs.map((r) => (
                      <a key={r} href={`#${r}`} className="rounded-full bg-[var(--color-theme-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-theme-700)] hover:underline">{policyTitle(r)}</a>
                    ))}
                  </div>
                  <p className="text-[14px] text-gray-700">{c.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-12 border-t pt-6 text-center text-xs text-gray-400">
          정책 조정이 필요하면 담당자에게 요청하세요. 항목 간 불일치·중복은 정기적으로 점검해 갱신합니다.
        </footer>
      </div>
    </div>
  )
}
