import ExcelJS from 'exceljs'
import {
  SUPPLIER_TYPE_OPTIONS, COUNTRY_OPTIONS, MOQ_RANGE_OPTIONS, LEADTIME_RANGE_OPTIONS,
  YN_OPTIONS, EXHIBITION_REGION_OPTIONS, EXHIBITION_STATUS_OPTIONS, PRODUCT_CATEGORY_OPTIONS,
  CERTIFICATION_OPTIONS, EXPORT_MARKET_OPTIONS,
} from './options'

export type SheetKind = 'supplier' | 'exhibition'

// 유형표기 제안값 (드롭다운 제시 + 직접 입력도 허용)
const TYPE_LABEL_EN = ['OEM/ODM', 'ODM', 'OEM', 'Ingredient Supplier', 'Packaging Supplier', 'Materials Supplier', 'Full-service Manufacturer']
const TYPE_LABEL_KO = ['완제품 제조(OEM/ODM)', 'ODM 제조', 'OEM 제조', '원료 공급사', '패키징 공급사', '부자재 공급사']

// 헤더별 설정
//  dropdown : 선택 목록. strict=false 면 목록 밖 값도 직접 입력 허용(제안형).
//  note     : 자유·복수 입력 안내
type ColSpec = { header: string; dropdown?: string[]; strict?: boolean; note?: string; width?: number }

const SUPPLIER_COLS: ColSpec[] = [
  { header: '번호', note: '항목의 고유 번호. 같은 번호로 다시 올리면 수정됩니다. 비워두면 신규.', width: 8 },
  { header: '업체명', note: '필수 입력', width: 20 },
  { header: '공급자유형', dropdown: SUPPLIER_TYPE_OPTIONS, strict: true, width: 12 },
  { header: '제품군1', dropdown: PRODUCT_CATEGORY_OPTIONS, strict: true, note: '제품군을 드롭다운에서 선택. 여러 개면 제품군2·3 칸에 이어서 선택하세요.', width: 12 },
  { header: '제품군2', dropdown: PRODUCT_CATEGORY_OPTIONS, strict: true, note: '두 번째 제품군 (없으면 비움)', width: 12 },
  { header: '제품군3', dropdown: PRODUCT_CATEGORY_OPTIONS, strict: true, note: '세 번째 제품군 (없으면 비움)', width: 12 },
  { header: '유형표기(EN)', dropdown: TYPE_LABEL_EN, strict: false, note: '목록에서 선택하거나 직접 입력', width: 18 },
  { header: '유형표기(KO)', dropdown: TYPE_LABEL_KO, strict: false, note: '목록에서 선택하거나 직접 입력', width: 18 },
  { header: '국가', dropdown: COUNTRY_OPTIONS, strict: true, width: 14 },
  { header: '소재지(EN)', note: '예: Seoul, Korea', width: 16 },
  { header: '소재지(KO)', note: '예: 서울, 한국', width: 14 },
  { header: 'MOQ', dropdown: MOQ_RANGE_OPTIONS, strict: true, note: '단위(개/units)는 화면에 자동 표기됩니다. 숫자 구간만 선택.', width: 16 },
  { header: '리드타임', dropdown: LEADTIME_RANGE_OPTIONS, strict: true, note: '단위(일/days)는 화면에 자동 표기됩니다. 숫자 구간만 선택.', width: 14 },
  { header: '웹사이트', note: 'https://...', width: 22 },
  { header: '연락이메일', note: 'name@company.com', width: 22 },
  { header: '설명(EN)', note: '영문 소개 (비우면 EN 번역 활용)', width: 28 },
  { header: '설명(KO)', note: '국문 소개', width: 28 },
  { header: '인증', note: '여러 개 · 세로줄(|)로 구분. 값: ' + CERTIFICATION_OPTIONS.join(' / '), width: 24 },
  { header: '수출시장', note: '여러 개 · 세로줄(|)로 구분. 값: ' + EXPORT_MARKET_OPTIONS.join(' / '), width: 24 },
  { header: '이미지URL', note: 'https://... (비워도 됨)', width: 22 },
  { header: '검증', dropdown: YN_OPTIONS, strict: true, width: 8 },
  { header: '추천', dropdown: YN_OPTIONS, strict: true, width: 8 },
]

const EXHIBITION_COLS: ColSpec[] = [
  { header: '번호', note: '항목의 고유 번호. 같은 번호로 다시 올리면 수정됩니다. 비워두면 신규.', width: 8 },
  { header: '제목(EN)', note: '영문 전시명', width: 24 },
  { header: '제목(KO)', note: '국문 전시명 (필수)', width: 24 },
  { header: '기간', note: '예: 2026-09-15 ~ 2026-09-18', width: 22 },
  { header: '지역', dropdown: EXHIBITION_REGION_OPTIONS, strict: true, width: 10 },
  { header: '장소(EN)', note: '예: COEX Seoul', width: 20 },
  { header: '장소(KO)', note: '예: 코엑스 서울', width: 16 },
  { header: '상태', dropdown: EXHIBITION_STATUS_OPTIONS, strict: true, width: 10 },
  { header: '설명(EN)', note: '영문 설명', width: 28 },
  { header: '설명(KO)', note: '국문 설명', width: 28 },
  { header: '이미지URL', note: 'https://... (비워도 됨)', width: 22 },
  { header: '연결공급사번호', note: '공급사 번호 · 세로줄(|)로 구분 예: 1|2', width: 16 },
  { header: '연결기사번호', note: '기사 번호 · 세로줄(|)로 구분 예: 3', width: 14 },
]

const SUPPLIER_EXAMPLES: (string | number)[][] = [
  ['1', '뷰티소스코리아', '원료', '스킨케어', '기능성케어', '', 'Ingredient Supplier', '원료 공급사', 'South Korea', 'Seoul, Korea', '서울, 한국', '15,000 - 20,000', '45 - 90', 'https://example.com', 'contact@example.com', 'Premium skincare ingredients', '프리미엄 스킨케어 원료', 'ISO 22716|CGMP', 'United States|Japan', '', 'Y', 'N'],
  ['2', '케이팩글로벌', '패키징', '향', '메이크업', '', 'Packaging Supplier', '패키징 공급사', 'South Korea', 'Busan, Korea', '부산, 한국', '5,000 - 10,000', '30 - 45', '', '', 'Luxury cosmetic packaging', '럭셔리 화장품 패키징', 'ISO 22716', 'EU Countries', '', 'Y', 'Y'],
]
const EXHIBITION_EXAMPLES: (string | number)[][] = [
  ['1', 'K-Beauty Expo Korea 2026', 'K-뷰티 엑스포 코리아 2026', '2026-09-15 ~ 2026-09-18', 'KR', 'COEX Seoul', 'COEX 서울', '예정', 'Largest K-beauty B2B exhibition', '국내 최대 K-뷰티 B2B 전시회', '', '1|2', ''],
  ['2', 'Cosmoprof Asia', '코스모프로프 아시아', '2025-11-12 ~ 2025-11-14', 'ASIA', 'Hong Kong Convention Center', '홍콩 컨벤션 센터', '종료', 'Asia beauty trade show', '아시아 뷰티 무역 박람회', '', '', ''],
]

const CONFIG: Record<SheetKind, { cols: ColSpec[]; examples: (string | number)[][]; sheetName: string; label: string }> = {
  supplier: { cols: SUPPLIER_COLS, examples: SUPPLIER_EXAMPLES, sheetName: '공급사', label: '공급사' },
  exhibition: { cols: EXHIBITION_COLS, examples: EXHIBITION_EXAMPLES, sheetName: '전시', label: '전시' },
}

const colLetter = (n: number) => { // 1 → A
  let s = ''
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26) }
  return s
}

const LAST_ROW = 500 // 드롭다운·검증을 적용할 마지막 행

export async function buildTemplateWorkbook(kind: SheetKind): Promise<Buffer> {
  const cfg = CONFIG[kind]
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet(cfg.sheetName, { views: [{ state: 'frozen', ySplit: 1 }] })
  // 드롭다운 목록을 담을 숨김 시트 (콤마 포함 값을 안전하게 참조하기 위함)
  const lists = wb.addWorksheet('옵션목록')
  lists.state = 'veryHidden'

  // 헤더 행
  const headers = cfg.cols.map((c) => c.header)
  ws.getRow(1).values = headers
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D9E75' } }
  ws.getRow(1).alignment = { vertical: 'middle' }
  ws.getRow(1).height = 22

  // 열 너비 + 헤더 셀 메모(설명) + 드롭다운
  cfg.cols.forEach((col, i) => {
    const cIdx = i + 1
    ws.getColumn(cIdx).width = col.width || 16
    // 헤더 셀에 안내 메모
    const noteParts = [col.dropdown ? '아래 목록에서 선택하세요.' : '', col.note || ''].filter(Boolean)
    if (noteParts.length) ws.getCell(`${colLetter(cIdx)}1`).note = noteParts.join('\n')
  })

  // 예시 행 입력
  cfg.examples.forEach((ex, r) => { ws.getRow(2 + r).values = ex })

  // 드롭다운(데이터 유효성) — 값은 숨김 시트에 세로로 넣고 범위 참조
  let listCol = 1
  cfg.cols.forEach((col, i) => {
    if (!col.dropdown || !col.dropdown.length) return
    const L = colLetter(listCol)
    col.dropdown.forEach((opt, r) => { lists.getCell(`${L}${r + 1}`).value = opt })
    const ref = `옵션목록!$${L}$1:$${L}$${col.dropdown.length}`
    const target = colLetter(i + 1)
    const strict = col.strict !== false
    for (let row = 2; row <= LAST_ROW; row++) {
      ws.getCell(`${target}${row}`).dataValidation = {
        type: 'list', allowBlank: true, formulae: [ref],
        // strict: 목록 밖 값 거부 / 제안형(false): 직접 입력도 허용
        showErrorMessage: strict, errorStyle: 'stop',
        errorTitle: '목록에서 선택', error: '드롭다운 목록의 값 중 하나를 선택하세요.',
      }
    }
    listCol++
  })

  const buf = await wb.xlsx.writeBuffer()
  return Buffer.from(buf)
}

// 업로드된 .xlsx → 문자열 2차원 배열 (헤더 포함)
export async function parseWorkbook(buffer: Buffer): Promise<string[][]> {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(buffer as any)
  const ws = wb.worksheets.find((w) => w.state !== 'veryHidden' && w.state !== 'hidden') || wb.worksheets[0]
  if (!ws) return []
  const rows: string[][] = []
  const cellText = (v: any): string => {
    if (v == null) return ''
    if (typeof v === 'object') {
      if ('text' in v) return String((v as any).text)
      if ('result' in v) return String((v as any).result)
      if ('richText' in v) return (v as any).richText.map((t: any) => t.text).join('')
      if ('hyperlink' in v) return String((v as any).text ?? (v as any).hyperlink)
    }
    return String(v)
  }
  ws.eachRow({ includeEmpty: false }, (row) => {
    const arr: string[] = []
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => { arr[colNumber - 1] = cellText(cell.value).trim() })
    for (let i = 0; i < arr.length; i++) if (arr[i] == null) arr[i] = ''
    rows.push(arr)
  })
  return rows
}
