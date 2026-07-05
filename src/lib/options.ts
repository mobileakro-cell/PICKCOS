import { SUPPLIER_TYPES, PRODUCT_CATEGORIES } from './types'

// ─────────────────────────────────────────────────────────────
// 선택형 조건값(옵션) — 관리자 폼 · CSV/엑셀 양식 · 검증에서 공용으로 사용
// 규칙: 저장값에는 단위를 넣지 않는다. 단위(units/days, 개/일)는
//       화면에 "고정 라벨"로만 표시하고 데이터에는 저장하지 않는다.
// ─────────────────────────────────────────────────────────────

// 공급자 유형 (한글 라벨 = 선택지)
export const SUPPLIER_TYPE_OPTIONS = SUPPLIER_TYPES.map((t) => t.ko) // 패키징 / 원료 / 부자재
export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((p) => p.ko) // 스킨케어 …

export const COUNTRY_OPTIONS = ['South Korea', 'China', 'Japan', 'United States', 'France', 'Other']

// 숫자 구간만 — 단위 없음
export const MOQ_RANGE_OPTIONS = ['5,000 - 10,000', '10,000 - 15,000', '15,000 - 20,000', '20,000 - 25,000', '25,000 - 30,000', '30,000+', '협의']
export const LEADTIME_RANGE_OPTIONS = ['15 - 30', '30 - 45', '45 - 60', '45 - 90', '60 - 120', '협의']

export const CERTIFICATION_OPTIONS = ['ISO 22716', 'CGMP', 'GMPC', 'Vegan', 'Halal', 'COSMOS Organic', 'Cruelty-free', 'EWG Green', 'K-Beauty Certified']
export const EXPORT_MARKET_OPTIONS = ['United States', 'Canada', 'EU Countries', 'United Kingdom', 'Japan', 'China', 'Southeast Asia', 'Middle East', 'Australia', 'Latin America']

export const YN_OPTIONS = ['Y', 'N']

// 전시
export const EXHIBITION_REGION_OPTIONS = ['KR', 'ASIA', 'EU', 'ME', 'JP', 'US']
export const EXHIBITION_STATUS_OPTIONS = ['예정', '종료', '준비중']

// ── 단위 고정 라벨 (화면 표시 전용) ──
export const MOQ_UNIT = { en: 'units', ko: '개' }
export const LEADTIME_UNIT = { en: 'days', ko: '일' }

// 저장된 값에서 혹시 섞여 들어온 단위를 떼어 깨끗한 구간만 남긴다
export const stripMoqUnit = (v: string) => String(v || '').replace(/\s*(units?|개|pcs\.?)\s*$/i, '').trim()
export const stripLeadUnit = (v: string) => String(v || '').replace(/\s*(days?|일)\s*$/i, '').trim()

const hasKorean = (v: string) => /[가-힣]/.test(v) // '협의' 등 → 단위 안 붙임

// 화면 표시용: 깨끗한 구간 + 고정 단위
export function formatMoq(v: string, lang: 'en' | 'ko' = 'en'): string {
  const c = stripMoqUnit(v)
  if (!c) return 'N/A'
  return hasKorean(c) ? c : `${c} ${lang === 'ko' ? MOQ_UNIT.ko : MOQ_UNIT.en}`
}
export function formatLeadTime(v: string, lang: 'en' | 'ko' = 'en'): string {
  const c = stripLeadUnit(v)
  if (!c) return 'N/A'
  return hasKorean(c) ? c : `${c} ${lang === 'ko' ? LEADTIME_UNIT.ko : LEADTIME_UNIT.en}`
}
