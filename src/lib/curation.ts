// 추천·큐레이션 평가지표 (서비스 정책 04). 관리자 입력·공급사 상세·환산이 공유하는 단일 출처.
export const CURATION_DIMENSIONS = [
  { key: 'verification', ko: '검증·신뢰', en: 'Verification & Trust', weight: 20 },
  { key: 'quality', ko: '품질·규제', en: 'Quality & Compliance', weight: 20 },
  { key: 'production', ko: '생산 역량', en: 'Production Capability', weight: 15 },
  { key: 'track', ko: '실적·트랙레코드', en: 'Track Record', weight: 15 },
  { key: 'response', ko: '대응·커뮤니케이션', en: 'Responsiveness', weight: 15 },
  { key: 'flexibility', ko: '유연성', en: 'Flexibility', weight: 10 },
  { key: 'sustainability', ko: '지속가능성·윤리', en: 'Sustainability', weight: 5 },
] as const

export type CurationScores = Record<string, number>

export interface Curation {
  scores?: CurationScores      // 각 항목 0~5
  recommendation?: string      // 큐레이터 추천 사유 (왜)
  curator?: string             // 큐레이터/앰배서더 (누가)
  sponsored?: boolean          // 유료 노출 표시
  total?: number               // 0~100 (자동 환산)
  evaluatedAt?: string
}

// 각 항목(0~5) × 가중치 → 0~100 환산
export function computeCurationTotal(scores?: CurationScores): number {
  if (!scores) return 0
  let total = 0
  for (const d of CURATION_DIMENSIONS) {
    const s = Number(scores[d.key]) || 0
    total += (Math.max(0, Math.min(5, s)) / 5) * d.weight
  }
  return Math.round(total)
}

export const CURATION_VERIFIED_THRESHOLD = 70   // 이상 = 검증
export const CURATION_PICK_THRESHOLD = 85       // 이상 = 앰배서더 픽(제안)

export function curationBadge(total: number): 'pick' | 'verified' | null {
  if (total >= CURATION_PICK_THRESHOLD) return 'pick'
  if (total >= CURATION_VERIFIED_THRESHOLD) return 'verified'
  return null
}
