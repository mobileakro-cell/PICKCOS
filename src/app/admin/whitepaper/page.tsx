'use client'

import Link from 'next/link'

const WP_VERSION = '260706'

type Block = { h?: string; p?: string; ul?: string[] }
interface Section { id: string; no: string; title: string; blocks: Block[] }

const sections: Section[] = [
  {
    id: 'summary', no: '01', title: '개요 (Executive Summary)',
    blocks: [
      { p: 'PICKCOS는 해외 바이어와 검증된 국내 뷰티 공급사를 잇는 B2B K-뷰티 소싱 큐레이션 플랫폼입니다.' },
      { p: '방대한 오픈마켓이 아니라, 전문가가 엄선·검증한 파트너를 평가지표(rubric) 기반으로 큐레이션하고, 제작 의뢰가 오면 다직능 전문가(PM·약사·의사)가 이 네트워크를 지휘해 완제품까지 딜리버리하는 "전문가 주도 관리형 제품개발·소싱(Managed ODM Orchestrator)" 모델을 지향합니다.' },
      { p: '신뢰는 크라우드 리뷰가 아니라 투명한 검증·큐레이션으로 만듭니다. 추천의 근거(증빙·평가지표·실적)를 공개해, 바이어가 "왜 이 공급사인지"를 납득하게 합니다.' },
    ],
  },
  {
    id: 'problem', no: '02', title: '시장과 문제',
    blocks: [
      { p: 'K-뷰티의 글로벌 수요는 크지만, 해외 바이어가 신뢰할 만한 한국 제조사를 찾아 검증하기는 어렵습니다.' },
      { ul: [
        '정보 비대칭 — 어떤 공급사가 실제로 역량 있는지 판단할 근거가 부족',
        '언어·소통 장벽, 시차, 커뮤니케이션 비용',
        '품질·규제(타겟국 인증) 불확실성',
        '오픈마켓은 업체가 너무 많고 검증이 약해 "옥석 가리기"가 어려움',
      ] },
    ],
  },
  {
    id: 'solution', no: '03', title: '솔루션과 모델',
    blocks: [
      { p: '한 줄 정의 — PICKCOS는 엄선된 국내 공급사 네트워크와 다직능 전문가(PM·약사·의사)를 활용해, 해외 바이어의 아이디어를 완제품으로 만들어주는 전문가 주도 K-뷰티 제품개발·소싱 파트너입니다. (Asset-light Managed ODM Orchestrator)' },
      { p: '"단순 제조 대행"이 아니라, 아이디어를 완제품까지 책임지고 지휘하는 "종합 건설사(GC)" 같은 오케스트레이터입니다. 공장을 소유하지 않되, 큐레이션(신뢰)·전문가 PM·약사/의사 검증을 얹은 부가가치 관리형 서비스입니다.' },
      { h: '서비스 레이어' },
      { ul: [
        '① 디스커버리·큐레이션 — 검증된 공급사 소개(신뢰·유입, 무료/리드)',
        '② 관리형 제품개발·제작 — 전문가 그룹이 네트워크를 지휘해 완제품 딜리버리(수익 엔진, 완료 시 수익 %)',
        '③ 인증·컴플라이언스 서비스 — 대상국 규제 인증(FDA·EU CPNP·중국 NMPA·할랄·비건·ISO/COSMOS) 대행 + 안전성·임상/더마 시험 + PICKCOS 인증마크 (독립 수익 또는 제작 번들)',
        '④ 전문성 — 약사(처방·성분·규제) · 의사(임상·더마·효능 클레임)로 차별화, 위 인증 서비스를 뒷받침',
      ] },
      { p: '엄선한 검증 파트너를 큐레이션해 연결합니다. "중립 오픈마켓"으로 위장하지 않고, 에이전시로 정직하게 표방합니다.' },
      { h: '핵심' },
      { ul: [
        '평가지표(rubric)로 공급사를 점수화하고, 그 근거를 공급사 상세에 투명하게 노출',
        '바이어는 구조화된 요청서(브리프·MOQ·서비스범위 등)로 소싱을 요청',
        '운영자가 평가지표로 적합 파트너를 선별해 중개',
      ] },
      { h: '치명적 실패를 막는 3원칙' },
      { ul: [
        '카테고리당 최소 2~3곳 확보 — 단일 벤더 몰아주기 금지',
        '평가지표·기준 공개 — 자의적 추천이 아님을 증명',
        '이해관계·유료 노출 공개(Sponsored) — 공정성 확보',
      ] },
    ],
  },
  {
    id: 'how', no: '04', title: '작동 방식 (3 대상자)',
    blocks: [
      { h: '해외 바이어' },
      { p: '공급사 탐색(검색·필터) → 공급사 상세에서 검증·큐레이션 근거로 신뢰 판단 → 매칭 신청(요청서) 제출 → 접수 확인.' },
      { h: '국내 공급사' },
      { p: '운영자가 발굴·검증해 관리자에서 등록·평가(평가지표) → 근거 포함해 사이트에 노출 → 요청이 오면 운영자가 연결.' },
      { h: '운영자 (고객대응)' },
      { p: '공급사 등록·평가, 매칭·문의 리드 응대, 평가지표로 선별·중개, 콘텐츠·이미지 관리.' },
      { h: '전문가 PM 네트워크 (제작 딜리버리)' },
      { p: '제작 의뢰가 오면 우리 다직능 전문가 그룹이 공급사 네트워크를 지휘해 완제품까지 딜리버리합니다. 소싱 PM(프로젝트 관리) + 약사(처방·성분·규제 자문) + 의사(임상·더마·효능 클레임 검증)로 구성되어, 기능성·더마 K-뷰티의 신뢰도와 차별성을 높입니다.' },
    ],
  },
  {
    id: 'curation', no: '05', title: '큐레이션 방법론',
    blocks: [
      { p: '추천의 근거는 3층으로 제시합니다 — ① 객관 증빙(사업자등록·인증서·실사) ② 큐레이터의 누가·왜(전문가 추천 사유) ③ 실적(업력·수출·납품).' },
      { h: '평가지표 (100점 환산)' },
      { ul: [
        '검증·신뢰 20% / 품질·규제 20% / 생산 역량 15% / 실적·트랙레코드 15%',
        '대응·커뮤니케이션 15% / 유연성 10% / 지속가능성·윤리 5%',
        '임계값: 70점 이상 = "검증", 85점 이상 = "앰배서더 픽" (운영자 최종 확정)',
      ] },
      { p: '리뷰·평점은 규모(완료 거래)가 없는 초기엔 부적합하여 보류하고, 이 검증 깊이로 신뢰를 대체합니다.' },
    ],
  },
  {
    id: 'platform', no: '06', title: '플랫폼 구성',
    blocks: [
      { ul: [
        '공급사 디렉토리·상세(검증·큐레이션 근거) / 소싱 매칭 요청서 / 뉴스·전시',
        '이중언어(KR·EN), 반응형',
        '관리자: 공급사·기사·전시 관리, 평가지표, 리드(매칭·문의·회원), 이미지 일괄 업로드·갤러리, 서비스 정책·MVP·프롬프트 모음',
        '데이터: PostgreSQL(Supabase) · 클라우드(Vercel) 24/7',
      ] },
    ],
  },
  {
    id: 'trust', no: '07', title: '신뢰와 컴플라이언스',
    blocks: [
      { ul: [
        '검증 깊이(평가지표·증빙)로 신뢰 형성, 이해상충·유료 노출 공개',
        '개인정보처리방침·이용약관·쿠키/CCPA 동의, 수집 동의',
        '웹 접근성(ADA/WCAG) 1차 반영, SEO·구조화데이터·분석',
      ] },
    ],
  },
  {
    id: 'roadmap', no: '08', title: '로드맵 · 중장기 비전',
    blocks: [
      { h: '1단계 — 신뢰 구축·관리형 서비스 (현재~)' },
      { p: '큐레이션으로 신뢰를 쌓고, 전문가 주도로 제작을 딜리버리한다. 수익은 프로젝트 %. 핵심은 성공 사례 축적.' },
      { h: '2단계 — 시스템화·확장 (성장)' },
      { ul: [
        '제품개발 파이프라인 표준화(컨셉→처방→샘플→생산→수출), QA·플레이북',
        '바이어 계정·프로젝트 대시보드, RFQ·견적 비교',
        '"PICKCOS 검증 처방/공장" = 신뢰 브랜드화',
        '표준 건은 반자동, 복잡 건은 고접점 — 하이브리드',
      ] },
      { h: '3단계 — 데이터·브랜드로 상방 확장 (비전)' },
      { ul: [
        '데이터 해자: "무엇이 팔리는가 / 어느 처방·공장이 잘하는가" 축적 → 매칭·트렌드 인텔리전스',
        '브랜드 인큐베이션: 수수료 → 자체/공동 브랜드(지분)로 가치사슬 상방 이동',
        '버티컬 확장: 약사·의사 네트워크 활용 → 더마·건기식·뷰티디바이스',
        '지리적 확장: K-뷰티 글로벌 브리지 → (동일 플레이북) 타 원산지',
      ] },
      { h: '가까운 실행 항목' },
      { ul: [
        '운영자 알림 메일(접수 즉시) — MVP 필수',
        'AI 자동화 — 외부 AI로 공급사 CSV 초안·번역 생성 후 일괄 업로드(앱 내 AI 미탑재, 저비용)',
        '전문가 선발·등급·표준계약서, 사업자정보·법무 검토',
        '리뷰·평점: 거래량·거래 인증 가능해지면 재검토(현재 보류)',
      ] },
      { h: '긴장점' },
      { p: '사람 사업이라 소프트웨어처럼 확장되지 않는다 → 2단계 "시스템화"가 관건. 에이전시(고접점)와 플랫폼(확장성)의 균형을 어디까지 제품화할지 지속 결정.' },
    ],
  },
  {
    id: 'positioning', no: '09', title: '포지셔닝',
    blocks: [
      { p: '"엄선한 검증 파트너를 연결하는 K-뷰티 소싱 큐레이션."' },
      { p: '수요가 큰 K-뷰티 시장에서, 신뢰 가능한 소싱을 큐레이션으로 해결하는 것 — 이것이 PICKCOS의 존재 이유입니다.' },
    ],
  },
]

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div className="no-print sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">← 관리자로 돌아가기</Link>
          <button onClick={() => window.print()} className="rounded-lg bg-[var(--color-theme-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-theme-600)]">PDF 다운로드</button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8 border-b pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-theme-600)] px-3 py-1 text-xs font-bold text-white">Whitepaper · {WP_VERSION}</div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">PICKCOS 백서</h1>
          <p className="mt-2 text-gray-500">B2B K-뷰티 소싱 큐레이션 플랫폼 — 비전·모델·큐레이션 방법론·로드맵.</p>
        </header>

        <nav className="mb-10 rounded-xl border bg-gray-50 p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-700">목차</h2>
          <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[14px] text-gray-700 hover:bg-white hover:text-[var(--color-theme-700)]">
                  <span className="font-mono text-xs text-gray-400">{s.no}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-gray-900">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-theme-50)] text-sm font-bold text-[var(--color-theme-700)]">{s.no}</span>
                {s.title}
              </h2>
              <div className="space-y-3 pl-11">
                {s.blocks.map((b, i) => (
                  b.h ? <div key={i} className="text-sm font-bold text-gray-500">{b.h}</div>
                    : b.ul ? (
                      <ul key={i} className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-gray-700 marker:text-gray-400">
                        {b.ul.map((li, j) => <li key={j}>{li}</li>)}
                      </ul>
                    ) : <p key={i} className="text-[15px] leading-relaxed text-gray-700">{b.p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t pt-6 text-center text-xs text-gray-400">PICKCOS Whitepaper · {WP_VERSION} · 내부 참고용</footer>
      </div>
    </div>
  )
}
