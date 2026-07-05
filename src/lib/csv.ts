import { SUPPLIER_TYPES, PRODUCT_CATEGORIES } from './types'
import { stripMoqUnit, stripLeadUnit } from './options'

// ── Generic CSV parse / serialize (handles quotes, commas, newlines) ──
export function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  const s = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else field += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
      else field += c
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  // drop trailing empty rows
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

function esc(v: string): string {
  if (/[",\n]/.test(v)) return '"' + v.replace(/"/g, '""') + '"'
  return v
}
export function toCSV(rows: (string | number)[][]): string {
  return rows.map((r) => r.map((c) => esc(String(c ?? ''))).join(',')).join('\n')
}

// ── Supplier CSV schema (Korean headers) ──
export const SUPPLIER_HEADERS = [
  '번호', '업체명', '공급자유형', '제품군', '유형표기(EN)', '유형표기(KO)',
  '국가', '소재지(EN)', '소재지(KO)', 'MOQ', '리드타임',
  '웹사이트', '연락이메일', '설명(EN)', '설명(KO)', '인증', '수출시장', '이미지URL', '검증', '추천',
]

const bool = (v: any) => /^(y|yes|true|1|o|검증|추천)$/i.test(String(v ?? '').trim())
const koToTypeCode = (v: string) => SUPPLIER_TYPES.find((t) => t.ko === v.trim() || t.en === v.trim() || t.code === v.trim())?.code || v.trim()
const koToProductCode = (v: string) => PRODUCT_CATEGORIES.find((p) => p.ko === v.trim() || p.en === v.trim() || p.code === v.trim())?.code || v.trim()
const typeCodeToKo = (code: string) => SUPPLIER_TYPES.find((t) => t.code === code)?.ko || code
const productCodeToKo = (code: string) => PRODUCT_CATEGORIES.find((p) => p.code === code)?.ko || code
const splitPipe = (v: string) => String(v || '').split('|').map((x) => x.trim()).filter(Boolean)

// Existing supplier → CSV row
export function supplierToRow(s: any): (string | number)[] {
  return [
    s.id || '',
    s.name || '',
    typeCodeToKo(s.category || ''),
    (s.productCategories || []).map(productCodeToKo).join('|'),
    s.supplierType?.en || '', s.supplierType?.ko || '',
    s.country || '',
    s.location?.en || '', s.location?.ko || '',
    stripMoqUnit(s.moqRange || ''), stripLeadUnit(s.leadTimeRange || ''),
    s.website || '', s.contact || '',
    s.description?.en || '', s.description?.ko || '',
    (s.certifications || []).join('|'),
    (s.exportMarkets || []).join('|'),
    s.image || '',
    s.verified ? 'Y' : 'N', s.featured ? 'Y' : 'N',
  ]
}

// CSV row (with header map) → supplier object + optional id
export function rowToSupplier(get: (h: string) => string): { id?: string; data: any; error?: string } {
  const name = get('업체명').trim()
  if (!name) return { data: null, error: '업체명이 비어 있습니다' }
  const id = get('번호').trim() || undefined
  // 제품군: 단일 '제품군'(CSV·내보내기, |구분) 또는 '제품군1/2/3'(엑셀 양식) 모두 허용
  const productRaw = [get('제품군'), get('제품군1'), get('제품군2'), get('제품군3')].flatMap(splitPipe)
  const productCategories = Array.from(new Set(productRaw.map(koToProductCode).filter(Boolean)))
  const data = {
    name,
    category: koToTypeCode(get('공급자유형')) || 'Packaging',
    productCategories,
    supplierType: { en: get('유형표기(EN)'), ko: get('유형표기(KO)') },
    country: get('국가') || 'South Korea',
    location: { en: get('소재지(EN)'), ko: get('소재지(KO)') },
    moq: 0,
    leadTime: 0,
    moqRange: stripMoqUnit(get('MOQ')),
    leadTimeRange: stripLeadUnit(get('리드타임')),
    website: get('웹사이트'),
    contact: get('연락이메일'),
    description: { en: get('설명(EN)'), ko: get('설명(KO)') },
    descriptionFull: { en: '', ko: '' },
    coreStrengths: { en: [], ko: [] },
    capabilities: { en: [], ko: [] },
    regulatoryNotes: { en: '', ko: '' },
    certifications: splitPipe(get('인증')),
    exportMarkets: splitPipe(get('수출시장')),
    image: get('이미지URL'),
    verified: bool(get('검증')),
    featured: bool(get('추천')),
    ambassadorPick: false,
    exportExperience: true,
    files: [],
    exhibitionIds: [],
  }
  return { id, data }
}

// ── Exhibition CSV schema (Korean headers) ──
export const EXHIBITION_HEADERS = [
  '번호', '제목(EN)', '제목(KO)', '기간', '지역', '장소(EN)', '장소(KO)',
  '상태', '설명(EN)', '설명(KO)', '이미지URL', '연결공급사번호', '연결기사번호',
]

const STATUS_KO: Record<string, string> = { upcoming: '예정', past: '종료', planning: '준비중' }
const koToStatus = (v: string): 'upcoming' | 'past' | 'planning' => {
  const t = String(v || '').trim().toLowerCase()
  if (/^(past|종료|지난|완료)$/.test(t)) return 'past'
  if (/^(planning|준비중|준비|기획)$/.test(t)) return 'planning'
  return 'upcoming'
}

// Existing exhibition → CSV row
export function exhibitionToRow(e: any): (string | number)[] {
  return [
    e.id || '',
    e.title?.en || '', e.title?.ko || '',
    e.dateRange || '',
    e.region || '',
    e.location?.en || '', e.location?.ko || '',
    STATUS_KO[e.status] || e.status || '예정',
    e.description?.en || '', e.description?.ko || '',
    e.image || '',
    (e.supplierIds || []).join('|'),
    (e.articleIds || []).join('|'),
  ]
}

// CSV row (with header map) → exhibition object + optional id
export function rowToExhibition(get: (h: string) => string): { id?: string; data: any; error?: string } {
  const titleEn = get('제목(EN)').trim()
  const titleKo = get('제목(KO)').trim()
  if (!titleEn && !titleKo) return { data: null, error: '제목이 비어 있습니다' }
  const id = get('번호').trim() || undefined
  const data = {
    title: { en: titleEn, ko: titleKo || titleEn },
    dateRange: get('기간'),
    region: get('지역').trim() || 'KR',
    location: { en: get('장소(EN)'), ko: get('장소(KO)') },
    status: koToStatus(get('상태')),
    description: { en: get('설명(EN)'), ko: get('설명(KO)') },
    image: get('이미지URL'),
    supplierIds: splitPipe(get('연결공급사번호')),
    articleIds: splitPipe(get('연결기사번호')),
  }
  return { id, data }
}

// 참고: 다운로드 양식은 이제 .xlsx (드롭다운 포함, src/lib/xlsx.ts) 로 제공한다.
// CSV 파싱/직렬화(위 함수들)는 .csv 업로드 및 현재 데이터 내보내기에 계속 사용된다.
