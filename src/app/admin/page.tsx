'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Supplier, Article, Exhibition, BL, BLArray } from '@/lib/types'
import { bl, blArr, SUPPLIER_TYPES, PRODUCT_CATEGORIES } from '@/lib/types'

// --------------- Auth types ---------------
type AdminRole = 'super' | 'admin'
interface AdminUser {
  id: string
  role: AdminRole
  name: string
}

interface InquiryRequest {
  id: string
  type: 'sourcing' | 'partnership' | 'support' | 'general'
  category: string
  targetMarkets: string[]
  company: string
  contactPerson: string
  email: string
  phone: string
  createdAt: string
  status: 'new' | 'reviewed' | 'matched' | 'closed'
}

interface MatchingRequest {
  id: string
  inquiryType: string
  category: string
  targetMarkets: string[]
  quantity: string
  timeframe: string
  budget: string
  company: string
  contactPerson: string
  email: string
  phone: string
  createdAt: string
  status: 'new' | 'in_progress' | 'matched' | 'closed'
  matchedSuppliers: string[]
}

type TabType = 'inquiries' | 'matching' | 'suppliers' | 'articles' | 'exhibitions' | 'settings'

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
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">EN</span>
          <Tag
            value={value?.en || ''}
            onChange={(e: any) => onChange({ ...value, en: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
            {...(multiline ? { rows: 3 } : {})}
          />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">KO</span>
          <Tag
            value={value?.ko || ''}
            onChange={(e: any) => onChange({ ...value, ko: e.target.value })}
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
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">EN (comma-separated)</span>
          <input
            type="text"
            value={arrToComma(value?.en || [])}
            onChange={e => onChange({ ...value, en: commaToArr(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">KO (comma-separated)</span>
          <input
            type="text"
            value={arrToComma(value?.ko || [])}
            onChange={e => onChange({ ...value, ko: commaToArr(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>
    </div>
  )
}

// --------------- Default form values ---------------
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
        setLoginError(data.error || 'Login failed')
      } else {
        setUser(data.user)
        sessionStorage.setItem('adminUser', JSON.stringify(data.user))
      }
    } catch {
      setLoginError('Network error')
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    setUser(null)
    sessionStorage.removeItem('adminUser')
  }

  const isSuper = user?.role === 'super'

  const [activeTab, setActiveTab] = useState<TabType>('inquiries')

  // --- Inquiries & Matching (local state, unchanged) ---
  const [inquiries, setInquiries] = useState<InquiryRequest[]>([
    {
      id: 'INQ-001', type: 'sourcing', category: 'OEM Manufacturing',
      targetMarkets: ['United States', 'EU Countries'], company: 'BeautyBrand Inc',
      contactPerson: 'John Smith', email: 'john@beautybrand.com', phone: '+1-555-1234',
      createdAt: '2026-01-30', status: 'new'
    },
    {
      id: 'INQ-002', type: 'partnership', category: 'Packaging',
      targetMarkets: ['Asia'], company: 'Green Cosmetics Ltd',
      contactPerson: 'Sarah Kim', email: 'sarah@greencos.com', phone: '+82-2-1234-5678',
      createdAt: '2026-01-29', status: 'reviewed'
    }
  ])

  const [matchingRequests, setMatchingRequests] = useState<MatchingRequest[]>([
    {
      id: 'MATCH-001', inquiryType: 'sourcing', category: 'OEM Manufacturing',
      targetMarkets: ['United States', 'Canada'], quantity: '10,000 units/year',
      timeframe: 'short', budget: '$5-10', company: 'Premium Beauty Co',
      contactPerson: 'Emma Johnson', email: 'emma@premiumbeauty.com', phone: '+1-555-5678',
      createdAt: '2026-01-28', status: 'in_progress', matchedSuppliers: ['1', '4']
    }
  ])

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

  useEffect(() => {
    fetchSuppliers()
    fetchArticles()
    fetchExhibitions()
    fetch('/api/settings').then(r => r.json()).then(data => setSiteSettings(prev => ({ ...prev, ...data }))).catch(() => {})
  }, [fetchSuppliers, fetchArticles, fetchExhibitions])

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
  const updateInquiryStatus = (id: string, status: InquiryRequest['status']) => {
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status } : inq))
  }

  const updateMatchingStatus = (id: string, status: MatchingRequest['status']) => {
    setMatchingRequests(matchingRequests.map(req => req.id === id ? { ...req, status } : req))
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
            <h1 className="text-3xl font-black text-gray-900 mb-2">PICKCOS Admin</h1>
            <p className="text-gray-500 text-sm">Sign in to access the dashboard</p>
          </div>
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{loginError}</div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input
                type="text"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-lg"
                placeholder="Enter your ID"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={loginPw}
                onChange={e => setLoginPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-lg"
                placeholder="Enter your password"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loginLoading || !loginId || !loginPw}
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors text-lg mt-2"
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">Back to Site</Link>
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
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSuper ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 text-white'}`}>
                {isSuper ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm hidden md:inline">{user.name} ({user.id})</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-white/20 text-white font-semibold rounded hover:bg-white/30">
                Logout
              </button>
              <Link href="/" className="px-4 py-2 bg-white text-primary font-semibold rounded hover:bg-gray-100">
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">Total Inquiries</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.totalInquiries}</p>
            <p className="text-xs text-gray-500 mt-2">{stats.newInquiries} new</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">Matching Requests</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.totalMatching}</p>
            <p className="text-xs text-gray-500 mt-2">{stats.completedMatching} completed</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">Active Suppliers</p>
            <p className="text-3xl font-bold text-primary mt-2">{suppliers.length}</p>
            <p className="text-xs text-gray-500 mt-2">{suppliers.filter(s => s.verified).length} verified</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">Articles Published</p>
            <p className="text-3xl font-bold text-primary mt-2">{articles.length}</p>
            <p className="text-xs text-gray-500 mt-2">{exhibitions.length} exhibitions</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b overflow-x-auto">
            {(['inquiries', 'matching', 'suppliers', 'articles', 'exhibitions', ...(isSuper ? ['settings'] : [])] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-semibold text-center transition-colors whitespace-nowrap ${
                  activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'inquiries' ? `Inquiries (${stats.totalInquiries})`
                  : tab === 'matching' ? `Matching (${stats.totalMatching})`
                  : tab === 'suppliers' ? `Suppliers (${suppliers.length})`
                  : tab === 'articles' ? `Articles (${articles.length})`
                  : tab === 'exhibitions' ? `Exhibitions (${exhibitions.length})`
                  : 'Settings'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* =================== Inquiries Tab =================== */}
            {activeTab === 'inquiries' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Inquiries</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b-2">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Company</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-primary">{inq.id}</td>
                          <td className="px-4 py-3">{inq.company}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div>{inq.contactPerson}</div>
                              <div className="text-gray-500">{inq.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize">{inq.type}</td>
                          <td className="px-4 py-3">{inq.category}</td>
                          <td className="px-4 py-3">{inq.createdAt}</td>
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
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="matched">Matched</option>
                              <option value="closed">Closed</option>
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
                <h2 className="text-2xl font-bold mb-6">Supplier Matching Requests</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b-2">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Company</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Quantity</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Matched</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchingRequests.map((req) => (
                        <tr key={req.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-primary">{req.id}</td>
                          <td className="px-4 py-3">{req.company}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div>{req.contactPerson}</div>
                              <div className="text-gray-500">{req.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{req.category}</td>
                          <td className="px-4 py-3">{req.quantity}</td>
                          <td className="px-4 py-3">{req.createdAt}</td>
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
                              <option value="new">New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="matched">Matched</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {req.matchedSuppliers.map((id) => (
                                <span key={id} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                  Supplier {id}
                                </span>
                              ))}
                            </div>
                          </td>
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Suppliers Management</h2>
                  <button onClick={() => openSupplierModal('add')} className="px-4 py-2 bg-primary text-white font-semibold rounded hover:opacity-90">
                    + Add Supplier
                  </button>
                </div>
                <div className="space-y-4">
                  {suppliers.map((s) => (
                    <div key={s.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow">
                      <div>
                        <h3 className="font-bold text-lg">{s.name}</h3>
                        <p className="text-gray-600 text-sm">ID: {s.id} | {s.category} | {typeof s.location === 'string' ? s.location : s.location?.en}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openSupplierModal('edit', s)} className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary/10">
                          Edit
                        </button>
                        <button onClick={() => setDeleteConfirm({ type: 'supplier', id: s.id, name: s.name })} className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {suppliers.length === 0 && <p className="text-gray-500 text-center py-8">No suppliers found.</p>}
                </div>
              </div>
            )}

            {/* =================== Articles Tab =================== */}
            {activeTab === 'articles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Articles Management</h2>
                  <button onClick={() => openArticleModal('add')} className="px-4 py-2 bg-primary text-white font-semibold rounded hover:opacity-90">
                    + Add Article
                  </button>
                </div>
                <div className="space-y-4">
                  {articles.map((a) => (
                    <div key={a.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{typeof a.title === 'string' ? a.title : a.title?.en}</h3>
                          {a.isHeadline && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded uppercase">Headline</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">ID: {a.id} | {a.category} | {a.publishedAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openArticleModal('edit', a)} className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary/10">
                          Edit
                        </button>
                        <button onClick={() => setDeleteConfirm({ type: 'article', id: a.id, name: typeof a.title === 'string' ? a.title : a.title?.en })} className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {articles.length === 0 && <p className="text-gray-500 text-center py-8">No articles found.</p>}
                </div>
              </div>
            )}

            {/* =================== Exhibitions Tab =================== */}
            {activeTab === 'exhibitions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Exhibitions Management</h2>
                  <button onClick={() => openExhibitionModal('add')} className="px-4 py-2 bg-primary text-white font-semibold rounded hover:opacity-90">
                    + Add Exhibition
                  </button>
                </div>
                <div className="space-y-4">
                  {exhibitions.map((e) => (
                    <div key={e.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow">
                      <div>
                        <h3 className="font-bold text-lg">{typeof e.title === 'string' ? e.title : e.title?.en}</h3>
                        <p className="text-gray-600 text-sm">ID: {e.id} | {e.dateRange} | {typeof e.location === 'string' ? e.location : e.location?.en}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                          e.status === 'upcoming' ? 'bg-green-100 text-green-700' : e.status === 'past' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                        }`}>{e.status}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openExhibitionModal('edit', e)} className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary/10">
                          Edit
                        </button>
                        <button onClick={() => setDeleteConfirm({ type: 'exhibition', id: e.id, name: typeof e.title === 'string' ? e.title : e.title?.en })} className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {exhibitions.length === 0 && <p className="text-gray-500 text-center py-8">No exhibitions found.</p>}
                </div>
              </div>
            )}

            {/* =================== Settings Tab =================== */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
                {settingsSaved && (
                  <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">Settings saved successfully!</div>
                )}
                <div className="space-y-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Hero Background Image</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input type="text" value={siteSettings.heroBackgroundImage} onChange={(e) => setSiteSettings(prev => ({ ...prev, heroBackgroundImage: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Enter image URL or path (e.g. /images/bg-hero.svg)" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                        <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200">
                          <img src={siteSettings.heroBackgroundImage} alt="Hero Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          <div className="absolute inset-0 bg-white/85" />
                          <div className="absolute inset-0 flex items-center justify-center"><p className="text-gray-900 font-bold text-lg">Background Preview</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Hero Text</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                        <input type="text" value={siteSettings.heroSubtitle} onChange={(e) => setSiteSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Title (use \n for line breaks)</label>
                        <textarea value={siteSettings.heroTitle} onChange={(e) => setSiteSettings(prev => ({ ...prev, heroTitle: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea value={siteSettings.heroDescription} onChange={(e) => setSiteSettings(prev => ({ ...prev, heroDescription: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={saveSettings} disabled={settingsLoading} className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
                      {settingsLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow text-center text-gray-600 text-sm">
          <p>PICKCOS Admin Dashboard</p>
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
          title={`Add new ${activeTab.slice(0, -1)}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="absolute right-20 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Add {activeTab === 'suppliers' ? 'Supplier' : activeTab === 'articles' ? 'Article' : 'Exhibition'}
          </span>
        </button>
      )}

      {/* =================== Supplier Modal =================== */}
      {modalType === 'supplier' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalType(null)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{modalMode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={editingSupplier.name} onChange={e => setEditingSupplier({ ...editingSupplier, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier type · 공급자 유형 *</label>
                <select value={editingSupplier.category} onChange={e => setEditingSupplier({ ...editingSupplier, category: e.target.value as Supplier['category'] })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  {SUPPLIER_TYPES.map(s => <option key={s.code} value={s.code}>{s.en} · {s.ko}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product categories · 제품군</label>
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
                        {p.en} · {p.ko}
                      </button>
                    )
                  })}
                </div>
              </div>
              <BilingualInput label="Supplier Type" value={editingSupplier.supplierType || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, supplierType: v })} />
              <BilingualInput label="Location" value={editingSupplier.location || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, location: v })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" value={editingSupplier.country} onChange={e => setEditingSupplier({ ...editingSupplier, country: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" value={editingSupplier.image} onChange={e => setEditingSupplier({ ...editingSupplier, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="https://..." />
                {editingSupplier.image && (
                  <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden bg-gray-100 border">
                    <img src={editingSupplier.image} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MOQ</label>
                <input type="number" value={editingSupplier.moq} onChange={e => setEditingSupplier({ ...editingSupplier, moq: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (days)</label>
                <input type="number" value={editingSupplier.leadTime} onChange={e => setEditingSupplier({ ...editingSupplier, leadTime: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MOQ Range</label>
                <input type="text" value={editingSupplier.moqRange} onChange={e => setEditingSupplier({ ...editingSupplier, moqRange: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="1,000 - 50,000 units" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time Range</label>
                <input type="text" value={editingSupplier.leadTimeRange} onChange={e => setEditingSupplier({ ...editingSupplier, leadTimeRange: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="45 - 90 days" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="text" value={editingSupplier.website} onChange={e => setEditingSupplier({ ...editingSupplier, website: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input type="text" value={editingSupplier.contact} onChange={e => setEditingSupplier({ ...editingSupplier, contact: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <BilingualInput label="Short Description" value={editingSupplier.description || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, description: v })} />
              <BilingualInput label="Full Description" value={editingSupplier.descriptionFull || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, descriptionFull: v })} multiline />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications (comma-separated)</label>
                <input type="text" value={arrToComma(editingSupplier.certifications)} onChange={e => setEditingSupplier({ ...editingSupplier, certifications: commaToArr(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="ISO 22716, GMPC" />
              </div>
              <BilingualArrayInput label="Capabilities" value={editingSupplier.capabilities || emptyBLArr} onChange={v => setEditingSupplier({ ...editingSupplier, capabilities: v })} />
              <BilingualArrayInput label="Core Strengths" value={editingSupplier.coreStrengths || emptyBLArr} onChange={v => setEditingSupplier({ ...editingSupplier, coreStrengths: v })} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Export Markets (comma-separated)</label>
                <input type="text" value={arrToComma(editingSupplier.exportMarkets)} onChange={e => setEditingSupplier({ ...editingSupplier, exportMarkets: commaToArr(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="United States, Japan, EU Countries" />
              </div>
              <BilingualInput label="Regulatory Notes" value={editingSupplier.regulatoryNotes || emptyBL} onChange={v => setEditingSupplier({ ...editingSupplier, regulatoryNotes: v })} />
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingSupplier.featured} onChange={e => setEditingSupplier({ ...editingSupplier, featured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingSupplier.verified} onChange={e => setEditingSupplier({ ...editingSupplier, verified: e.target.checked })} /> Verified</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingSupplier.ambassadorPick} onChange={e => setEditingSupplier({ ...editingSupplier, ambassadorPick: e.target.checked })} /> Ambassador Pick</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button onClick={() => setModalType(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={saveSupplier} disabled={saving || !editingSupplier.name} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {saving ? 'Saving...' : modalMode === 'add' ? 'Create Supplier' : 'Update Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== Article Modal =================== */}
      {modalType === 'article' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalType(null)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{modalMode === 'add' ? 'Add New Article' : 'Edit Article'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BilingualInput label="Title" value={editingArticle.title || emptyBL} onChange={v => setEditingArticle({ ...editingArticle, title: v })} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (auto-generated if empty)</label>
                <input type="text" value={editingArticle.slug} onChange={e => setEditingArticle({ ...editingArticle, slug: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="auto-generated-from-title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input type="text" value={editingArticle.author} onChange={e => setEditingArticle({ ...editingArticle, author: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={editingArticle.category} onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="MARKET">MARKET</option>
                  <option value="COMPANY">COMPANY</option>
                  <option value="PEOPLE">PEOPLE</option>
                  <option value="INSIGHT">INSIGHT</option>
                  <option value="PROMO">PROMO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select value={editingArticle.region} onChange={e => setEditingArticle({ ...editingArticle, region: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="Global">Global</option>
                  <option value="US">US</option>
                  <option value="EU">EU</option>
                  <option value="KR">KR</option>
                  <option value="ASIA">Asia</option>
                  <option value="ME">Middle East</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                <input type="date" value={editingArticle.publishedAt} onChange={e => setEditingArticle({ ...editingArticle, publishedAt: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" value={editingArticle.image} onChange={e => setEditingArticle({ ...editingArticle, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="https://..." />
                {editingArticle.image && (
                  <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden bg-gray-100 border">
                    <img src={editingArticle.image} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>
              <BilingualInput label="Summary" value={editingArticle.summary || emptyBL} onChange={v => setEditingArticle({ ...editingArticle, summary: v })} required multiline />
              <BilingualInput label="Content" value={editingArticle.content || emptyBL} onChange={v => setEditingArticle({ ...editingArticle, content: v })} multiline />
              <BilingualArrayInput label="Tags" value={editingArticle.tags || emptyBLArr} onChange={v => setEditingArticle({ ...editingArticle, tags: v })} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Supplier IDs (comma-separated)</label>
                <input type="text" value={arrToComma(editingArticle.relatedSuppliers)} onChange={e => setEditingArticle({ ...editingArticle, relatedSuppliers: commaToArr(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="1, 2, 3" />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={editingArticle.isHeadline || false} onChange={e => setEditingArticle({ ...editingArticle, isHeadline: e.target.checked })} className="w-5 h-5 accent-gray-900" />
                  <div>
                    <span className="font-semibold text-sm text-gray-900">Set as Headline</span>
                    <p className="text-xs text-gray-500 mt-0.5">This article will appear as the main headline on the homepage</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button onClick={() => setModalType(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={saveArticle} disabled={saving || !(editingArticle.title?.en || editingArticle.title?.ko)} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {saving ? 'Saving...' : modalMode === 'add' ? 'Create Article' : 'Update Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== Exhibition Modal =================== */}
      {modalType === 'exhibition' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalType(null)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{modalMode === 'add' ? 'Add New Exhibition' : 'Edit Exhibition'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BilingualInput label="Title" value={editingExhibition.title || emptyBL} onChange={v => setEditingExhibition({ ...editingExhibition, title: v })} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <input type="text" value={editingExhibition.dateRange} onChange={e => setEditingExhibition({ ...editingExhibition, dateRange: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="Mar 15-18, 2026" />
              </div>
              <BilingualInput label="Location" value={editingExhibition.location || emptyBL} onChange={v => setEditingExhibition({ ...editingExhibition, location: v })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select value={editingExhibition.region} onChange={e => setEditingExhibition({ ...editingExhibition, region: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="KR">Korea</option>
                  <option value="ASIA">Asia</option>
                  <option value="EU">Europe</option>
                  <option value="ME">Middle East</option>
                  <option value="US">Americas</option>
                  <option value="JP">Japan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editingExhibition.status} onChange={e => setEditingExhibition({ ...editingExhibition, status: e.target.value as Exhibition['status'] })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="planning">Planning</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" value={editingExhibition.image} onChange={e => setEditingExhibition({ ...editingExhibition, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="https://..." />
                {editingExhibition.image && (
                  <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden bg-gray-100 border">
                    <img src={editingExhibition.image} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>
              <BilingualInput label="Description" value={editingExhibition.description || emptyBL} onChange={v => setEditingExhibition({ ...editingExhibition, description: v })} multiline />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier IDs (comma-separated)</label>
                <input type="text" value={arrToComma(editingExhibition.supplierIds)} onChange={e => setEditingExhibition({ ...editingExhibition, supplierIds: commaToArr(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="1, 2, 3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Article IDs (comma-separated)</label>
                <input type="text" value={arrToComma(editingExhibition.articleIds || [])} onChange={e => setEditingExhibition({ ...editingExhibition, articleIds: commaToArr(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" placeholder="1, 2" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button onClick={() => setModalType(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={saveExhibition} disabled={saving || !(editingExhibition.title?.en || editingExhibition.title?.ko)} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {saving ? 'Saving...' : modalMode === 'add' ? 'Create Exhibition' : 'Update Exhibition'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== Delete Confirmation Modal =================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'supplier') handleDeleteSupplier(deleteConfirm.id)
                  else if (deleteConfirm.type === 'article') handleDeleteArticle(deleteConfirm.id)
                  else if (deleteConfirm.type === 'exhibition') handleDeleteExhibition(deleteConfirm.id)
                }}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
