// MVP 정의 (260706 버전) — 관리자 MVP 트래커의 항목 원본(단일 출처).
export const MVP_VERSION = '260706'

export const MVP_ACTORS = [
  { key: 'buyer', label: '해외 바이어' },
  { key: 'supplier', label: '국내 공급사' },
  { key: 'operator', label: '운영자 고객대응' },
  { key: 'platform', label: '공통 · 플랫폼' },
] as const

export interface MvpItem { id: string; actor: string; title: string; desc: string }

export const MVP_ITEMS: MvpItem[] = [
  // 해외 바이어
  { id: 'b1', actor: 'buyer', title: '공급사 탐색·검색·필터', desc: '카테고리·지역·제품 필터와 검색으로 공급사를 찾는다.' },
  { id: 'b2', actor: 'buyer', title: '공급사 상세 + 검증·큐레이션 근거', desc: '공급사 상세에서 평가지표 점수·추천사유로 신뢰를 판단한다.' },
  { id: 'b3', actor: 'buyer', title: '매칭 신청(요청서) 제출', desc: '요청 브리프·MOQ·서비스범위 등 구조화된 소싱 요청을 보낸다.' },
  { id: 'b4', actor: 'buyer', title: '접수 확인(요청 ID)', desc: '제출 후 요청 ID와 다음 절차 안내를 받는다.' },
  { id: 'b5', actor: 'buyer', title: '파트너십·일반 문의(About)', desc: '소싱 외 문의는 About의 협업·문의로 접수한다.' },
  { id: 'b6', actor: 'buyer', title: '영어(EN) 지원', desc: '전 페이지 KR/EN 이중언어.' },
  // 국내 공급사
  { id: 's1', actor: 'supplier', title: '운영자의 공급사 등록·평가', desc: '운영자가 공급사 프로필·인증·평가지표를 관리자에서 등록한다.' },
  { id: 's2', actor: 'supplier', title: '공급사 소개 페이지 노출', desc: '등록된 공급사가 근거(점수·추천사유) 포함해 사이트에 노출된다.' },
  { id: 's3', actor: 'supplier', title: '매칭 요청 시 운영자 연결(중개)', desc: '요청이 오면 운영자가 적합 공급사에 연결한다. (현재 이메일/오프라인 수동)' },
  // 운영자
  { id: 'o1', actor: 'operator', title: '관리자 로그인·대시보드', desc: '문의·매칭·회원 현황을 한눈에 본다.' },
  { id: 'o2', actor: 'operator', title: '리드 조회·상태관리', desc: '매칭/문의/회원을 조회하고 상태를 바꾼다.' },
  { id: 'o3', actor: 'operator', title: '평가지표로 공급사 선별·중개', desc: '평가지표로 적합 공급사를 골라 바이어에게 제안한다.' },
  { id: 'o4', actor: 'operator', title: '공급사·이미지·콘텐츠 관리', desc: '공급사·기사·전시 CRUD, 이미지 일괄 업로드·갤러리.' },
  { id: 'o5', actor: 'operator', title: '새 요청 알림 메일', desc: '매칭·문의·회원가입 접수 시 운영자에게 알림 메일 발송.' },
  // 공통
  { id: 'p1', actor: 'platform', title: '법적 페이지·쿠키 동의', desc: '개인정보처리방침·이용약관·쿠키/CCPA 배너·수집 동의.' },
  { id: 'p2', actor: 'platform', title: 'SEO·분석 기본', desc: 'robots·sitemap·OG·구조화데이터·분석(쿠키리스).' },
]

export type MvpStatus = '완료' | '수정필요'
export interface MvpHistoryEntry { status: MvpStatus; detail?: string; at: string }
export interface MvpState { status: MvpStatus; detail?: string; updatedAt?: string; history?: MvpHistoryEntry[] }

export const MVP_DEFAULT_STATUS: MvpStatus = '완료'
