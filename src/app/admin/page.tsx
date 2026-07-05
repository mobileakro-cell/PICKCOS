'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { Supplier, Article, Exhibition, BL, BLArray } from '@/lib/types'
import { bl, blArr, SUPPLIER_TYPES, PRODUCT_CATEGORIES } from '@/lib/types'
import { parseCSV, toCSV, SUPPLIER_HEADERS, supplierToRow, rowToSupplier, EXHIBITION_HEADERS, exhibitionToRow, rowToExhibition } from '@/lib/csv'
import { COUNTRY_OPTIONS, MOQ_RANGE_OPTIONS, LEADTIME_RANGE_OPTIONS, CERTIFICATION_OPTIONS, EXPORT_MARKET_OPTIONS } from '@/lib/options'

// Trigger a CSV file download (BOM prefix so Excel reads Korean correctly)
function downloadCSV(filename: string, text: string) {
  const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// --------------- Auth types ---------------
type AdminRole = 'super' | 'admin'
interface AdminUser {
  id: string
  role: AdminRole
  name: string
}

// Shapes below mirror what the API actually stores (see /api/inquiries,
// /api/matching-requests, /api/register).
interface InquiryRequest {
  id: string
  inquiryType: string
  category: string
  targetMarkets: string[]
  description: string
  topic?: string
  supplierId?: string
  createdAt: string
  status: 'new' | 'reviewed' | 'matched' | 'closed'
}

interface MatchingRequest {
  id: string
  requestType: string
  category: string
  conceptKeywords: string
  targetMarkets: string[]
  moqTarget?: string
  timeline?: string
  companyName: string
  personName: string
  email: string
  country: string
  supplierId?: string
  createdAt: string
  status: 'new' | 'in_progress' | 'matched' | 'closed'
}

interface MemberSignup {
  id: string
  company: string
  name: string
  email: string
  role?: string
  country?: string
  interest?: string
  createdAt: string
}

type TabType = 'inquiries' | 'matching' | 'members' | 'suppliers' | 'articles' | 'exhibitions' | 'settings'

// --------------- Bilingual helpers ---------------
const emptyBL: BL = { en: '', ko: '' }
const emptyBLArr: BLArray = { en: [], ko: [] }

// BilingualInput component for dual-language fields
function BilingualInput({ label, value, onChange, multiline = false, required = false }: {
  label: string
  value: BL
  onChange: (val: BL) => void
  multiline?: boolean
  required?: boolean
}) {
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div className="md:col-span-2 space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label} {required && '*'}</label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">KO</span>
          <Tag
            value={value?.ko || ''}
            onChange={(e: any) => onChange({ ...value, ko: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
            {...(multiline ? { rows: 3 } : {})}
          />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">EN</span>
          <Tag
            value={value?.en || ''}
            onChange={(e: any) => onChange({ ...value, en: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
            {...(multiline ? { rows: 3 } : {})}
          />
        </div>
      </div>
    </div>
  )
}

// BilingualArrayInput for comma-separated bilingual arrays
function BilingualArrayInput({ label, value, onChange }: {
  label: string
  value: BLArray
  onChange: (val: BLArray) => void
}) {
  const commaToArr = (val: string) => val.split(',').map(s => s.trim()).filter(Boolean)
  const arrToComma = (arr: string[]) => (arr || []).join(', ')
  return (
    <div className="md:col-span-2 space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">KO (쉼표로 구분)</span>
          <input
            type="text"
            value={arrToComma(value?.ko || [])}
            onChange={e => onChange({ ...value, ko: commaToArr(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">EN (쉼표로 구분)</span>
          <input
            type="text"
            value={arrToComma(value?.en || [])}
            onChange={e => onChange({ ...value, en: commaToArr(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>
    </div>
  )
}

// --------------- Default form values ---------------
// 선택형 옵션은 공용 모듈(@/lib/options)에서 가져온다 — 단위 없는 구간값

// Ready-to-copy prompt: paste into Claude with a KO-filled CSV to auto-fill the EN columns.
const TRANSLATE_PROMPT = `아래 CSV의 한국어(KO) 열 내용을 참고해서, 비어 있는 영어(EN) 열을 채워줘.

규칙:
1. 열 순서·개수·헤더는 그대로 유지하고, 결과는 CSV 형식으로만 출력해.
2. 값 안에 쉼표(,)나 줄바꿈이 있으면 큰따옴표(")로 감싸.
3. 브랜드명·업체명·인증명(ISO 22716, CGMP 등)·번호·URL·이메일은 번역하지 말고 원문 그대로 둬.
4. 이미 EN 값이 있으면 그대로 두고, 빈 칸만 채워.
5. 뷰티 B2B 소싱 맥락에 맞는 자연스럽고 간결한 비즈니스 영어로 번역해.

용어집(반드시 이대로 사용):
- 원료 → Ingredients
- 부자재 → Materials
- 패키징 → Packaging
- 스킨케어 → Skincare
- 기능성케어 → Functional care
- 메이크업 → Makeup
- 헤어 → Hair
- 바디 → Body
- 향 → Fragrance

CSV는 아래에 붙여넣을게. (행이 많으면 200~500행씩 나눠서 요청)
---
[여기에 CSV 붙여넣기]`

// Image upload button → Supabase Storage (server route). Fills the image URL on success.
function ImageUpload({ keyBase, onUploaded }: { keyBase: string; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', f)
      fd.append('key', keyBase)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const d = await res.json().catch(() => ({}))
      if (res.ok && d.url) onUploaded(d.url)
      else alert('업로드 실패: ' + (d.error || '다시 로그인 후 시도해 주세요.'))
    } catch {
      alert('업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }
  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" onChange={handle} className="hidden" />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="mt-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
        {uploading ? '업로드 중…' : '📁 파일 업로드'}
      </button>
    </>
  )
}

const emptySupplier: Omit<Supplier, 'id'> = {
  name: '', supplierType: { ...emptyBL }, category: 'Packaging', productCategories: [], image: '', location: { ...emptyBL }, country: 'South Korea',
  featured: false, verified: true, ambassadorPick: false, certifications: [], moq: 1000, leadTime: 45,
  moqRange: '', leadTimeRange: '', description: { ...emptyBL }, descriptionFull: { ...emptyBL }, coreStrengths: { ...emptyBLArr },
  capabilities: { ...emptyBLArr }, regulatoryNotes: { ...emptyBL }, exportMarkets: [], files: [], website: '', contact: '',
  exportExperience: true, exhibitionIds: [],
}

const emptyArticle: Omit<Article, 'id'> = {
  slug: '', title: { ...emptyBL }, summary: { ...emptyBL }, content: { ...emptyBL }, category: 'MARKET',
  region: 'Global', tags: { ...emptyBLArr }, publishedAt: new Date().toISOString().slice(0, 10), image: '', author: '',
  isHeadline: false, contentBlocks: [], relatedSuppliers: [],
}

const emptyExhibition: Omit<Exhibition, 'id'> = {
  title: { ...emptyBL }, dateRange: '', location: { ...emptyBL }, region: 'KR', image: '',
  status: 'upcoming', description: { ...emptyBL }, supplierIds: [], articleIds: [],
}

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  // --------------- Auth state ---------------
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loginId, setLoginId] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Check sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('adminUser')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loginId, password: loginPw }),
      })
      const data = await res.json()
      if (!res.ok) {
        setLoginError(data.error || '로그인에 실패했습니다')
      } else {
        setUser(data.user)
        sessionStorage.setItem('adminUser', JSON.stringify(data.user))
      }
    } catch {
      setLoginError('네트워크 오류가 발생했습니다')
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    setUser(null)
    sessionStorage.removeItem('adminUser')
  }

  const isSuper = user?.role === 'super'

  const [activeTab, setActiveTab] = useState<TabType>('inquiries')

  // --- Inquiries / Matching / Members (fetched from API) ---
  const [inquiries, setInquiries] = useState<InquiryRequest[]>([])
  const [matchingRequests, setMatchingRequests] = useState<MatchingRequest[]>([])
  const [members, setMembers] = useState<MemberSignup[]>([])

  // --- Suppliers / Articles / Exhibitions (fetched from API) ---
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])

  // --- Modal state ---
  const [modalType, setModalType] = useState<'supplier' | 'article' | 'exhibition' | null>(null)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingSupplier, setEditingSupplier] = useState<any>(emptySupplier)
  const [editingArticle, setEditingArticle] = useState<any>(emptyArticle)
  const [editingExhibition, setEditingExhibition] = useState<any>(emptyExhibition)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const [showForms, setShowForms] = useState(false)
  const [csvPreview, setCsvPreview] = useState<null | { kind: 'supplier' | 'exhibition'; items: { id?: string; data: any; error?: string }[]; newCount: number; updateCount: number; errorCount: number }>(null)
  const [importing, setImporting] = useState(false)
  const csvInputRef = useRef<HTMLInputElement>(null)

  // --- Settings ---
  const [siteSettings, setSiteSettings] = useState({
    heroBackgroundImage: '/images/bg-hero.svg',
    heroTitle: 'WHERE K-BEAUTY\nMEETS THE\nWORLD',
    heroSubtitle: 'K-Beauty Media Platform',
    heroDescription: 'Connecting Korean beauty brands with global markets through stories, insights, and partnerships. Your trusted media bridge to K-Beauty innovation.'
  })
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)

  // --------------- Data fetching ---------------
  const fetchSuppliers = useCallback(async () => {
    const res = await fetch('/api/suppliers?pageSize=100')
    const data = await res.json()
    setSuppliers(data.items || [])
  }, [])

  const fetchArticles = useCallback(async () => {
    const res = await fetch('/api/articles?pageSize=100')
    const data = await res.json()
    setArticles(data.items || [])
  }, [])

  const fetchExhibitions = useCallback(async () => {
    const res = await fetch('/api/exhibitions?pageSize=100')
    const data = await res.json()
    setExhibitions(data.items || [])
  }, [])

  const fetchInquiries = useCallback(async () => {
    const res = await fetch('/api/inquiries?limit=200')
    if (!res.ok) return
    const data = await res.json()
    // API returns oldest→newest; show newest first and default a missing status
    const list: InquiryRequest[] = (data.inquiries || []).map((i: any) => ({ ...i, status: i.status || 'new' }))
    setInquiries(list.reverse())
  }, [])

  const fetchMatching = useCallback(async () => {
    const res = await fetch('/api/matching-requests?limit=200')
    if (!res.ok) return
    const data = await res.json()
    const list: MatchingRequest[] = (data.items || []).map((r: any) => ({ ...r, status: r.status || 'new' }))
    setMatchingRequests(list)
  }, [])

  const fetchMembers = useCallback(async () => {
    const res = await fetch('/api/register?limit=200')
    if (!res.ok) return
    const data = await res.json()
    setMembers(data.members || [])
  }, [])

  useEffect(() => {
    // Wait until logged in — the inquiry/matching/member endpoints are admin-only,
    // so fetching before login (or right after, before this re-runs) would 401.
    if (!user) return
    fetchSuppliers()
    fetchArticles()
    fetchExhibitions()
    fetchInquiries()
    fetchMatching()
    fetchMembers()
    fetch('/api/settings').then(r => r.json()).then(data => setSiteSettings(prev => ({ ...prev, ...data }))).catch(() => {})
  }, [user, fetchSuppliers, fetchArticles, fetchExhibitions, fetchInquiries, fetchMatching, fetchMembers])

  // Delete all sample/demo data (before going live)
  const handleClearSamples = async () => {
    if (!confirm('샘플(데모) 데이터를 모두 삭제할까요?\n이 작업은 되돌릴 수 없습니다.')) return
    try {
      const res = await fetch('/api/admin/clear-samples', { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        await Promise.all([fetchSuppliers(), fetchArticles(), fetchExhibitions()])
        alert(`샘플 데이터 ${data.deleted ?? 0}건을 삭제했습니다.`)
      } else {
        alert('삭제에 실패했습니다. 다시 로그인 후 시도해 주세요.')
      }
    } catch {
      alert('네트워크 오류로 삭제하지 못했습니다.')
    }
  }

  // --------------- CSV (bulk) — 공급사 / 전시 공용 ---------------
  const CSV_CONFIG = {
    supplier: {
      api: '/api/suppliers', label: '공급사', headers: SUPPLIER_HEADERS,
      toRow: supplierToRow, rowTo: rowToSupplier,
      list: suppliers as any[], refetch: fetchSuppliers,
    },
    exhibition: {
      api: '/api/exhibitions', label: '전시', headers: EXHIBITION_HEADERS,
      toRow: exhibitionToRow, rowTo: rowToExhibition,
      list: exhibitions as any[], refetch: fetchExhibitions,
    },
  } as const
  type CSVKind = keyof typeof CSV_CONFIG

  // 엑셀(.xlsx) 드롭다운 양식 다운로드
  const downloadTemplate = (kind: CSVKind) => { window.location.href = `/api/template?kind=${kind}` }

  const exportCSV = (kind: CSVKind) => {
    const c = CSV_CONFIG[kind]
    const rows = [c.headers, ...c.list.map(c.toRow as any)]
    downloadCSV(`${c.label}_${new Date().toISOString().slice(0, 10)}.csv`, toCSV(rows as any))
  }

  const csvKindRef = useRef<CSVKind>('supplier')
  const openCSVPicker = (kind: CSVKind) => { csvKindRef.current = kind; csvInputRef.current?.click() }

  // 파일(.xlsx 또는 .csv) → 문자열 2차원 배열 (헤더 포함)
  const readRows = async (f: File): Promise<string[][]> => {
    if (/\.xlsx$/i.test(f.name)) {
      const fd = new FormData()
      fd.append('file', f)
      const res = await fetch('/api/parse-sheet', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('xlsx parse failed')
      const data = await res.json()
      return (data.rows || []) as string[][]
    }
    return parseCSV(await f.text())
  }

  const handleCSVFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const kind = csvKindRef.current
    const c = CSV_CONFIG[kind]
    try {
      const parsed = await readRows(f)
      if (parsed.length < 2) { alert('데이터 행이 없습니다. 양식 형식을 확인하세요.'); return }
      const header = parsed[0].map((h) => (h || '').trim())
      const idx = (h: string) => header.indexOf(h)
      const numCol = idx('번호')
      // '#' 로 시작하는 안내/주석 줄은 건너뜀
      const dataRows = parsed.slice(1).filter((r) => !String((numCol >= 0 ? r[numCol] : '') ?? '').trim().startsWith('#'))
      const items = dataRows.map((r) => c.rowTo((h) => (idx(h) >= 0 ? (r[idx(h)] ?? '') : '')))
      const valid = items.filter((x) => !x.error)
      const updateCount = valid.filter((x) => x.id && c.list.some((s: any) => s.id === x.id)).length
      setCsvPreview({ kind, items, newCount: valid.length - updateCount, updateCount, errorCount: items.length - valid.length })
    } catch {
      alert('파일을 읽지 못했습니다. 양식(.xlsx 또는 .csv) 형식을 확인하세요.')
    } finally {
      if (csvInputRef.current) csvInputRef.current.value = ''
    }
  }

  const confirmImport = async () => {
    if (!csvPreview) return
    const c = CSV_CONFIG[csvPreview.kind]
    setImporting(true)
    try {
      for (const it of csvPreview.items) {
        if (it.error) continue
        const body = it.id ? { id: it.id, ...it.data } : it.data
        await fetch(c.api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      await c.refetch()
      const ok = csvPreview.items.filter((x) => !x.error).length
      const errs = csvPreview.errorCount
      setCsvPreview(null)
      alert(`${ok}건을 반영했습니다.${errs ? ` (오류 ${errs}건 제외)` : ''}`)
    } catch {
      alert('업로드 중 오류가 발생했습니다.')
    } finally {
      setImporting(false)
    }
  }

  // --------------- CRUD handlers ---------------
  // Supplier
  const openSupplierModal = (mode: 'add' | 'edit', supplier?: Supplier) => {
    setModalMode(mode)
    setModalType('supplier')
    if (mode === 'edit' && supplier) {
      setEditingId(supplier.id)
      setEditingSupplier({ ...supplier })
    } else {
      setEditingId(null)
      setEditingSupplier({ ...emptySupplier })
    }
  }

  const saveSupplier = async () => {
    setSaving(true)
    if (modalMode === 'add') {
      await fetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingSupplier) })
    } else {
      await fetch('/api/suppliers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...editingSupplier }) })
    }
    await fetchSuppliers()
    setModalType(null)
    setSaving(false)
  }

  const handleDeleteSupplier = async (id: string) => {
    await fetch(`/api/suppliers?id=${id}`, { method: 'DELETE' })
    await fetchSuppliers()
    setDeleteConfirm(null)
  }

  // Article
  const openArticleModal = (mode: 'add' | 'edit', article?: Article) => {
    setModalMode(mode)
    setModalType('article')
    if (mode === 'edit' && article) {
      setEditingId(article.id)
      setEditingArticle({ ...article })
    } else {
      setEditingId(null)
      setEditingArticle({ ...emptyArticle, publishedAt: new Date().toISOString().slice(0, 10) })
    }
  }

  const saveArticle = async () => {
    setSaving(true)
    const titleForSlug = typeof editingArticle.title === 'string' ? editingArticle.title : (editingArticle.title?.en || '')
    const payload = { ...editingArticle, slug: editingArticle.slug || titleForSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
    if (modalMode === 'add') {
      await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } else {
      await fetch('/api/articles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...payload }) })
    }
    await fetchArticles()
    setModalType(null)
    setSaving(false)
  }

  const handleDeleteArticle = async (id: string) => {
    await fetch(`/api/articles?id=${id}`, { method: 'DELETE' })
    await fetchArticles()
    setDeleteConfirm(null)
  }

  // Exhibition
  const openExhibitionModal = (mode: 'add' | 'edit', exhibition?: Exhibition) => {
    setModalMode(mode)
    setModalType('exhibition')
    if (mode === 'edit' && exhibition) {
      setEditingId(exhibition.id)
      setEditingExhibition({ ...exhibition })
    } else {
      setEditingId(null)
      setEditingExhibition({ ...emptyExhibition })
    }
  }

  const saveExhibition = async () => {
    setSaving(true)
    if (modalMode === 'add') {
      await fetch('/api/exhibitions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingExhibition) })
    } else {
      await fetch('/api/exhibitions', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...editingExhibition }) })
    }
    await fetchExhibitions()
    setModalType(null)
    setSaving(false)
  }

  const handleDeleteExhibition = async (id: string) => {
    await fetch(`/api/exhibitions?id=${id}`, { method: 'DELETE' })
    await fetchExhibitions()
    setDeleteConfirm(null)
  }

  // --- Other handlers ---
  const updateInquiryStatus = async (id: string, status: InquiryRequest['status']) => {
    const prev = inquiries
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status } : inq)) // optimistic
    const res = await fetch('/api/inquiries', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }),
    }).catch(() => null)
    if (!res || !res.ok) { setInquiries(prev); alert('상태 저장에 실패했습니다.') }
  }

  const updateMatchingStatus = async (id: string, status: MatchingRequest['status']) => {
    const prev = matchingRequests
    setMatchingRequests(matchingRequests.map(req => req.id === id ? { ...req, status } : req)) // optimistic
    const res = await fetch('/api/matching-requests', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }),
    }).catch(() => null)
    if (!res || !res.ok) { setMatchingRequests(prev); alert('상태 저장에 실패했습니다.') }
  }

  const saveSettings = async () => {
    setSettingsLoading(true)
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(siteSettings) })
      if (res.ok) { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 3000) }
    } catch { console.error('Failed to save settings') }
    setSettingsLoading(false)
  }

  const stats = {
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter(i => i.status === 'new').length,
    totalMatching: matchingRequests.length,
    completedMatching: matchingRequests.filter(r => r.status === 'closed').length,
  }

  // --------------- Comma-separated field helper ---------------
  const commaToArr = (val: string) => val.split(',').map(s => s.trim()).filter(Boolean)
  const arrToComma = (arr: string[]) => arr.join(', ')

  // --------------- Login Screen ---------------
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">PICKCOS 관리자</h1>
            <p className="text-gray-500 text-sm">로그인하여 관리자 페이지에 접속</p>
          </div>
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{loginError}</div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input
                type="text"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-lg"
                placeholder="아이디를 입력하세요"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={loginPw}
                onChange={e => setLoginPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-lg"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loginLoading || !loginId || !loginPw}
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors text-lg mt-2"
            >
              {loginLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">사이트로 돌아가기</Link>
          </div>
        </div>
      </div>
    )
  }

  // --------------- Dashboard ---------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">관리자 대시보드</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSuper ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 text-white'}`}>
                {isSuper ? '최고 관리자' : '관리자'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm hidden md:inline">{user.name} ({user.id})</span>
              <Link href="/admin/manual" className="px-4 py-2 bg-white/20 text-white font-semibold rounded hover:bg-white/30 text-sm">
                📖 메뉴얼
              </Link>
              <button onClick={() => setShowForms(true)} className="px-4 py-2 bg-white/20 text-white font-semibold rounded hover:bg-white/30 text-sm">
                📋 양식
              </button>
              <button onClick={() => { setShowPrompt(true); setPromptCopied(false) }} className="px-4 py-2 bg-white/20 text-white font-semibold rounded hover:bg-white/30 text-sm">
                🌐 번역프롬프트
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-white/20 text-white font-semibold rounded hover:bg-white/30">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">총 문의</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.totalInquiries}</p>
            <p className="text-xs text-gray-500 mt-2">신규 {stats.newInquiries}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">매칭 요청</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.totalMatching}</p>
            <p className="text-xs text-gray-500 mt-2">완료 {stats.completedMatching}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">공급사</p>
            <p className="text-3xl font-bold text-primary mt-2">{suppliers.length}</p>
            <p className="text-xs text-gray-500 mt-2">검증 {suppliers.filter(s => s.verified).length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">발행 기사</p>
            <p className="text-3xl font-bold text-primary mt-2">{articles.length}</p>
            <p className="text-xs text-gray-500 mt-2">전시 {exhibitions.length}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b overflow-x-auto">
            {(['inquiries', 'matching', 'members', 'suppliers', 'articles', 'exhibitions', ...(isSuper ? ['settings'] : [])] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-semibold text-center transition-colors whitespace-nowrap ${
                  activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'inquiries' ? `문의 (${stats.totalInquiries})`
                  : tab === 'matching' ? `매칭 (${stats.totalMatching})`
                  : tab === 'members' ? `회원 (${members.length})`
                  : tab === 'suppliers' ? `공급사 (${suppliers.length})`
                  : tab === 'articles' ? `기사 (${articles.length})`
                  : tab === 'exhibitions' ? `전시 (${exhibitions.length})`
                  : '설정'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* =================== Inquiries Tab =================== */}
            {activeTab === 'inquiries' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">문의 목록</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b-2">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">유형</th>
                        <th className="px-4 py-3 text-left">카테고리</th>
                        <th className="px-4 py-3 text-left">타겟 시장</th>
                        <th className="px-4 py-3 text-left">내용</th>
                        <th className="px-4 py-3 text-left">날짜</th>
                        <th className="px-4 py-3 text-left">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">접수된 문의가 없습니다.</td></tr>
                      )}
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="border-b hover:bg-gray-50 align-top">
                          <td className="px-4 py-3 font-semibold text-primary">{inq.id}</td>
                          <td className="px-4 py-3 capitalize">{inq.inquiryType}</td>
                          <td className="px-4 py-3">{inq.category}</td>
                          <td className="px-4 py-3">{(inq.targetMarkets || []).join(', ')}</td>
                          <td className="px-4 py-3 max-w-xs"><div className="line-clamp-2 text-gray-600" title={inq.description}>{inq.description}</div></td>
                          <td className="px-4 py-3 whitespace-nowrap">{(inq.createdAt || '').slice(0, 10)}</td>
                          <td className="px-4 py-3">
                            <select
                              value={inq.status}
                              onChange={(e) => updateInquiryStatus(inq.id, e.target.value as InquiryRequest['status'])}
                              className={`px-3 py-1 rounded font-semibold text-sm ${
                                inq.status === 'new' ? 'bg-yellow-100 text-yellow-700'
                                  : inq.status === 'reviewed' ? 'bg-blue-100 text-blue-700'
                                  : inq.status === 'matched' ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <option value="new">신규</option>
                              <option value="reviewed">검토됨</option>
                              <option value="matched">매칭완료</option>
                              <option value="closed">종료</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =================== Matching Tab =================== */}
            {activeTab === 'matching' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">매칭 요청</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b-2">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">회사</th>
                        <th className="px-4 py-3 text-left">담당자</th>
                        <th className="px-4 py-3 text-left">카테고리</th>
                        <th className="px-4 py-3 text-left">컨셉/키워드</th>
                        <th className="px-4 py-3 text-left">MOQ</th>
                        <th className="px-4 py-3 text-left">날짜</th>
                        <th className="px-4 py-3 text-left">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchingRequests.length === 0 && (
                        <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">접수된 매칭 요청이 없습니다.</td></tr>
                      )}
                      {matchingRequests.map((req) => (
                        <tr key={req.id} className="border-b hover:bg-gray-50 align-top">
                          <td className="px-4 py-3 font-semibold text-primary">{req.id}</td>
                          <td className="px-4 py-3">
                            <div>{req.companyName}</div>
                            <div className="text-gray-500 text-xs">{req.country}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div>{req.personName}</div>
                              <div className="text-gray-500">{req.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{req.category}</td>
                          <td className="px-4 py-3 max-w-xs"><div className="line-clamp-2 text-gray-600" title={req.conceptKeywords}>{req.conceptKeywords}</div></td>
                          <td className="px-4 py-3 whitespace-nowrap">{req.moqTarget || '-'}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{(req.createdAt || '').slice(0, 10)}</td>
                          <td className="px-4 py-3">
                            <select
                              value={req.status}
                              onChange={(e) => updateMatchingStatus(req.id, e.target.value as MatchingRequest['status'])}
                              className={`px-3 py-1 rounded font-semibold text-sm ${
                                req.status === 'new' ? 'bg-yellow-100 text-yellow-700'
                                  : req.status === 'in_progress' ? 'bg-blue-100 text-blue-700'
                                  : req.status === 'matched' ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <option value="new">신규</option>
                              <option value="in_progress">진행중</option>
                              <option value="matched">매칭완료</option>
                              <option value="closed">종료</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =================== Members Tab =================== */}
            {activeTab === 'members' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">회원 등록 목록</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b-2">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">회사</th>
                        <th className="px-4 py-3 text-left">이름</th>
                        <th className="px-4 py-3 text-left">이메일</th>
                        <th className="px-4 py-3 text-left">국가</th>
                        <th className="px-4 py-3 text-left">관심 분야</th>
                        <th className="px-4 py-3 text-left">날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">등록된 회원이 없습니다.</td></tr>
                      )}
                      {members.map((m) => (
                        <tr key={m.id} className="border-b hover:bg-gray-50 align-top">
                          <td className="px-4 py-3 font-semibold text-primary">{m.id}</td>
                          <td className="px-4 py-3">{m.company}</td>
                          <td className="px-4 py-3">
                            <div>{m.name}</div>
                            {m.role && <div className="text-gray-500 text-xs">{m.role}</div>}
                          </td>
                          <td className="px-4 py-3"><a href={`mailto:${m.email}`} className="text-primary hover:underline">{m.email}</a></td>
                          <td className="px-4 py-3">{m.country || '-'}</td>
                          <td className="px-4 py-3 max-w-xs"><div className="line-clamp-2 text-gray-600" title={m.interest}>{m.interest || '-'}</div></td>
                          <td className="px-4 py-3 whitespace-nowrap">{(m.createdAt || '').slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =================== Suppliers Tab =================== */}
            {activeTab === 'suppliers' && (
              <div>
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">공급사 관리</h2>
                  <button onClick={() => openSupplierModal('add')} className="px-4 py-2 bg-primary text-white font-semibold rounded hover:opacity-90">
                    + 공급사 추가
                  </button>
                </div>
                {/* CSV 일괄 도구 */}
                <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
                  <span className="text-sm font-semibold text-gray-600 mr-1">엑셀 일괄</span>
                  <button onClick={() => downloadTemplate('supplier')} className="px-3 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">⬇ 엑셀 양식 다운로드</button>
                  <button onClick={() => openCSVPicker('supplier')} className="px-3 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">⬆ 파일 업로드</button>
                  <button onClick={() => exportCSV('supplier')} className="px-3 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">↧ 현재 데이터 내보내기</button>
                  <span className="text-xs text-gray-400 ml-1">양식(.xlsx)을 받아 드롭다운에서 골라 채운 뒤 업로드하세요. 번호로 신규/수정이 구분됩니다.</span>
                </div>
                <div className="space-y-4">
                  {suppliers.map((s) => (
                    <div key={s.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{s.name}</h3>
                          {(s as any).sample && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">샘플</span>}
                        </div>
                        <p className="text-gray-600 text-sm">ID: {s.id} | {s.category} | {typeof s.location === 'string' ? s.location : s.location?.en}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openSupplierModal('edit', s)} className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary/10">
                          수정
                        </button>
                        <button onClick={() => setDeleteConfirm({ type: 'supplier', id: s.id, name: s.name })} className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                  {suppliers.length === 0 && <p className="text-gray-500 text-center py-8">등록된 공급사가 없습니다.</p>}
                </div>
              </div>
            )}

            {/* =================== Articles Tab =================== */}
            {activeTab === 'articles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">기사 관리</h2>
                  <button onClick={() => openArticleModal('add')} className="px-4 py-2 bg-primary text-white font-semibold rounded hover:opacity-90">
                    + 기사 추가
                  </button>
                </div>
                <div className="space-y-4">
                  {articles.map((a) => (
                    <div key={a.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{typeof a.title === 'string' ? a.title : a.title?.en}</h3>
                          {a.isHeadline && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded uppercase">헤드라인</span>
                          )}
                          {(a as any).sample && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">샘플</span>}
                        </div>
                        <p className="text-gray-600 text-sm">ID: {a.id} | {a.category} | {a.publishedAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openArticleModal('edit', a)} className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary/10">
                          수정
                        </button>
                        <button onClick={() => setDeleteConfirm({ type: 'article', id: a.id, name: typeof a.title === 'string' ? a.title : a.title?.en })} className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                  {articles.length === 0 && <p className="text-gray-500 text-center py-8">등록된 기사가 없습니다.</p>}
                </div>
              </div>
            )}

            {/* =================== Exhibitions Tab =================== */}
            {activeTab === 'exhibitions' && (
              <div>
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">전시 관리</h2>
                  <button onClick={() => openExhibitionModal('add')} className="px-4 py-2 bg-primary text-white font-semibold rounded hover:opacity-90">
                    + 전시 추가
                  </button>
                </div>
                {/* CSV 일괄 도구 */}
                <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
                  <span className="text-sm font-semibold text-gray-600 mr-1">엑셀 일괄</span>
                  <button onClick={() => downloadTemplate('exhibition')} className="px-3 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">⬇ 엑셀 양식 다운로드</button>
                  <button onClick={() => openCSVPicker('exhibition')} className="px-3 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">⬆ 파일 업로드</button>
                  <button onClick={() => exportCSV('exhibition')} className="px-3 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">↧ 현재 데이터 내보내기</button>
                  <span className="text-xs text-gray-400 ml-1">양식(.xlsx)을 받아 드롭다운에서 골라 채운 뒤 업로드하세요. 번호로 신규/수정이 구분됩니다.</span>
                </div>
                <div className="space-y-4">
                  {exhibitions.map((e) => (
                    <div key={e.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{typeof e.title === 'string' ? e.title : e.title?.en}</h3>
                          {(e as any).sample && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">샘플</span>}
                        </div>
                        <p className="text-gray-600 text-sm">ID: {e.id} | {e.dateRange} | {typeof e.location === 'string' ? e.location : e.location?.en}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                          e.status === 'upcoming' ? 'bg-green-100 text-green-700' : e.status === 'past' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                        }`}>{e.status === 'upcoming' ? '예정' : e.status === 'past' ? '종료' : '준비중'}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openExhibitionModal('edit', e)} className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary/10">
                          수정
                        </button>
                        <button onClick={() => setDeleteConfirm({ type: 'exhibition', id: e.id, name: typeof e.title === 'string' ? e.title : e.title?.en })} className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                  {exhibitions.length === 0 && <p className="text-gray-500 text-center py-8">등록된 전시가 없습니다.</p>}
                </div>
              </div>
            )}

            {/* =================== Settings Tab =================== */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">사이트 설정</h2>
                {settingsSaved && (
                  <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">설정이 저장되었습니다.</div>
                )}
                <div className="space-y-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">히어로 배경 이미지</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL</label>
                        <input type="text" value={siteSettings.heroBackgroundImage} onChange={(e) => setSiteSettings(prev => ({ ...prev, heroBackgroundImage: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="이미지 URL 또는 경로 (예: /images/bg-hero.svg)" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">미리보기</label>
                        <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200">
                          <img src={siteSettings.heroBackgroundImage} alt="Hero Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          <div className="absolute inset-0 bg-white/85" />
                          <div className="absolute inset-0 flex items-center justify-center"><p className="text-gray-900 font-bold text-lg">배경 미리보기</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">히어로 텍스트</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
                        <input type="text" value={siteSettings.heroSubtitle} onChange={(e) => setSiteSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">메인 제목 (줄바꿈은 \n 사용)</label>
                        <textarea value={siteSettings.heroTitle} onChange={(e) => setSiteSettings(prev => ({ ...prev, heroTitle: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                      <textarea value={siteSettings.heroDescription} onChange={(e) => setSiteSettings(prev => ({ ...prev, heroDescription: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={saveSettings} disabled={settingsLoading} className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
                      {settingsLoading ? '저장 중...' : '설정 저장'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow text-center text-gray-600 text-sm">
          <p>PICKCOS 관리자 대시보드</p>
        </div>
      </div>

      {/* =================== Floating Add Button =================== */}
      {(activeTab === 'suppliers' || activeTab === 'articles' || activeTab === 'exhibitions') && (
        <button
          onClick={() => {
            if (activeTab === 'suppliers') openSupplierModal('add')
            else if (activeTab === 'articles') openArticleModal('add')
            else if (activeTab === 'exhibitions') openExhibitionModal('add')
          }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gray-900 text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-200 flex items-center justify-center z-40 group"
          title={activeTab === 'suppliers' ? '공급사 추가' : activeTab === 'articles' ? '기사 추가' : '전시 추가'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="absolute right-20 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {activeTab === 'suppliers' ? '공급사 추가' : activeTab === 'articles' ? '기사 추가' : '전시 추가'}
          </span>
        </button>
      )}

      {/* =================== Supplier Modal =================== */}
      {modalType === 'supplier' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalType(null)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{modalMode === 'add' ? '공급사 추가' : '공급사 수정'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ── 기본 정보 ── */}
              <div className="md:col-span-2 mt-2 mb-1 text-sm font-semibold text-gray-500">기본 정보</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">업체명 *</label>
                <input type="text" value={editingSupplier.name} onChange={e => setEditingSupplier({ ...editingSupplier, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">국가</label>
                <select value={editingSupplier.country} onChange={e => setEditingSupplier({ ...editingSupplier, country: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  {[...new Set([editingSupplier.country, ...COUNTRY_OPTIONS].filter(Boolean))].map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <BilingualInput label="지역/소재지" value={editingSupplier.location || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, location: v })} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지 (파일 업로드 또는 URL)</label>
                <input type="text" value={editingSupplier.image} onChange={e => setEditingSupplier({ ...editingSupplier, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="파일 업로드 또는 https:// 붙여넣기" />
                <ImageUpload keyBase={`supplier-${editingId || Date.now()}`} onUploaded={url => setEditingSupplier({ ...editingSupplier, image: url })} />
                {editingSupplier.image && (
                  <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden bg-gray-100 border">
                    <img src={editingSupplier.image} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>

              {/* ── 분류 ── */}
              <div className="md:col-span-2 mt-4 mb-1 text-sm font-semibold text-gray-500">분류</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">공급자 유형 *</label>
                <select value={editingSupplier.category} onChange={e => setEditingSupplier({ ...editingSupplier, category: e.target.value as Supplier['category'] })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  {SUPPLIER_TYPES.map(s => <option key={s.code} value={s.code}>{s.ko} · {s.en}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형 표기 (자유입력)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">KO</span>
                    <input type="text" value={editingSupplier.supplierType?.ko || ''} onChange={e => setEditingSupplier({ ...editingSupplier, supplierType: { ...(editingSupplier.supplierType || emptyBL), ko: e.target.value } })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm" placeholder="OEM 제조업체" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">EN</span>
                    <input type="text" value={editingSupplier.supplierType?.en || ''} onChange={e => setEditingSupplier({ ...editingSupplier, supplierType: { ...(editingSupplier.supplierType || emptyBL), en: e.target.value } })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm" placeholder="OEM Manufacturer" />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">제품군 (복수 선택)</label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.map(p => {
                    const on = (editingSupplier.productCategories || []).includes(p.code)
                    return (
                      <button
                        type="button"
                        key={p.code}
                        onClick={() => {
                          const cur = editingSupplier.productCategories || []
                          const next = on ? cur.filter((x: string) => x !== p.code) : [...cur, p.code]
                          setEditingSupplier({ ...editingSupplier, productCategories: next })
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${on ? 'bg-[var(--color-theme-500)] text-white border-[var(--color-theme-500)]' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                      >
                        {p.ko} · {p.en}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── 사업 조건 ── */}
              <div className="md:col-span-2 mt-4 mb-1 text-sm font-semibold text-gray-500">사업 조건</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">최소주문수량(MOQ) <span className="text-gray-400 font-normal text-xs">· 단위 &lsquo;개&rsquo;는 화면에 자동 표기</span></label>
                <select value={editingSupplier.moqRange} onChange={e => setEditingSupplier({ ...editingSupplier, moqRange: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="">선택 안 함</option>
                  {[...new Set([editingSupplier.moqRange, ...MOQ_RANGE_OPTIONS].filter(Boolean))].map((v: string) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">리드타임 <span className="text-gray-400 font-normal text-xs">· 단위 &lsquo;일&rsquo;은 화면에 자동 표기</span></label>
                <select value={editingSupplier.leadTimeRange} onChange={e => setEditingSupplier({ ...editingSupplier, leadTimeRange: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="">선택 안 함</option>
                  {[...new Set([editingSupplier.leadTimeRange, ...LEADTIME_RANGE_OPTIONS].filter(Boolean))].map((v: string) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">웹사이트</label>
                <input type="text" value={editingSupplier.website} onChange={e => setEditingSupplier({ ...editingSupplier, website: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락 이메일</label>
                <input type="text" value={editingSupplier.contact} onChange={e => setEditingSupplier({ ...editingSupplier, contact: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>

              {/* ── 상세 설명 ── */}
              <div className="md:col-span-2 mt-4 mb-1 text-sm font-semibold text-gray-500">상세 설명</div>
              <BilingualInput label="짧은 설명" value={editingSupplier.description || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, description: v })} />
              <BilingualInput label="상세 설명" value={editingSupplier.descriptionFull || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, descriptionFull: v })} multiline />

              {/* ── 인증·역량·시장 ── */}
              <div className="md:col-span-2 mt-4 mb-1 text-sm font-semibold text-gray-500">인증·역량·시장</div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">인증 (복수 선택)</label>
                <div className="flex flex-wrap gap-2">
                  {[...new Set([...CERTIFICATION_OPTIONS, ...(editingSupplier.certifications || [])])].map((c: string) => {
                    const on = (editingSupplier.certifications || []).includes(c)
                    return (
                      <button type="button" key={c} onClick={() => {
                        const cur = editingSupplier.certifications || []
                        const next = on ? cur.filter((x: string) => x !== c) : [...cur, c]
                        setEditingSupplier({ ...editingSupplier, certifications: next })
                      }} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${on ? 'bg-[var(--color-theme-500)] text-white border-[var(--color-theme-500)]' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                        {c}
                      </button>
                    )
                  })}
                </div>
              </div>
              <BilingualArrayInput label="보유 역량" value={editingSupplier.capabilities || emptyBLArr} onChange={v => setEditingSupplier({ ...editingSupplier, capabilities: v })} />
              <BilingualArrayInput label="핵심 강점" value={editingSupplier.coreStrengths || emptyBLArr} onChange={v => setEditingSupplier({ ...editingSupplier, coreStrengths: v })} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">수출 시장 (복수 선택)</label>
                <div className="flex flex-wrap gap-2">
                  {[...new Set([...EXPORT_MARKET_OPTIONS, ...(editingSupplier.exportMarkets || [])])].map((m: string) => {
                    const on = (editingSupplier.exportMarkets || []).includes(m)
                    return (
                      <button type="button" key={m} onClick={() => {
                        const cur = editingSupplier.exportMarkets || []
                        const next = on ? cur.filter((x: string) => x !== m) : [...cur, m]
                        setEditingSupplier({ ...editingSupplier, exportMarkets: next })
                      }} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${on ? 'bg-[var(--color-theme-500)] text-white border-[var(--color-theme-500)]' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>
              <BilingualInput label="규제/인증 메모" value={editingSupplier.regulatoryNotes || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, regulatoryNotes: v })} />

              {/* ── 옵션 ── */}
              <div className="md:col-span-2 mt-4 mb-1 text-sm font-semibold text-gray-500">옵션</div>
              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingSupplier.featured} onChange={e => setEditingSupplier({ ...editingSupplier, featured: e.target.checked })} /> 추천</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingSupplier.verified} onChange={e => setEditingSupplier({ ...editingSupplier, verified: e.target.checked })} /> 검증</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingSupplier.ambassadorPick} onChange={e => setEditingSupplier({ ...editingSupplier, ambassadorPick: e.target.checked })} /> 앰버서더 픽</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button onClick={() => setModalType(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={saveSupplier} disabled={saving || !editingSupplier.name} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {saving ? '저장 중...' : modalMode === 'add' ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== Article Modal =================== */}
      {modalType === 'article' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalType(null)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{modalMode === 'add' ? '기사 추가' : '기사 수정'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BilingualInput label="제목" value={editingArticle.title || emptyBL} onChange={v => setEditingArticle({ ...editingArticle, title: v })} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">슬러그 (비우면 자동생성)</label>
                <input type="text" value={editingArticle.slug} onChange={e => setEditingArticle({ ...editingArticle, slug: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="제목에서 자동생성됩니다" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
                <input type="text" value={editingArticle.author} onChange={e => setEditingArticle({ ...editingArticle, author: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
                <select value={editingArticle.category} onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="MARKET">MARKET</option>
                  <option value="COMPANY">COMPANY</option>
                  <option value="PEOPLE">PEOPLE</option>
                  <option value="INSIGHT">INSIGHT</option>
                  <option value="PROMO">PROMO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                <select value={editingArticle.region} onChange={e => setEditingArticle({ ...editingArticle, region: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="Global">글로벌</option>
                  <option value="US">미국</option>
                  <option value="EU">유럽</option>
                  <option value="KR">한국</option>
                  <option value="ASIA">아시아</option>
                  <option value="ME">중동</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">발행일</label>
                <input type="date" value={editingArticle.publishedAt} onChange={e => setEditingArticle({ ...editingArticle, publishedAt: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                <input type="text" value={editingArticle.image} onChange={e => setEditingArticle({ ...editingArticle, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="파일 업로드 또는 https:// 붙여넣기" />
                <ImageUpload keyBase={`article-${editingId || Date.now()}`} onUploaded={url => setEditingArticle({ ...editingArticle, image: url })} />
                {editingArticle.image && (
                  <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden bg-gray-100 border">
                    <img src={editingArticle.image} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>
              <BilingualInput label="요약" value={editingArticle.summary || emptyBL} onChange={v => setEditingArticle({ ...editingArticle, summary: v })} required multiline />
              <BilingualInput label="본문" value={editingArticle.content || emptyBL} onChange={v => setEditingArticle({ ...editingArticle, content: v })} multiline />
              <BilingualArrayInput label="태그" value={editingArticle.tags || emptyBLArr} onChange={v => setEditingArticle({ ...editingArticle, tags: v })} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">관련 공급사 ID (쉼표로 구분)</label>
                <input type="text" value={arrToComma(editingArticle.relatedSuppliers)} onChange={e => setEditingArticle({ ...editingArticle, relatedSuppliers: commaToArr(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="1, 2, 3" />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={editingArticle.isHeadline || false} onChange={e => setEditingArticle({ ...editingArticle, isHeadline: e.target.checked })} className="w-5 h-5 accent-gray-900" />
                  <div>
                    <span className="font-semibold text-sm text-gray-900">헤드라인으로 설정</span>
                    <p className="text-xs text-gray-500 mt-0.5">홈 상단 대표 기사로 노출됩니다</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button onClick={() => setModalType(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={saveArticle} disabled={saving || !(editingArticle.title?.en || editingArticle.title?.ko)} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {saving ? '저장 중...' : modalMode === 'add' ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== Exhibition Modal =================== */}
      {modalType === 'exhibition' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalType(null)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{modalMode === 'add' ? '전시 추가' : '전시 수정'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BilingualInput label="전시명" value={editingExhibition.title || emptyBL} onChange={v => setEditingExhibition({ ...editingExhibition, title: v })} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기간</label>
                <input type="text" value={editingExhibition.dateRange} onChange={e => setEditingExhibition({ ...editingExhibition, dateRange: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="Mar 15-18, 2026" />
              </div>
              <BilingualInput label="장소" value={editingExhibition.location || emptyBL} onChange={v => setEditingExhibition({ ...editingExhibition, location: v })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                <select value={editingExhibition.region} onChange={e => setEditingExhibition({ ...editingExhibition, region: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="KR">한국</option>
                  <option value="ASIA">아시아</option>
                  <option value="EU">유럽</option>
                  <option value="ME">중동</option>
                  <option value="US">미주</option>
                  <option value="JP">일본</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select value={editingExhibition.status} onChange={e => setEditingExhibition({ ...editingExhibition, status: e.target.value as Exhibition['status'] })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="upcoming">예정</option>
                  <option value="past">종료</option>
                  <option value="planning">준비중</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                <input type="text" value={editingExhibition.image} onChange={e => setEditingExhibition({ ...editingExhibition, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="파일 업로드 또는 https:// 붙여넣기" />
                <ImageUpload keyBase={`exhibition-${editingId || Date.now()}`} onUploaded={url => setEditingExhibition({ ...editingExhibition, image: url })} />
                {editingExhibition.image && (
                  <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden bg-gray-100 border">
                    <img src={editingExhibition.image} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>
              <BilingualInput label="설명" value={editingExhibition.description || emptyBL} onChange={v => setEditingExhibition({ ...editingExhibition, description: v })} multiline />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">참가 공급사 ID (쉼표로 구분)</label>
                <input type="text" value={arrToComma(editingExhibition.supplierIds)} onChange={e => setEditingExhibition({ ...editingExhibition, supplierIds: commaToArr(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="1, 2, 3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관련 기사 ID (쉼표로 구분)</label>
                <input type="text" value={arrToComma(editingExhibition.articleIds || [])} onChange={e => setEditingExhibition({ ...editingExhibition, articleIds: commaToArr(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="1, 2" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button onClick={() => setModalType(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={saveExhibition} disabled={saving || !(editingExhibition.title?.en || editingExhibition.title?.ko)} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {saving ? '저장 중...' : modalMode === 'add' ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== Delete Confirmation Modal =================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-red-600">삭제 확인</h2>
            <p className="text-gray-700 mb-6">
              <strong>{deleteConfirm.name}</strong> 항목을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'supplier') handleDeleteSupplier(deleteConfirm.id)
                  else if (deleteConfirm.type === 'article') handleDeleteArticle(deleteConfirm.id)
                  else if (deleteConfirm.type === 'exhibition') handleDeleteExhibition(deleteConfirm.id)
                }}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== 양식 모음 (CSV 템플릿) Modal =================== */}
      {showForms && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForms(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">📋 양식 모음 (엑셀)</h2>
            <p className="text-sm text-gray-500 mb-5">
              엑셀(.xlsx) 양식을 내려받아 채운 뒤, 각 탭의 [⬆ 파일 업로드]로 한 번에 등록하세요. 유형·MOQ·상태 같은 칸은 <b>셀을 누르면 드롭다운</b>이 떠서 골라 넣습니다. 예시 2줄 포함.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <div className="font-semibold">공급사 양식</div>
                  <div className="text-xs text-gray-500 mt-0.5">업체명·유형·제품군·MOQ·인증 등 · 드롭다운 선택</div>
                </div>
                <button onClick={() => downloadTemplate('supplier')} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 whitespace-nowrap">⬇ 다운로드</button>
              </div>
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <div className="font-semibold">전시 양식</div>
                  <div className="text-xs text-gray-500 mt-0.5">전시명·기간·장소·지역·상태 등 · 드롭다운 선택</div>
                </div>
                <button onClick={() => downloadTemplate('exhibition')} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 whitespace-nowrap">⬇ 다운로드</button>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowForms(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* =================== EN 번역 프롬프트 Modal =================== */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPrompt(false)}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">🌐 EN 번역 프롬프트 (Claude)</h2>
            <p className="text-sm text-gray-500 mb-4">
              아래 프롬프트를 복사해 Claude에 붙여넣고, 그 아래에 KO를 채운 CSV를 붙이면 EN 열이 채워진 CSV를 돌려받습니다. 그 CSV를 업로드하세요.
            </p>
            <textarea
              readOnly
              value={TRANSLATE_PROMPT}
              className="w-full h-72 border rounded-lg p-3 text-[13px] font-mono text-gray-700 bg-gray-50 resize-none focus:outline-none"
              onFocus={e => e.currentTarget.select()}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowPrompt(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">닫기</button>
              <button
                onClick={async () => {
                  try { await navigator.clipboard.writeText(TRANSLATE_PROMPT) } catch {}
                  setPromptCopied(true)
                  setTimeout(() => setPromptCopied(false), 2000)
                }}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90"
              >
                {promptCopied ? '복사됨 ✓' : '프롬프트 복사'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공용 업로드 파일 입력 (공급사·전시 공유, .xlsx/.csv) */}
      <input ref={csvInputRef} type="file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleCSVFile} className="hidden" />

      {/* =================== CSV 업로드 미리보기 Modal =================== */}
      {csvPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !importing && setCsvPreview(null)}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">CSV 업로드 미리보기 · {CSV_CONFIG[csvPreview.kind].label}</h2>
            <p className="text-sm text-gray-500 mb-4">확정을 눌러야 실제로 반영됩니다. 파일에 없는 기존 데이터는 삭제되지 않습니다.</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-green-50 p-4 text-center"><div className="text-2xl font-bold text-green-700">{csvPreview.newCount}</div><div className="text-xs text-green-700 mt-1">신규</div></div>
              <div className="rounded-lg bg-blue-50 p-4 text-center"><div className="text-2xl font-bold text-blue-700">{csvPreview.updateCount}</div><div className="text-xs text-blue-700 mt-1">수정</div></div>
              <div className="rounded-lg bg-red-50 p-4 text-center"><div className="text-2xl font-bold text-red-600">{csvPreview.errorCount}</div><div className="text-xs text-red-600 mt-1">오류(제외)</div></div>
            </div>
            <div className="border rounded-lg divide-y max-h-64 overflow-y-auto text-sm">
              {csvPreview.items.slice(0, 30).map((it, i) => {
                const existing = !!(it.id && CSV_CONFIG[csvPreview.kind].list.some((s: any) => s.id === it.id))
                const label = it.data?.name || it.data?.title?.ko || it.data?.title?.en || '(제목 없음)'
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2">
                    <span className={it.error ? 'text-red-500' : 'text-gray-800'}>
                      {it.error ? `⚠ ${i + 1}행: ${it.error}` : `${label} (번호 ${it.id || '자동'})`}
                    </span>
                    {!it.error && (
                      <span className={`text-xs px-2 py-0.5 rounded ${existing ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {existing ? '수정' : '신규'}
                      </span>
                    )}
                  </div>
                )
              })}
              {csvPreview.items.length > 30 && <div className="px-3 py-2 text-xs text-gray-400">… 외 {csvPreview.items.length - 30}행</div>}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setCsvPreview(null)} disabled={importing} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">취소</button>
              <button onClick={confirmImport} disabled={importing || (csvPreview.newCount + csvPreview.updateCount === 0)} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {importing ? '반영 중…' : `${csvPreview.newCount + csvPreview.updateCount}건 반영`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
